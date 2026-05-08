export const prerender = false;

import type { APIRoute } from "astro";
import {
  buildFormationSurveyAirtableFields,
  buildFormationSurveyEmail,
  validateFormationSurveyPayload,
} from "../../../lib/server/formationSurvey.js";
import { createWorkspaceTransport, resolveMailRoute } from "../../../lib/server/workspaceMail.js";

const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX = 8;
const EXPECTED_AIRTABLE_TABLE_NAME = "Etude_IA_2026";

function rateLimit(ip: string) {
  const now = Date.now();
  const cur = hits.get(ip);

  if (!cur || now - cur.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return true;
  }

  if (cur.count >= MAX) return false;

  cur.count += 1;
  return true;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip)) {
      return new Response(JSON.stringify({ ok: false, error: "rate_limited" }), {
        status: 429,
        headers: { "content-type": "application/json" },
      });
    }

    if (!(request.headers.get("content-type") || "").includes("application/json")) {
      return new Response(JSON.stringify({ ok: false, error: "bad_request" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const body = await request.json();
    const validation = validateFormationSurveyPayload(body);

    if (!validation.ok) {
      return new Response(JSON.stringify({ ok: false, error: validation.error }), {
        status: validation.status,
        headers: { "content-type": "application/json" },
      });
    }

    const data = validation.data;

    if (!data) {
      return new Response(JSON.stringify({ ok: false, error: "server_error" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    if (data.honeypot) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    const apiKey = import.meta.env.AIRTABLE_API_KEY;
    const baseId = import.meta.env.AIRTABLE_BASE_ID;
    const tableName = import.meta.env.AIRTABLE_TABLE_NAME;

    if (!apiKey || !baseId || !tableName || tableName !== EXPECTED_AIRTABLE_TABLE_NAME) {
      console.error("FORMATION_SURVEY_AIRTABLE_CONFIG_ERROR", {
        hasApiKey: Boolean(apiKey),
        hasBaseId: Boolean(baseId),
        hasTableName: Boolean(tableName),
        tableNameMatchesExpected: tableName === EXPECTED_AIRTABLE_TABLE_NAME,
      });

      return new Response(JSON.stringify({ ok: false, error: "server_misconfigured" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    const fields = buildFormationSurveyAirtableFields(data);

    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [{ fields }],
        }),
      }
    );

    if (!airtableResponse.ok) {
      const airtableError = await airtableResponse.json().catch(() => null);

      console.error("FORMATION_SURVEY_AIRTABLE_ERROR", {
        status: airtableResponse.status,
        type: airtableError?.error?.type,
        message: airtableError?.error?.message,
      });

      return new Response(JSON.stringify({ ok: false, error: "capture_failed" }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }

    try {
      const { from, to } = resolveMailRoute(import.meta.env, {
        toKey: "FORMATION_SURVEY_MAIL_TO",
        fallbackTo: "ali.zouari@opus-tek.ca",
      });
      const transporter = createWorkspaceTransport(import.meta.env);
      const mail = buildFormationSurveyEmail(data, { ip });

      await transporter.sendMail({
        from,
        to,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      });
    } catch (error) {
      console.error("FORMATION_SURVEY_MAIL_WARNING", {
        message: error instanceof Error ? error.message : "unknown mail error",
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("FORMATION_SURVEY_API_ERROR", error);

    return new Response(JSON.stringify({ ok: false, error: "server_error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};

