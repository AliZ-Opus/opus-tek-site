import nodemailer from "nodemailer";

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function createWorkspaceTransport(env = import.meta.env) {
  const user = env.GOOGLE_WORKSPACE_SMTP_USER;
  const pass = env.GOOGLE_WORKSPACE_SMTP_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Missing workspace SMTP configuration");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

export function resolveMailRoute(env = import.meta.env, options = {}) {
  const smtpUser = env.GOOGLE_WORKSPACE_SMTP_USER;
  const from = env.MAIL_FROM || smtpUser;
  const preferredTo = options.toKey ? env[options.toKey] : undefined;
  const to = preferredTo || env.MAIL_TO || options.fallbackTo || smtpUser;

  if (!from || !to) {
    throw new Error("Missing mail routing configuration");
  }

  return { from, to, smtpUser };
}
