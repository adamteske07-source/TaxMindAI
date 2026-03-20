import { NextRequest, NextResponse } from "next/server";
import * as pdfParse from "pdf-parse";

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
    const buffer = await file.arrayBuffer();
    let extractedText = "";
    try {
      const pdfData = await (pdfParse as any)(Buffer.from(new Uint8Array(buffer)));
      extractedText = pdfData.text;
    } catch {
      return NextResponse.json({ error: "Could not read PDF." }, { status: 400 });
    }
    if (!extractedText || extractedText.trim().length < 10) {
      return NextResponse.json({ error: "PDF appears empty or image-only." }, { status: 400 });
    }
    const { redacted, piiFound } = redactPII(extractedText);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY || "", "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system: "You are TaxMind AI, a tax document analyzer. Analyze tax documents and identify: document type, key financial data, unreadable or blank fields, compliance risks, and missed deduction opportunities. For unreadable fields say exactly: 'Field [name]: appears unreadable — please enter manually'. Never repeat SSNs or EINs. Rate overall risk as Green, Yellow, or Red.",
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
