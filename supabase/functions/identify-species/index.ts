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

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500, headers: corsHeaders });
  }

  const { description = "", type = "species" } = await req.json().catch(() => ({}));
  if (!description.trim()) {
    return Response.json({ error: "description is required" }, { status: 400, headers: corsHeaders });
  }

  const prompt = `Expert field naturalist. Identify this ${type}: "${description}". Return ONLY raw JSON array:
[{"name":"Common Name","species":"Scientific name","confidence":"High|Medium|Low","tip":"One field ID tip"}]`;

  const anthropic = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await anthropic.json().catch(() => ({}));
  if (!anthropic.ok) {
    return Response.json({ error: data.error?.message || "Anthropic request failed" }, { status: anthropic.status, headers: corsHeaders });
  }

  const text = (data.content || []).map((item: { text?: string }) => item.text || "").join("").replace(/```json|```/g, "").trim();
  try {
    return Response.json({ suggestions: JSON.parse(text) }, { headers: corsHeaders });
  } catch {
    return Response.json({ error: "Model returned invalid JSON" }, { status: 502, headers: corsHeaders });
  }
});
