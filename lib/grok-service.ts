export async function generateGrokResponse(prompt: string): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;
  console.log("XAI key loaded:", Boolean(apiKey));

  if (!apiKey) {
    throw new Error("XAI_API_KEY missing");
  }

  console.log("Calling Grok");
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "grok-3-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Grok API error (Status ${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Invalid response format from Grok API");
  }

  console.log("Grok response received");
  return content;
}
