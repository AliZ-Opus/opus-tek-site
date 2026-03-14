import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const apiKey = import.meta.env.AIRTABLE_API_KEY;
    const baseId = import.meta.env.AIRTABLE_BASE_ID;
    const tableName = import.meta.env.AIRTABLE_TABLE_NAME ?? "Etude IA 2026";

    if (!apiKey || !baseId) {
      return new Response(
        JSON.stringify({ error: "Airtable env vars missing" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const fields = {
      "First Name": body.first_name ?? "",
      "Last Name": body.last_name ?? "",
      Email: body.email ?? "",
      Phone: body.phone ?? "",
      Country: body.country ?? "",
      City: body.city ?? "",
      University: body.university ?? "",
      "Study Year": body.study_year ?? "",
      "Profile Type": body.profile_type ?? "",

      "Interest Global": body.interest_global ?? "",
      "Opening Intent": body.opening_intent ?? "",
      "Offer Preference": body.offer_preference ?? "",
      "Single Offer Choice": body.single_offer_choice ?? "",
      "MBA Brazil Fit": body.mba_brazil_fit ?? "",
      "International Factor": body.international_factor ?? "",
      "Canada Stage Attractiveness": body.canada_stage_attractiveness ?? "",
      "Stage Interest": body.stage_interest ?? "",
      "MBA Price": body.mba_price ?? "",
      "Academy Price": body.academy_price ?? "",
      "Financing Need": body.financing_need ?? "",
      "Financing Duration": body.financing_duration ?? "",
      "Enrollment Intent": body.enrollment_intent ?? "",
      "Program Types": body.program_types ?? "",
      "Main Barrier": body.main_barrier ?? "",
      Comments: body.comments ?? "",

      Source: "opus-site-insights",
      "Created From": "website",
      "Created At": new Date().toISOString(),
    };

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
      const errorText = await airtableResponse.text();

      return new Response(
        JSON.stringify({
          error: "Airtable request failed",
          details: errorText,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Unexpected server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};