"use server";

import "server-only";

export async function copilotAction(question: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY.");
  }

  // Fetch context from Supabase using service role or direct fetch
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` };

  const [lotsRes, alertsRes, notesRes] = await Promise.all([
    fetch(`${supabaseUrl}/rest/v1/lots?select=lot_number,material_name,status,warehouse_zone,qc_inspections(ai_quality_score,ai_recommendation,human_decision)&order=created_at.desc&limit=20`, { headers }),
    fetch(`${supabaseUrl}/rest/v1/alerts?select=title,severity,alert_type,description&resolved=eq.false&limit=10`, { headers }),
    fetch(`${supabaseUrl}/rest/v1/knowledge_notes?select=material_name,note_type,content&order=created_at.desc&limit=20`, { headers }),
  ]);

  const lots = await lotsRes.json();
  const alerts = await alertsRes.json();
  const notes = await notesRes.json();

  const context = [
    "## Recent Lots",
    JSON.stringify(lots, null, 2),
    "## Active Alerts",
    JSON.stringify(alerts, null, 2),
    "## Knowledge Notes",
    JSON.stringify(notes, null, 2),
  ].join("\n");

  const systemPrompt = [
    "You are the SimaOS Manufacturing Copilot.",
    "Answer questions about lots, quality, suppliers, and operations using the context below.",
    "Be concise and reference specific lot numbers and data.",
    "",
    context,
  ].join("\n");

  const model = process.env.OPENAI_COPILOT_MODEL || "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
        { role: "user", content: [{ type: "input_text", text: question }] },
      ],
      max_output_tokens: 600,
    }),
  });

  if (!response.ok) {
    throw new Error("Copilot request failed.");
  }

  const payload = (await response.json()) as { output_text?: string; output?: { content?: { text?: string }[] }[] };

  // Extract text from response
  if (payload.output_text) return payload.output_text;
  if (payload.output) {
    const text = payload.output
      .flatMap((item) => (item.content ?? []))
      .filter((part): part is { text: string } => "text" in part && typeof part.text === "string")
      .map((part) => part.text)
      .join("\n");
    if (text) return text;
  }

  return "I couldn't generate a response. Please try again.";
}
