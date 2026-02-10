const EggFreshnessTester = () => (
  <div className="space-y-6">
    <h3 className="font-bold text-gray-900">The Float Test</h3>
    <p className="text-sm text-gray-600">Fill a bowl with cold water and gently place your egg in it:</p>

    <div className="space-y-4">
      {[
        { result: "Sinks & lies flat on side", status: "Very Fresh", days: "1-7 days old", color: "border-green-300 bg-green-50", emoji: "✅", safe: true },
        { result: "Sinks but stands upright", status: "Still Good", days: "7-21 days old", color: "border-yellow-300 bg-yellow-50", emoji: "👍", safe: true },
        { result: "Sinks slowly, tilts up", status: "Use Soon", days: "21-28 days old", color: "border-orange-300 bg-orange-50", emoji: "⚡", safe: true },
        { result: "Floats to the surface", status: "Bad — Discard", days: "28+ days old", color: "border-red-300 bg-red-50", emoji: "❌", safe: false },
      ].map(t => (
        <div key={t.status} className={`p-4 rounded-xl border-2 ${t.color} flex items-center gap-4`}>
          <span className="text-3xl">{t.emoji}</span>
          <div>
            <h4 className="font-bold">{t.status}</h4>
            <p className="text-sm text-gray-600">{t.result}</p>
            <p className="text-xs text-gray-400">{t.days}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h3 className="font-bold text-sm mb-2">Other Freshness Tests</h3>
      <ul className="text-sm text-gray-600 space-y-2">
        <li><strong>🔊 Shake test:</strong> Hold the egg near your ear and shake gently. Fresh eggs are silent. Sloshing = old egg.</li>
        <li><strong>💡 Candling test:</strong> Hold a flashlight to the egg in a dark room. Small air cell = fresh. Large air cell = old.</li>
        <li><strong>👃 Smell test:</strong> Crack the egg on a plate. No smell = fine. Sulfur smell = discard immediately.</li>
        <li><strong>👁️ Visual test:</strong> Fresh yolks are round and perky. Old yolks are flat. Cloudy whites are actually a sign of freshness.</li>
      </ul>
    </div>

    <div className="text-xs text-gray-500">
      <strong>Storage tip:</strong> Store eggs in their original carton in the coldest part of the fridge (not the door). They last 3-5 weeks from purchase.
    </div>
  </div>
);

export default EggFreshnessTester;
