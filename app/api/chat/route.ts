import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1].content;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: "You are TaxMind AI, a tax research assistant for small CPA firms. Always cite IRC sections.",
        messages: [{ role: "user", content: lastMessage }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || JSON.stringify(data);
    return NextResponse.json({ message: text });

  } catch (error) {
    return NextResponse.json({ message: "Error: " + error }, { status: 500 });
  }
}
