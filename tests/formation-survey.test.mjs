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
  city: " Sousse ",
  university: " Université de Sousse ",
  discipline: " Intelligence artificielle / Data ",
  study_year: " Master / MBA ",
  discovery_source: " Université / école ",
  interest_global: "Élevé",
  opening_intent: "Intéressé(e) mais hésitant(e)",
  offer_interest: "MBA international (diplôme universitaire)",
  single_option: "MBA uniquement",
  mba_recognition: "Oui, si la reconnaissance internationale est claire",
  international_factor: "Très important",
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
  registration_barrier_other: "",
  comments: " Besoin d'un parcours clair. ",
  website: "",
};

const anonymousPayload = {
  ...nominalPayload,
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
};

test("validateFormationSurveyPayload accepts payload with respondent profile fields", () => {
  const result = validateFormationSurveyPayload(nominalPayload);

  assert.equal(result.ok, true);
  assert.equal(result.data.firstName, "Amel");
  assert.equal(result.data.email, "amel.benali@example.com");
  assert.equal(result.data.city, "Sousse");
  assert.equal(result.data.university, "Université de Sousse");
  assert.equal(result.data.discipline, "Intelligence artificielle / Data");
  assert.equal(result.data.studyYear, "Master / MBA");
  assert.equal(result.data.discoverySource, "Université / école");
});

test("validateFormationSurveyPayload requires discovery_source", () => {
  const result = validateFormationSurveyPayload({ ...nominalPayload, discovery_source: "" });

  assert.equal(result.ok, false);
  assert.equal(result.error, "missing_fields");
  assert.equal(result.status, 400);
});

test("validateFormationSurveyPayload keeps other respondent profile fields optional", () => {
  const result = validateFormationSurveyPayload({
    ...nominalPayload,
    city: "",
    university: "",
    discipline: "",
    study_year: "",
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.city, "");
  assert.equal(result.data.university, "");
  assert.equal(result.data.discipline, "");
  assert.equal(result.data.studyYear, "");
  assert.equal(result.data.discoverySource, "Université / école");
});

test("validateFormationSurveyPayload accepts payload without personal identity when discovery_source is present", () => {
  const result = validateFormationSurveyPayload(anonymousPayload);

  assert.equal(result.ok, true);
  assert.equal(result.data.firstName, "Anonyme");
  assert.equal(result.data.lastName, "");
  assert.equal(result.data.email, "");
  assert.equal(result.data.phone, "");
});

test("validateFormationSurveyPayload accepts selected_mba with empty ranked_courses", () => {
  const result = validateFormationSurveyPayload({
    ...anonymousPayload,
    selected_mba: "MBA Ingénierie des données & IA",
    ranked_courses: [],
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.selectedMba, "MBA Ingénierie des données & IA");
  assert.deepEqual(result.data.rankedCourses, []);
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

test("buildFormationSurveyAirtableFields maps profile fields to exact Airtable column names", () => {
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
  assert.equal(fields.City, "Sousse");
  assert.equal(fields.University, "Université de Sousse");
  assert.equal(fields.Discipline, "Intelligence artificielle / Data");
  assert.equal(fields["Study Year"], "Master / MBA");
  assert.equal(fields["Discovery Source"], "Université / école");
  assert.equal(fields["Opening Intent"], "Intéressé(e) mais hésitant(e)");
  assert.equal(fields["Program Types"], "MBA international | Stage international (Canada)");
  assert.match(fields.Comments, /Université \/ établissement: Université de Sousse/);
  assert.match(fields.Comments, /Q15 Niveau d’intérêt réel: 8\/10/);
  assert.match(fields.Comments, /Q20 Commentaires: Besoin de cadrage/);
  assert.equal(fields["Created At"], "2026-03-28T00:00:00.000Z");
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
  assert.match(mail.text, /Université de Sousse/);
  assert.match(mail.text, /127\.0\.0\.1/);
  assert.match(mail.html, /&lt;script&gt;alert/);
  assert.equal(joinValues(["IA générative", "MLOps"]), "IA générative | MLOps");
});
