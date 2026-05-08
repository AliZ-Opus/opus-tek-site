import test from "node:test";
import assert from "node:assert/strict";

import {
  buildFormationSurveyAirtableFields,
  buildFormationSurveyEmail,
  joinValues,
  validateFormationSurveyPayload,
} from "../src/lib/server/formationSurvey.js";

const nominalPayload = {
  first_name: " Amel ",
  last_name: " Ben Ali ",
  email: " AMEL.BENALI@example.com ",
  phone: " +216 20 000 000 ",
  country: " Tunisie ",
  interest_global: " Élevé ",
  opening_intent: " Intéressé(e) mais hésitant(e) ",
  offer_interest: " MBA international (diplôme universitaire) ",
  single_option: " MBA uniquement ",
  mba_recognition: " Oui, si la reconnaissance internationale est claire ",
  international_factor: " Très important ",
  stage_attractiveness: "5",
  stage_interest: "MBA + stage international",
  mba_price_reaction: "J'hésiterais, mais je considérerais sérieusement",
  academy_price_reaction: "Je m'inscrirais sans hésiter",
  financing_need: "Oui, important",
  financing_duration: "6 à 12 mois",
  financed_mba_reaction: "J'hésiterais, mais je considérerais sérieusement",
  preferred_format: "3 900 CAD - paiement en 12 mois",
  enrollment_interest: "8",
  program_interests: ["MBA international", "Stage international (Canada)", "MBA international", ""],
  selected_mba: "MBA Ingénierie des données & IA",
  ranked_courses: ["IA générative", "Machine Learning", "Data engineering", "Cloud IA", "MLOps"],
  registration_barrier: "Temps / charge de travail",
  comments: " Besoin d'un parcours clair. ",
};

const anonymousPayload = {
  ...nominalPayload,
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  country: "",
};

test("validateFormationSurveyPayload rejects missing required fields", () => {
  const result = validateFormationSurveyPayload({});
  assert.equal(result.ok, false);
  assert.equal(result.error, "missing_fields");
  assert.equal(result.status, 400);
});

test("validateFormationSurveyPayload accepts payload without respondent identity", () => {
  const result = validateFormationSurveyPayload(anonymousPayload);

  assert.equal(result.ok, true);
  assert.equal(result.data.firstName, "Anonyme");
  assert.equal(result.data.lastName, "");
  assert.equal(result.data.email, "");
  assert.equal(result.data.phone, "");
  assert.equal(result.data.country, "");
});

test("validateFormationSurveyPayload rejects invalid respondent email only when provided", () => {
  const result = validateFormationSurveyPayload({
    ...nominalPayload,
    email: "amel.example.com",
  });

  assert.equal(result.ok, false);
  assert.equal(result.error, "invalid_email");
  assert.equal(result.status, 400);
});

test("validateFormationSurveyPayload rejects invalid scale values", () => {
  const result = validateFormationSurveyPayload({
    ...nominalPayload,
    stage_attractiveness: "6",
  });

  assert.equal(result.ok, false);
  assert.equal(result.error, "invalid_stage_attractiveness");
});

test("validateFormationSurveyPayload normalizes the nominal payload", () => {
  const result = validateFormationSurveyPayload(nominalPayload);

  assert.equal(result.ok, true);
  assert.equal(result.data.firstName, "Amel");
  assert.equal(result.data.lastName, "Ben Ali");
  assert.equal(result.data.email, "amel.benali@example.com");
  assert.equal(result.data.phone, "+216 20 000 000");
  assert.equal(result.data.country, "Tunisie");
  assert.equal(result.data.interestGlobal, "Élevé");
  assert.equal(result.data.enrollmentInterest, "8");
  assert.deepEqual(result.data.programInterests, ["MBA international", "Stage international (Canada)"]);
  assert.deepEqual(result.data.rankedCourses, ["IA générative", "Machine Learning", "Data engineering", "Cloud IA", "MLOps"]);
});

test("buildFormationSurveyAirtableFields maps the payload consistently", () => {
  const fields = buildFormationSurveyAirtableFields(
    {
      ...validateFormationSurveyPayload(nominalPayload).data,
      comments: "Besoin de cadrage",
    },
    "2026-03-28T00:00:00.000Z"
  );

  assert.equal(fields["First Name"], "Amel");
  assert.equal(fields["Last Name"], "Ben Ali");
  assert.equal(fields.Email, "amel.benali@example.com");
  assert.equal(fields.Phone, "+216 20 000 000");
  assert.equal(fields.Country, "Tunisie");
  assert.equal(fields["Opening Intent"], "Intéressé(e) mais hésitant(e)");
  assert.equal(fields["Single Offer Choice"], "MBA uniquement");
  assert.equal(fields["MBA Brazil Fit"], "Oui, si la reconnaissance internationale est claire");
  assert.equal(fields["International Factor"], "Très important");
  assert.equal(fields["Stage Interest"], "MBA + stage international");
  assert.equal(fields["MBA Price"], "J'hésiterais, mais je considérerais sérieusement");
  assert.equal(fields["Academy Price"], "Je m'inscrirais sans hésiter");
  assert.equal(fields["Financing Need"], "Oui, important");
  assert.equal(fields["Financing Duration"], "6 à 12 mois");

  assert.equal(fields["Offer Preference"], "MBA international (diplôme universitaire)");
  assert.equal(fields["Interest Global"], "Élevé");
  assert.equal(fields["Canada Stage Attractiveness"], "5");
  assert.equal(fields["Enrollment Intent"], "8");
  assert.equal(fields["Main Barrier"], "Temps / charge de travail");
  assert.equal(fields["Program Types"], "MBA international | Stage international (Canada)");
  assert.match(fields.Comments, /Q15 Niveau d’intérêt réel: 8\/10/);
  assert.match(fields.Comments, /Q20 Commentaires: Besoin de cadrage/);
  assert.equal(fields["Created At"], "2026-03-28T00:00:00.000Z");
});

test("buildFormationSurveyAirtableFields maps anonymous respondent defaults", () => {
  const fields = buildFormationSurveyAirtableFields(validateFormationSurveyPayload(anonymousPayload).data);

  assert.equal(fields["First Name"], "Anonyme");
  assert.equal(fields["Last Name"], "");
  assert.equal(fields.Email, "");
  assert.equal(fields.Phone, "");
  assert.equal(fields.Country, "");
  assert.equal(fields["Interest Global"], "Élevé");
});

test("validateFormationSurveyPayload accepts the current ia2026 survey payload without identity", () => {
  const { first_name, last_name, email, phone, country, ...currentFrontendPayload } = anonymousPayload;
  const result = validateFormationSurveyPayload(currentFrontendPayload);

  assert.equal(result.ok, true);
  assert.equal(result.data.firstName, "Anonyme");
  assert.equal(result.data.interestGlobal, "Élevé");
});

test("formation survey helpers do not throw on malformed payloads", () => {
  assert.doesNotThrow(() => validateFormationSurveyPayload(null));
  assert.doesNotThrow(() => validateFormationSurveyPayload({ program_interests: "MBA", ranked_courses: "IA" }));
});

test("buildFormationSurveyEmail creates safe notification content", () => {
  const mail = buildFormationSurveyEmail(
    {
      ...validateFormationSurveyPayload(nominalPayload).data,
      comments: "<script>alert('x')</script>",
    },
    { ip: "127.0.0.1" }
  );

  assert.match(mail.subject, /Nouveau sondage Formation IA - Amel Ben Ali/);
  assert.match(mail.text, /amel\.benali@example\.com/);
  assert.match(mail.text, /127\.0\.0\.1/);
  assert.match(mail.html, /&lt;script&gt;alert/);
  assert.equal(joinValues(["IA générative", "MLOps"]), "IA générative | MLOps");
});
