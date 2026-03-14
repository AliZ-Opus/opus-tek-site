export const prerender = false;

import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getTransporter() {
  const user = import.meta.env.GOOGLE_WORKSPACE_SMTP_USER;
  const pass = import.meta.env.GOOGLE_WORKSPACE_SMTP_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Missing GOOGLE_WORKSPACE_SMTP_USER or GOOGLE_WORKSPACE_SMTP_APP_PASSWORD");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });
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
    const company = String(body?.company || "").trim();
    const message = String(body?.message || "").trim();
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

    const smtpUser = import.meta.env.GOOGLE_WORKSPACE_SMTP_USER;
    const from = import.meta.env.MAIL_FROM || smtpUser;
    const to = import.meta.env.MAIL_TO || "ali.zouari@opus-tek.ca";

    if (!from || !to) {
      throw new Error("Missing MAIL_FROM/MAIL_TO configuration");
    }

    const subject = `Nouveau message site OPUS — ${name}`;

    const text = [
      "Nouveau message depuis le site OPUS",
      "",
      `Nom: ${name}`,
      `Email: ${email}`,
      `Entreprise: ${company || "-"}`,
      `IP: ${ip}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;">
        <h2 style="margin:0 0 18px 0;">Nouveau message depuis le site OPUS</h2>
        <table style="border-collapse:collapse;width:100%;max-width:760px;">
          <tr>
            <td style="padding:8px 0;font-weight:700;width:140px;">Nom</td>
            <td style="padding:8px 0;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:700;">Email</td>
            <td style="padding:8px 0;">${escapeHtml(email)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:700;">Entreprise</td>
            <td style="padding:8px 0;">${escapeHtml(company || "-")}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:700;">IP</td>
            <td style="padding:8px 0;">${escapeHtml(ip)}</td>
          </tr>
        </table>
        <div style="margin-top:24px;padding:16px;border:1px solid #e5e7eb;background:#fafafa;">
          <div style="font-weight:700;margin-bottom:10px;">Message</div>
          <div style="white-space:pre-wrap;">${escapeHtml(message)}</div>
        </div>
      </div>
    `;

    const transporter = getTransporter();

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject,
      text,
      html,
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
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
};