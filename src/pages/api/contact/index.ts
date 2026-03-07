export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX = 6;

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
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();
    const company = String(body?.company || "").trim();

    // Honeypot
    const website = String(body?.website || "").trim();
    if (website) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ ok: false, error: "missing_fields" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return new Response(JSON.stringify({ ok: false, error: "invalid_email" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const subject = `Nouveau message site OPUS — ${name}`;
    const text =
`Nouveau message depuis le site OPUS

Nom: ${name}
Email: ${email}
Entreprise: ${company || "-"}
IP: ${ip}

Message:
${message}
`;

    // IMPORTANT: from doit être validé chez Resend (domaine) en prod.
   // const from = import.meta.env.MAIL_FROM || "onboarding@resend.dev";
    // from = "onboarding@resend.dev";
const from = import.meta.env.MAIL_FROM || "onboarding@resend.dev";
const to = "ali.zouari@opus-tek.ca";

    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
  console.error("CONTACT_API_ERROR:", err);
  return new Response(
    JSON.stringify({
      ok: false,
      error: "server_error",
      detail: err?.message || String(err),
    }),
    { status: 500, headers: { "content-type": "application/json" } }
  );
}
};