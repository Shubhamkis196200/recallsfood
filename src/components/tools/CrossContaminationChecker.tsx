import { useState } from "react";

const riskPairs: { foods: string[]; risk: string; severity: "high" | "medium" | "low"; prevention: string }[] = [
  { foods: ["raw chicken", "salad", "vegetables"], risk: "Salmonella from raw chicken can contaminate fresh produce", severity: "high", prevention: "Use separate cutting boards. Wash hands after handling raw chicken. Never place salad near raw chicken." },
  { foods: ["raw meat", "cooked food"], risk: "Bacteria from raw meat can transfer to ready-to-eat foods", severity: "high", prevention: "Store raw meat on the bottom shelf. Use separate utensils. Never reuse marinades." },
  { foods: ["raw eggs", "salad", "fruit"], risk: "Salmonella from raw egg shells can spread to produce", severity: "medium", prevention: "Wash hands after handling eggs. Store eggs away from produce. Clean surfaces after egg prep." },
  { foods: ["raw fish", "rice", "vegetables"], risk: "Parasites and bacteria from raw fish can contaminate other foods", severity: "high", prevention: "Use dedicated fish cutting board. Wash all surfaces with hot soapy water." },
  { foods: ["raw seafood", "cooked food"], risk: "Vibrio and other bacteria can spread from raw shellfish", severity: "high", prevention: "Keep raw shellfish sealed. Use separate prep areas." },
  { foods: ["raw meat", "fruit"], risk: "E. coli and other bacteria can transfer to fruits", severity: "medium", prevention: "Prep fruits first, then raw meats. Use separate boards and knives." },
  { foods: ["dairy", "raw meat"], risk: "Cross-contamination can cause spoilage and illness", severity: "medium", prevention: "Store dairy above raw meat in fridge. Keep sealed." },
];

const CrossContaminationChecker = () => {
  const [input, setInput] = useState("");
  const terms = input.toLowerCase().split(",").map(s => s.trim()).filter(Boolean);

  const matchedRisks = terms.length > 0
    ? riskPairs.filter(r => terms.some(t => r.foods.some(f => f.includes(t) || t.includes(f))))
    : [];

  const severityColor = { high: "border-red-300 bg-red-50", medium: "border-yellow-300 bg-yellow-50", low: "border-blue-300 bg-blue-50" };
  const severityBadge = { high: "bg-red-600", medium: "bg-yellow-500", low: "bg-blue-500" };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Enter foods you're preparing (comma-separated)</label>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="e.g., chicken, salad, eggs"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500" />
      </div>

      {terms.length > 0 && matchedRisks.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
          ✅ No major cross-contamination risks detected for these foods. Always practice good hygiene!
        </div>
      )}

      {matchedRisks.map((r, i) => (
        <div key={i} className={`p-4 rounded-xl border-2 ${severityColor[r.severity]}`}>
          <div className="flex items-start justify-between">
            <p className="font-semibold text-gray-900">⚠️ {r.risk}</p>
            <span className={`text-xs text-white px-2 py-0.5 rounded-full ${severityBadge[r.severity]}`}>{r.severity}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2"><strong>Prevention:</strong> {r.prevention}</p>
        </div>
      ))}

      {terms.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">Enter foods above to check for cross-contamination risks</p>
      )}
    </div>
  );
};

export default CrossContaminationChecker;
