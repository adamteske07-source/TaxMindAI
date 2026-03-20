"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Scan() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [piiRedacted, setPiiRedacted] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult("");
    setError("");
    setPiiRedacted([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/scan", { method: "POST", body: formData });
      const data = await response.json();
      if (data.error) { setError(data.error); }
      else {
        setResult(data.analysis);
        setPiiRedacted(data.piiRedacted || []);
      }
    } catch {
      setError("Failed to connect to scanner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <a href="/" className="text-blue-400 text-xl font-bold">TaxMind</a>
          <span className="text-gray-400 text-sm bg-gray-800 px-2 py-1 rounded">AI</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/chat" className="text-gray-400 text-sm hover:text-white">Research</a>
          <span className="text-gray-400 text-sm">🔒 Private Session</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto w-full px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Document Scanner</h1>
          <p className="text-gray-400">Upload a tax return PDF. SSNs and EINs are automatically redacted before any AI analysis.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center mb-6">
            <div className="text-4xl mb-3">📄</div>
            <p className="text-gray-400 mb-4 text-sm">Supported: 1040, 1120S, 1065, W-2, K-1 (text-based PDFs only)</p>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors">
              Choose PDF File
            </label>
            {file && <p className="mt-3 text-green-400 text-sm">✅ {file.name} selected</p>}
          </div>

          <div className="bg-blue-950 border border-blue-800 rounded-xl p-4 mb-6 text-sm text-blue-300">
            🔒 <strong>Privacy guarantee:</strong> SSNs and EINs are redacted locally before analysis. Your client data is never stored or used for training.
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
          >
            {loading ? "Analyzing document..." : "Scan Document"}
          </button>
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl p-4 mb-6 text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        {piiRedacted.length > 0 && (
          <div className="bg-green-950 border border-green-800 rounded-xl p-4 mb-6 text-green-300 text-sm">
            🔒 <strong>Auto-redacted before analysis:</strong> {piiRedacted.join(", ")} detected and removed
          </div>
        )}

        {result && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div className="text-blue-400 text-xs font-semibold mb-4 uppercase tracking-wide">TaxMind AI — Document Analysis</div>
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-blue-300 prose-headings:font-semibold prose-strong:text-white prose-li:text-gray-200 prose-p:text-gray-200 prose-p:mb-3 prose-ul:my-2 prose-hr:border-gray-600">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
