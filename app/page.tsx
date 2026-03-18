export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-2xl font-bold">TaxMind</span>
          <span className="text-gray-400 text-sm bg-gray-800 px-2 py-1 rounded">
            AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">For Small CPA Firms</span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Request Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-8 py-24">
        <div className="bg-blue-900/30 text-blue-300 text-sm px-4 py-2 rounded-full mb-6 border border-blue-800">
          Built for Milwaukee CPA Firms
        </div>
        <h1 className="text-5xl font-bold mb-6 max-w-3xl leading-tight">
          AI Tax Research.{" "}
          <span className="text-blue-400">Accurate. Private. Fast.</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mb-10">
          Ask any tax question and get cited answers from the IRC, Treasury
          Regulations, and IRS guidance — in seconds. Built for small firms
          who can't afford enterprise tools.
        </p>
        <div className="flex gap-4">
          <a href="/chat" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
          Start Research
          </a>
          <button className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-3 rounded-lg font-medium transition-colors">
            See How It Works
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12 text-gray-100">
          Why Small CPA Firms Choose TaxMind
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-blue-400 text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Instant Answers</h3>
            <p className="text-gray-400 text-sm">
              Ask in plain English. Get answers grounded in real IRC sections,
              Treasury Regs, and Revenue Rulings — not a Google search.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-green-400 text-3xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold mb-2">Client Data Stays Private</h3>
            <p className="text-gray-400 text-sm">
              Your client information never leaves your firm's secure environment.
              No training on your data. No sharing across firms.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-purple-400 text-3xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">Always Cited</h3>
            <p className="text-gray-400 text-sm">
              Every answer includes the exact source — IRC section, regulation,
              or ruling — so you can verify and trust every response.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 text-sm border-t border-gray-800">
        TaxMind AI — Built by Adam Teske · UW-Whitewater · 2026
      </footer>

    </main>
  );
}
