import { NextRequest, NextResponse } from "next/server";

function redactPII(text: string): { redacted: string; piiFound: string[] } {
  let redacted = text;
  const piiFound: string[] = [];
  if (/\b\d{3}-\d{2}-\d{4}\b/.test(redacted)) { piiFound.push("SSN"); redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN REDACTED]"); }
  if (/\b\d{2}-\d{7}\b/.test(redacted)) { piiFound.push("EIN"); redacted = redacted.replace(/\b\d{2}-\d{7}\b/g, "[EIN REDACTED]"); }
  return { redacted, piiFound };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Extract text by looking for readable strings in the PDF buffer
    const rawText = buffer.toString("latin1");
    const textMatches = rawText.match(/\(([^\)]{2,})\)/g) || [];
    let extractedText = textMatches
      .map(m => m.slice(1, -1))
      .filter(t => /[a-zA-Z0-9]/.test(t))
      .join(" ");

    // Fallback: try reading as utf8
    if (extractedText.length < 50) {
      extractedText = buffer.toString("utf8").replace(/[^\x20-\x7E\n]/g, " ").replace(/\s+/g, " ");
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json({ error: "Could not extract text from this PDF. It may be a scanned/image-only document." }, { status: 400 });
    }

    const { redacted, piiFound } = redactPII(extractedText);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY || "", "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system: "You are TaxMind AI, a tax document analyzer for small CPA firms. Analyze tax documents and identify: document type, key financial data, unreadable or blank fields, compliance risks, and missed deduction opportunities. For unreadable fields say: 'Field [name]: appears unreadable — please enter manually'. Never repeat SSNs or EINs. Rate overall risk as Green, Yellow, or Red.",
        messages: [{ role: "user", content: "Analyze this tax document:\n\n" + redacted.substring(0, 8000) }]
      })
    });

    const data = await response.json();
    const analysis = data.content?.[0]?.text || "Could not generate analysis";
    return NextResponse.json({ analysis, piiRedacted: piiFound });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process: " + error }, { status: 500 });
  }
}
