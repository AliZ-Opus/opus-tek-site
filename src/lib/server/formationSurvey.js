import { escapeHtml } from "./workspaceMail.js";

function normalizeText(value, maxLength = 240) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function normalizeMultiline(value, maxLength = 2000) {
  return String(value || "").trim().replace(/\r\n/g, "\n").slice(0, maxLength);
}

function normalizeChoiceList(value, maxItems = 8, maxLength = 160) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => normalizeText(item, maxLength)).filter(Boolean))].slice(0, maxItems);
}

function normalizeRanking(value) {
  return normalizeChoiceList(value, 5, 200);
}

const DISCOVERY_SOURCE_OPTIONS = new Set([
  "Ami / collègue",
  "Université / école",
  "Réseaux sociaux",
  "LinkedIn",
  "WhatsApp",
  "Email",
  "Événement / présentation",
  "Recherche Google",
  "Autre",
]);

export function joinValues(value) {
  if (!Array.isArray(value)) return typeof value === "string" ? value : "";
  return value
    .map((item) => normalizeText(item, 160))
    .filter(Boolean)
    .join(" | ");
}

export function validateFormationSurveyPayload(body) {
  const firstName = normalizeText(body?.first_name, 120);
  const lastName = normalizeText(body?.last_name, 120);
  const email = normalizeText(body?.email, 180).toLowerCase();
  const phone = normalizeText(body?.phone, 80);
  const country = normalizeText(body?.country, 120);
  const city = normalizeText(body?.city, 120);
  const university = normalizeText(body?.university, 180);
  const studyYear = normalizeText(body?.study_year, 180);
  const discipline = normalizeText(body?.discipline, 180);
  const discoverySource = normalizeText(body?.discovery_source, 180);
  const interestGlobal = normalizeText(body?.interest_global, 120);
  const openingIntent = normalizeText(body?.opening_intent, 120);
  const offerInterest = normalizeText(body?.offer_interest, 160);
  const singleOption = normalizeText(body?.single_option, 160);
  const mbaRecognition = normalizeText(body?.mba_recognition, 200);
  const internationalFactor = normalizeText(body?.international_factor, 120);
  const stageAttractiveness = normalizeText(body?.stage_attractiveness, 4);
  const stageInterest = normalizeText(body?.stage_interest, 160);
  const mbaPriceReaction = normalizeText(body?.mba_price_reaction, 200);
  const academyPriceReaction = normalizeText(body?.academy_price_reaction, 200);
  const financingNeed = normalizeText(body?.financing_need, 120);
  const financingDuration = normalizeText(body?.financing_duration, 120);
  const financedMbaReaction = normalizeText(body?.financed_mba_reaction, 200);
  const preferredFormat = normalizeText(body?.preferred_format, 160);
  const enrollmentInterest = normalizeText(body?.enrollment_interest, 4);
  const programInterests = normalizeChoiceList(body?.program_interests, 6);
  const selectedMba = normalizeText(body?.selected_mba, 200);
  const rankedCourses = normalizeRanking(body?.ranked_courses);
  const registrationBarrier = normalizeText(body?.registration_barrier, 160);
  const registrationBarrierOther = normalizeText(body?.registration_barrier_other, 200);
  const comments = normalizeMultiline(body?.comments, 2000);
  const website = normalizeText(body?.website, 200);

  if (website) {
    return { ok: true, data: { website, honeypot: true } };
  }

  const required = [
    discoverySource,
    interestGlobal,
    openingIntent,
    offerInterest,
    singleOption,
    mbaRecognition,
    internationalFactor,
    stageAttractiveness,
    stageInterest,
    mbaPriceReaction,
    academyPriceReaction,
    financingNeed,
    financingDuration,
    financedMbaReaction,
    preferredFormat,
    enrollmentInterest,
    registrationBarrier,
  ];

  if (required.some((item) => !item)) {
    return { ok: false, status: 400, error: "missing_fields" };
  }

  if (!DISCOVERY_SOURCE_OPTIONS.has(discoverySource)) {
    return { ok: false, status: 400, error: "invalid_discovery_source" };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, status: 400, error: "invalid_email" };
  }

  if (!["1", "2", "3", "4", "5"].includes(stageAttractiveness)) {
    return { ok: false, status: 400, error: "invalid_stage_attractiveness" };
  }

  if (!["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(enrollmentInterest)) {
    return { ok: false, status: 400, error: "invalid_enrollment_interest" };
  }

  if (registrationBarrier === "Autre (préciser)" && !registrationBarrierOther) {
    return { ok: false, status: 400, error: "missing_barrier_other" };
  }

  return {
    ok: true,
    data: {
      firstName: firstName || "Anonyme",
      lastName,
      email,
      phone,
      country,
      city,
      university,
      studyYear,
      discipline,
      discoverySource,
      interestGlobal,
      openingIntent,
      offerInterest,
      singleOption,
      mbaRecognition,
      internationalFactor,
      stageAttractiveness,
      stageInterest,
      mbaPriceReaction,
      academyPriceReaction,
      financingNeed,
      financingDuration,
      financedMbaReaction,
      preferredFormat,
      enrollmentInterest,
      programInterests,
      selectedMba,
      rankedCourses,
      registrationBarrier,
      registrationBarrierOther,
      comments,
      website: "",
      honeypot: false,
    },
  };
}

export function buildFormationSurveyAirtableFields(data, createdAt = new Date().toISOString()) {
  const comments = [
    `Répondant: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Téléphone: ${data.phone}`,
    `Ville: ${data.city}`,
    `Université / établissement: ${data.university}`,
    `Niveau d'études: ${data.studyYear}`,
    `Discipline: ${data.discipline}`,
    `Source de découverte: ${data.discoverySource}`,
    "",
    `Q1 Intérêt global: ${data.interestGlobal}`,
    `Q2 Intention si ouverture: ${data.openingIntent}`,
    `Q3 Offre la plus intéressante: ${data.offerInterest}`,
    `Q4 Choix unique: ${data.singleOption}`,
    `Q5 Reconnaissance MBA brésilien: ${data.mbaRecognition}`,
    `Q6 Importance du caractère international: ${data.internationalFactor}`,
    `Q7 Attractivité du stage Canada: ${data.stageAttractiveness}/5`,
    `Q8 Intérêt stage: ${data.stageInterest}`,
    `Q9 Réaction prix MBA: ${data.mbaPriceReaction}`,
    `Q10 Réaction prix académie: ${data.academyPriceReaction}`,
    `Q11 Besoin de financement: ${data.financingNeed}`,
    `Q12 Durée de financement acceptable: ${data.financingDuration}`,
    `Q13 Réaction 3900 CAD / 12 mois: ${data.financedMbaReaction}`,
    `Q14 Format acceptable: ${data.preferredFormat}`,
    `Q15 Niveau d’intérêt réel: ${data.enrollmentInterest}/10`,
    `Q16 Programmes recherchés: ${joinValues(data.programInterests) || "-"}`,
    `Q17 MBA choisi: ${data.selectedMba || "-"}`,
    `Q18 Classement des cours: ${joinValues(data.rankedCourses) || "-"}`,
    `Q19 Principal frein: ${data.registrationBarrier}`,
    `Q19 Autre: ${data.registrationBarrierOther || "-"}`,
    `Q20 Commentaires: ${data.comments || "-"}`,
  ].join("\n");

  return {
    "First Name": data.firstName,
    "Last Name": data.lastName,
    Email: data.email,
    Phone: data.phone,
    City: data.city || "",
    University: data.university || "",
    "Study Year": data.studyYear || "",
    Discipline: data.discipline || "",
    "Discovery Source": data.discoverySource || "",
    "Interest Global": data.interestGlobal,
    "Opening Intent": data.openingIntent,
    "Offer Preference": data.offerInterest,
    "Single Offer Choice": data.singleOption,
    "MBA Brazil Fit": data.mbaRecognition,
    "International Factor": data.internationalFactor,
    "Canada Stage Attractiveness": data.stageAttractiveness,
    "Stage Interest": data.stageInterest,
    "MBA Price": data.mbaPriceReaction,
    "Academy Price": data.academyPriceReaction,
    "Financing Need": data.financingNeed,
    "Financing Duration": data.financingDuration,
    "Enrollment Intent": data.enrollmentInterest,
    "Program Types": joinValues(data.programInterests),
    "Main Barrier": data.registrationBarrier,
    Comments: comments,
    Source: "opus-site-formation-ia",
    "Created From": "website",
    "Created At": createdAt,
  };
}

export function buildFormationSurveyEmail(data, meta = {}) {
  const subject = `Nouveau sondage Formation IA - ${data.firstName} ${data.lastName}`;
  const text = [
    "Nouveau sondage Formation & accompagnement IA",
    "",
    `Prénom: ${data.firstName}`,
    `Nom: ${data.lastName}`,
    `Email: ${data.email}`,
    `Téléphone: ${data.phone}`,
    `Ville: ${data.city}`,
    `Université / établissement: ${data.university}`,
    `Niveau d'études: ${data.studyYear}`,
    `Discipline: ${data.discipline}`,
    `Source de découverte: ${data.discoverySource}`,
    "",
    `Q1 Intérêt global: ${data.interestGlobal}`,
    `Q2 Intention si ouverture: ${data.openingIntent}`,
    `Q3 Offre la plus intéressante: ${data.offerInterest}`,
    `Q4 Choix unique: ${data.singleOption}`,
    `Q5 Reconnaissance MBA brésilien: ${data.mbaRecognition}`,
    `Q6 Importance du caractère international: ${data.internationalFactor}`,
    `Q7 Attractivité du stage Canada: ${data.stageAttractiveness}/5`,
    `Q8 Intérêt stage: ${data.stageInterest}`,
    `Q9 Réaction prix MBA: ${data.mbaPriceReaction}`,
    `Q10 Réaction prix académie: ${data.academyPriceReaction}`,
    `Q11 Besoin de financement: ${data.financingNeed}`,
    `Q12 Durée de financement acceptable: ${data.financingDuration}`,
    `Q13 Réaction 3900 CAD / 12 mois: ${data.financedMbaReaction}`,
    `Q14 Format acceptable: ${data.preferredFormat}`,
    `Q15 Niveau d’intérêt réel: ${data.enrollmentInterest}/10`,
    `Q16 Programmes recherchés: ${joinValues(data.programInterests) || "-"}`,
    `Q17 MBA choisi: ${data.selectedMba || "-"}`,
    `Q18 Classement des cours: ${joinValues(data.rankedCourses) || "-"}`,
    `Q19 Principal frein: ${data.registrationBarrier}`,
    `Q19 Autre: ${data.registrationBarrierOther || "-"}`,
    `IP: ${meta.ip || "unknown"}`,
    "",
    "Q20 Commentaires:",
    data.comments || "-",
  ].join("\n");

  const html = `\n    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;">\n      <h2 style="margin:0 0 18px 0;">Nouveau sondage Formation & accompagnement IA</h2>\n      <table style="border-collapse:collapse;width:100%;max-width:760px;">\n        <tr><td style="padding:8px 0;font-weight:700;width:260px;">Prénom</td><td style="padding:8px 0;">${escapeHtml(data.firstName)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Nom</td><td style="padding:8px 0;">${escapeHtml(data.lastName)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Email</td><td style="padding:8px 0;">${escapeHtml(data.email)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Téléphone</td><td style="padding:8px 0;">${escapeHtml(data.phone)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Pays</td><td style="padding:8px 0;">${escapeHtml(data.country)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Ville</td><td style="padding:8px 0;">${escapeHtml(data.city)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Université / établissement</td><td style="padding:8px 0;">${escapeHtml(data.university)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Niveau d'études</td><td style="padding:8px 0;">${escapeHtml(data.studyYear)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Discipline</td><td style="padding:8px 0;">${escapeHtml(data.discipline)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Source de découverte</td><td style="padding:8px 0;">${escapeHtml(data.discoverySource)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q1 Intérêt global</td><td style="padding:8px 0;">${escapeHtml(data.interestGlobal)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q2 Intention si ouverture</td><td style="padding:8px 0;">${escapeHtml(data.openingIntent)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q3 Offre la plus intéressante</td><td style="padding:8px 0;">${escapeHtml(data.offerInterest)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q4 Choix unique</td><td style="padding:8px 0;">${escapeHtml(data.singleOption)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q5 Reconnaissance MBA brésilien</td><td style="padding:8px 0;">${escapeHtml(data.mbaRecognition)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q6 Importance du caractère international</td><td style="padding:8px 0;">${escapeHtml(data.internationalFactor)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q7 Attractivité du stage Canada</td><td style="padding:8px 0;">${escapeHtml(data.stageAttractiveness)}/5</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q8 Intérêt stage</td><td style="padding:8px 0;">${escapeHtml(data.stageInterest)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q9 Réaction prix MBA</td><td style="padding:8px 0;">${escapeHtml(data.mbaPriceReaction)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q10 Réaction prix académie</td><td style="padding:8px 0;">${escapeHtml(data.academyPriceReaction)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q11 Besoin de financement</td><td style="padding:8px 0;">${escapeHtml(data.financingNeed)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q12 Durée de financement acceptable</td><td style="padding:8px 0;">${escapeHtml(data.financingDuration)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q13 Réaction 3900 CAD / 12 mois</td><td style="padding:8px 0;">${escapeHtml(data.financedMbaReaction)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q14 Format acceptable</td><td style="padding:8px 0;">${escapeHtml(data.preferredFormat)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q15 Niveau d’intérêt réel</td><td style="padding:8px 0;">${escapeHtml(data.enrollmentInterest)}/10</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q16 Programmes recherchés</td><td style="padding:8px 0;">${escapeHtml(joinValues(data.programInterests) || "-")}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q17 MBA choisi</td><td style="padding:8px 0;">${escapeHtml(data.selectedMba || "-")}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q18 Classement des cours</td><td style="padding:8px 0;">${escapeHtml(joinValues(data.rankedCourses) || "-")}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q19 Principal frein</td><td style="padding:8px 0;">${escapeHtml(data.registrationBarrier)}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">Q19 Autre</td><td style="padding:8px 0;">${escapeHtml(data.registrationBarrierOther || "-")}</td></tr>\n        <tr><td style="padding:8px 0;font-weight:700;">IP</td><td style="padding:8px 0;">${escapeHtml(meta.ip || "unknown")}</td></tr>\n      </table>\n      <div style="margin-top:24px;padding:16px;border:1px solid #e5e7eb;background:#fafafa;">\n        <div style="font-weight:700;margin-bottom:10px;">Q20 Commentaires</div>\n        <div style="white-space:pre-wrap;">${escapeHtml(data.comments || "-")}</div>\n      </div>\n    </div>\n  `;

  return { subject, text, html };
}
