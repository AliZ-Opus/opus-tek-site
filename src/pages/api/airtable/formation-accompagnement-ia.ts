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
const JSON_HEADERS = { "content-type": "application/json" };

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

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS,
  });
}

function sanitizeAirtableDetail(value: unknown) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return text.slice(0, 1200);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip)) {
      return json({ ok: false, error: "rate_limited" }, 429);
    }

    if (!(request.headers.get("content-type") || "").includes("application/json")) {
      return json({ ok: false, error: "bad_request" }, 400);
    }

    const body = await request.json();
    const validation = validateFormationSurveyPayload(body);

    if (!validation.ok) {
      return json({ ok: false, error: validation.error }, validation.status);
    }

    const data = validation.data;

    if (!data) {
      return json({ ok: false, error: "server_error" }, 500);
    }

    if (data.honeypot) {
      return json({ ok: true });
    }

    const apiKey = String(import.meta.env.AIRTABLE_API_KEY || "").trim();
    const baseId = String(import.meta.env.AIRTABLE_BASE_ID || "").trim();
    const tableName = String(import.meta.env.AIRTABLE_TABLE_NAME || "").trim();

    console.info("FORMATION_SURVEY_AIRTABLE_CONFIG", {
      hasApiKey: Boolean(apiKey),
      hasBaseId: Boolean(baseId),
      hasTableName: Boolean(tableName),
      tableName,
    });

    if (!apiKey || !baseId || !tableName || tableName !== EXPECTED_AIRTABLE_TABLE_NAME) {
      console.error("FORMATION_SURVEY_AIRTABLE_CONFIG_ERROR", {
        hasApiKey: Boolean(apiKey),
        hasBaseId: Boolean(baseId),
        hasTableName: Boolean(tableName),
        tableName,
        tableNameMatchesExpected: tableName === EXPECTED_AIRTABLE_TABLE_NAME,
      });

      return json({ ok: false, error: "server_misconfigured" }, 500);
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
      const airtableBody = await airtableResponse.text().catch(() => "");
      const detail = sanitizeAirtableDetail(airtableBody || "Airtable request failed");

      console.error("FORMATION_SURVEY_AIRTABLE_ERROR", {
        status: airtableResponse.status,
        body: detail,
      });

      return json({ ok: false, error: "airtable_error", detail }, 502);
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

    return json({ ok: true });
  } catch (error) {
    console.error("FORMATION_SURVEY_API_ERROR", {
      message: error instanceof Error ? error.message : "unknown server error",
    });

    return json({ ok: false, error: "server_error" }, 500);
  }
};

