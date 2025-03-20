import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.MISTRAL_API_KEY;
    console.log("MISTRAL_API_KEY:", apiKey ? "Loaded" : "Not Found"); // Debugging log

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small",  
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch Mistral AI response" }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response received.";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Error:", error); // Debugging log
    return NextResponse.json({ error: "Error connecting to Mistral API." }, { status: 500 });
  }
}
