import { useState } from "react";

const EggFreshnessTester = () => {
  const [purchaseDate, setPurchaseDate] = useState("");
  const [floatResult, setFloatResult] = useState<string | null>(null);

  const daysSincePurchase = purchaseDate
    ? Math.floor((Date.now() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const getFreshnessFromDays = (days: number) => {
    if (days < 0) return { status: "Future date", color: "text-gray-500", msg: "Check your date." };
    if (days <= 7) return { status: "Very Fresh ✅", color: "text-green-700 bg-green-50 border-green-200", msg: "Excellent for poaching, frying, and any cooking method. Whites hold together well." };
    if (days <= 21) return { status: "Fresh — Still Great 👍", color: "text-green-700 bg-green-50 border-green-200", msg: "Perfect for most cooking. Great for baking and scrambling." };
    if (days <= 35) return { status: "Use Soon ⚡", color: "text-yellow-700 bg-yellow-50 border-yellow-200", msg: "Still safe if refrigerated. Best for hard boiling (older eggs peel easier!). Use within a week." };
    if (days <= 49) return { status: "Questionable ⚠️", color: "text-orange-700 bg-orange-50 border-orange-200", msg: "May still be OK if continuously refrigerated. Do the float test to verify before using." };
    return { status: "Likely Expired ❌", color: "text-red-700 bg-red-50 border-red-200", msg: "Eggs are typically good for 3-5 weeks past purchase. Do the float and smell test. When in doubt, throw it out." };
  };

  const floatTests = [
    { result: "Sinks & lies flat on side", status: "Very Fresh", days: "1-7 days old", color: "border-green-300 bg-green-50", emoji: "✅" },
    { result: "Sinks but stands upright", status: "Still Good", days: "7-21 days old", color: "border-yellow-300 bg-yellow-50", emoji: "👍" },
    { result: "Sinks slowly, tilts up", status: "Use Soon", days: "21-28 days old", color: "border-orange-300 bg-orange-50", emoji: "⚡" },
    { result: "Floats to the surface", status: "Bad — Discard", days: "28+ days old", color: "border-red-300 bg-red-50", emoji: "❌" },
  ];

  return (
    <div className="space-y-6">
      {/* Date-based checker */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-3">📅 When did you buy the eggs?</h3>
        <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500" />
        {daysSincePurchase !== null && daysSincePurchase >= 0 && (() => {
          const f = getFreshnessFromDays(daysSincePurchase);
          return (
            <div className={`mt-3 p-4 rounded-lg border ${f.color}`}>
              <p className="font-bold">{f.status}</p>
              <p className="text-sm mt-1">{daysSincePurchase} days since purchase</p>
              <p className="text-sm mt-1">{f.msg}</p>
            </div>
          );
        })()}
      </div>

      {/* Float test interactive */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-2">🥚 The Float Test</h3>
        <p className="text-sm text-gray-600 mb-4">Fill a bowl with cold water and gently place your egg in it. What happened?</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {floatTests.map(t => (
            <button key={t.status} onClick={() => setFloatResult(t.status)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${floatResult === t.status ? t.color + " ring-2 ring-offset-2 ring-gray-400" : t.color}`}>
              <span className="text-2xl">{t.emoji}</span>
              <h4 className="font-bold mt-1">{t.status}</h4>
              <p className="text-sm text-gray-600">{t.result}</p>
              <p className="text-xs text-gray-400">{t.days}</p>
            </button>
          ))}
        </div>

        {floatResult === "Bad — Discard" && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            🛑 <strong>Discard this egg.</strong> Floating means the air cell inside has grown large — a sign of significant age and potential bacterial growth.
          </div>
        )}
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
};

export default EggFreshnessTester;
