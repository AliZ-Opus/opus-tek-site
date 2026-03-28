import test from "node:test";
import assert from "node:assert/strict";

import {
  buildFormationSurveyAirtableFields,
  buildFormationSurveyEmail,
  joinValues,
  validateFormationSurveyPayload,
} from "../src/lib/server/formationSurvey.js";

test("validateFormationSurveyPayload rejects missing required fields", () => {
  const result = validateFormationSurveyPayload({});
  assert.equal(result.ok, false);
  assert.equal(result.error, "missing_fields");
  assert.equal(result.status, 400);
});

test("validateFormationSurveyPayload rejects invalid email", () => {
  const result = validateFormationSurveyPayload({
    first_name: "Ali",
    last_name: "Zouari",
    email: "bad-email",
    country_region: "Tunisie",
    profile_type: "Leader",
    current_level: "Intermediaire",
    interest_main: "MBA",
    priority_topics: ["IA generative"],
    format_preference: "en ligne",
    start_timeline: "3 mois",
  });

  assert.equal(result.ok, false);
  assert.equal(result.error, "invalid_email");
});

test("validateFormationSurveyPayload normalizes the nominal payload", () => {
  const result = validateFormationSurveyPayload({
    first_name: "  Ali ",
    last_name: " Zouari  ",
    email: "ALI@EXAMPLE.COM ",
    country_region: " Tunisie ",
    profile_type: " Leader ",
    current_level: " Intermediaire ",
    interest_main: " MBA ",
    priority_topics: ["IA generative", "MLOps", "IA generative", ""],
    format_preference: " en ligne ",
    start_timeline: " 3 mois ",
    comments: " Besoin d'un parcours clair. ",
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.fullName, "Ali Zouari");
  assert.equal(result.data.email, "ali@example.com");
  assert.deepEqual(result.data.priorityTopics, ["IA generative", "MLOps"]);
});

test("buildFormationSurveyAirtableFields maps the payload consistently", () => {
  const fields = buildFormationSurveyAirtableFields(
    {
      firstName: "Ali",
      lastName: "Zouari",
      email: "ali@example.com",
      countryRegion: "Tunisie",
      profileType: "Leader",
      currentLevel: "Intermediaire",
      interestMain: "MBA",
      priorityTopics: ["IA generative", "MLOps"],
      formatPreference: "en ligne",
      startTimeline: "3 mois",
      comments: "Besoin de cadrage",
    },
    "2026-03-28T00:00:00.000Z"
  );

  assert.equal(fields["First Name"], "Ali");
  assert.equal(fields["Program Types"], "IA generative | MLOps");
  assert.match(fields.Comments, /Parcours vise: MBA/);
  assert.equal(fields["Created At"], "2026-03-28T00:00:00.000Z");
});

test("buildFormationSurveyEmail creates safe notification content", () => {
  const mail = buildFormationSurveyEmail(
    {
      fullName: "Ali Zouari",
      email: "ali@example.com",
      countryRegion: "Tunisie",
      profileType: "Leader",
      currentLevel: "Intermediaire",
      interestMain: "MBA",
      priorityTopics: ["IA generative", "MLOps"],
      formatPreference: "en ligne",
      startTimeline: "3 mois",
      comments: "<script>alert('x')</script>",
    },
    { ip: "127.0.0.1" }
  );

  assert.match(mail.subject, /Nouveau sondage Formation IA - Ali Zouari/);
  assert.match(mail.text, /127\.0\.0\.1/);
  assert.match(mail.html, /&lt;script&gt;alert/);
  assert.equal(joinValues(["IA generative", "MLOps"]), "IA generative | MLOps");
});
