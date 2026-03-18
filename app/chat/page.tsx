"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm TaxMind AI. Ask me any federal tax question and I'll provide an answer with citations from the IRC, Treasury Regulations, and IRS guidance.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await response.json();
      const responseText = data.message || data.error || JSON.stringify(data);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI. Please try again." },
      ]);
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
        <span className="text-gray-400 text-sm">🔒 Private Research Session</span>
      </nav>

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-6 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-2xl px-5 py-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100 border border-gray-700"}`}>
              {msg.role === "assistant" && (
                <div className="text-blue-400 text-xs font-semibold mb-3 uppercase tracking-wide">
                  TaxMind AI
                </div>
              )}
              {msg.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none
                  prose-headings:text-blue-300 
                  prose-headings:font-semibold
                  prose-h1:text-lg
                  prose-h2:text-base
                  prose-h3:text-sm
                  prose-strong:text-white
                  prose-li:text-gray-200
                  prose-p:text-gray-200
                  prose-p:mb-3
                  prose-ul:my-2
                  prose-ol:my-2
                  prose-hr:border-gray-600">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start mb-6">
            <div className="bg-gray-800 border border-gray-700 px-5 py-4 rounded-2xl text-sm text-gray-400">
              <div className="text-blue-400 text-xs font-semibold mb-2 uppercase tracking-wide">TaxMind AI</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                <span className="ml-2">Researching tax law...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a tax question... e.g. 'Can an S-Corp deduct health insurance premiums?'"
            className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
        <p className="text-center text-gray-600 text-xs mt-3">
          🔒 Your questions are never stored or used for training
        </p>
      </div>
    </main>
  );
}