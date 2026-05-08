import test from "node:test";
import assert from "node:assert/strict";

import {
  buildFormationSurveyAirtableFields,
  buildFormationSurveyEmail,
  joinValues,
  validateFormationSurveyPayload,
} from "../src/lib/server/formationSurvey.js";

const nominalPayload = {
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

test("validateFormationSurveyPayload rejects missing required fields", () => {
  const result = validateFormationSurveyPayload({});
  assert.equal(result.ok, false);
  assert.equal(result.error, "missing_fields");
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

test("buildFormationSurveyEmail creates safe notification content", () => {
  const mail = buildFormationSurveyEmail(
    {
      ...validateFormationSurveyPayload(nominalPayload).data,
      comments: "<script>alert('x')</script>",
    },
    { ip: "127.0.0.1" }
  );

  assert.match(mail.subject, /Nouveau sondage Formation IA - anonyme/);
  assert.match(mail.text, /127\.0\.0\.1/);
  assert.match(mail.html, /&lt;script&gt;alert/);
  assert.equal(joinValues(["IA générative", "MLOps"]), "IA générative | MLOps");
});
