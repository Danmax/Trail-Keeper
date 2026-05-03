const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return Response.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500, headers: corsHeaders });
  }

  const { description = "", type = "species" } = await req.json().catch(() => ({}));
  if (!description.trim()) {
    return Response.json({ error: "description is required" }, { status: 400, headers: corsHeaders });
  }

  const prompt = `Expert field naturalist. Identify this ${type}: "${description}". Return ONLY raw JSON array:
[{"name":"Common Name","species":"Scientific name","confidence":"High|Medium|Low","tip":"One field ID tip"}]`;

  const openai = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      input: prompt,
      max_output_tokens: 800,
    }),
  });

  const data = await openai.json().catch(() => ({}));
  if (!openai.ok) {
    return Response.json({ error: data.error?.message || "OpenAI request failed" }, { status: openai.status, headers: corsHeaders });
  }

  const text = (
    data.output_text ||
    (data.output || [])
      .flatMap((item: { content?: { text?: string }[] }) => item.content || [])
      .map((item: { text?: string }) => item.text || "")
      .join("")
  ).replace(/```json|```/g, "").trim();
  try {
    return Response.json({ suggestions: JSON.parse(text) }, { headers: corsHeaders });
  } catch {
    return Response.json({ error: "Model returned invalid JSON" }, { status: 502, headers: corsHeaders });
  }
});
