import { escapeHtml } from "./workspaceMail.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeText(value, maxLength = 240) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function normalizeMultiline(value, maxLength = 2000) {
  return String(value || "").trim().replace(/\r\n/g, "\n").slice(0, maxLength);
}

export function joinValues(value) {
  if (!Array.isArray(value)) return typeof value === "string" ? value : "";
  return value
    .map((item) => normalizeText(item, 120))
    .filter(Boolean)
    .join(" | ");
}

export function validateFormationSurveyPayload(body) {
  const firstName = normalizeText(body?.first_name, 120);
  const lastName = normalizeText(body?.last_name, 120);
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  const email = normalizeText(body?.email, 180).toLowerCase();
  const countryRegion = normalizeText(body?.country_region, 180);
  const profileType = normalizeText(body?.profile_type, 180);
  const currentLevel = normalizeText(body?.current_level, 180);
  const interestMain = normalizeText(body?.interest_main, 180);
  const formatPreference = normalizeText(body?.format_preference, 120);
  const startTimeline = normalizeText(body?.start_timeline, 120);
  const comments = normalizeMultiline(body?.comments, 2000);
  const website = normalizeText(body?.website, 200);
  const priorityTopics = Array.isArray(body?.priority_topics)
    ? [...new Set(body.priority_topics.map((item) => normalizeText(item, 120)).filter(Boolean))].slice(0, 8)
    : [];

  if (website) {
    return { ok: true, data: { website, honeypot: true } };
  }

  if (
    !fullName ||
    !email ||
    !countryRegion ||
    !profileType ||
    !currentLevel ||
    !interestMain ||
    !formatPreference ||
    !startTimeline
  ) {
    return { ok: false, status: 400, error: "missing_fields" };
  }

  if (!EMAIL_RE.test(email)) {
    return { ok: false, status: 400, error: "invalid_email" };
  }

  if (!priorityTopics.length) {
    return { ok: false, status: 400, error: "missing_topics" };
  }

  return {
    ok: true,
    data: {
      firstName,
      lastName,
      fullName,
      email,
      countryRegion,
      profileType,
      currentLevel,
      interestMain,
      priorityTopics,
      formatPreference,
      startTimeline,
      comments,
      website: "",
      honeypot: false,
    },
  };
}

export function buildFormationSurveyAirtableFields(data, createdAt = new Date().toISOString()) {
  const comments = [
    `Parcours vise: ${data.interestMain}`,
    `Thematiques prioritaires: ${joinValues(data.priorityTopics)}`,
    `Format prefere: ${data.formatPreference}`,
    `Horizon de demarrage: ${data.startTimeline}`,
    `Commentaire libre: ${data.comments || "-"}`,
  ].join("\n");

  return {
    "First Name": data.firstName,
    "Last Name": data.lastName,
    Email: data.email,
    Country: data.countryRegion,
    "Profile Type": data.profileType,
    "Study Year": data.currentLevel,
    "Offer Preference": data.interestMain,
    "Single Offer Choice": data.formatPreference,
    "Opening Intent": data.startTimeline,
    "Program Types": joinValues(data.priorityTopics),
    Comments: comments,
    Source: "opus-site-formation-ia",
    "Created From": "website",
    "Created At": createdAt,
  };
}

export function buildFormationSurveyEmail(data, meta = {}) {
  const subject = `Nouveau sondage Formation IA - ${data.fullName}`;
  const text = [
    "Nouveau sondage Formation & accompagnement IA",
    "",
    `Nom: ${data.fullName}`,
    `Email: ${data.email}`,
    `Pays / region: ${data.countryRegion}`,
    `Profil: ${data.profileType}`,
    `Niveau actuel: ${data.currentLevel}`,
    `Interet principal: ${data.interestMain}`,
    `Thematiques prioritaires: ${joinValues(data.priorityTopics)}`,
    `Format prefere: ${data.formatPreference}`,
    `Horizon de demarrage: ${data.startTimeline}`,
    `IP: ${meta.ip || "unknown"}`,
    "",
    "Commentaire libre:",
    data.comments || "-",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;">
      <h2 style="margin:0 0 18px 0;">Nouveau sondage Formation & accompagnement IA</h2>
      <table style="border-collapse:collapse;width:100%;max-width:760px;">
        <tr><td style="padding:8px 0;font-weight:700;width:220px;">Nom</td><td style="padding:8px 0;">${escapeHtml(data.fullName)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;">Email</td><td style="padding:8px 0;">${escapeHtml(data.email)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;">Pays / region</td><td style="padding:8px 0;">${escapeHtml(data.countryRegion)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;">Profil</td><td style="padding:8px 0;">${escapeHtml(data.profileType)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;">Niveau actuel</td><td style="padding:8px 0;">${escapeHtml(data.currentLevel)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;">Interet principal</td><td style="padding:8px 0;">${escapeHtml(data.interestMain)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;">Thematiques prioritaires</td><td style="padding:8px 0;">${escapeHtml(joinValues(data.priorityTopics))}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;">Format prefere</td><td style="padding:8px 0;">${escapeHtml(data.formatPreference)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;">Horizon de demarrage</td><td style="padding:8px 0;">${escapeHtml(data.startTimeline)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;">IP</td><td style="padding:8px 0;">${escapeHtml(meta.ip || "unknown")}</td></tr>
      </table>
      <div style="margin-top:24px;padding:16px;border:1px solid #e5e7eb;background:#fafafa;">
        <div style="font-weight:700;margin-bottom:10px;">Commentaire libre</div>
        <div style="white-space:pre-wrap;">${escapeHtml(data.comments || "-")}</div>
      </div>
    </div>
  `;

  return { subject, text, html };
}
