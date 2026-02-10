const signs = [
  { level: "Mild", description: "Small ice crystals on surface, slightly lighter color in spots", safe: true, action: "Safe to eat. Cut away affected areas or use in cooked dishes.", color: "border-green-200 bg-green-50" },
  { level: "Moderate", description: "Large patches of grayish-brown discoloration, dry/leathery texture on edges, thick ice crystal buildup", safe: true, action: "Safe but quality is degraded. Best used in soups, stews, or sauces where texture is less important.", color: "border-yellow-200 bg-yellow-50" },
  { level: "Severe", description: "Entirely covered in ice crystals, strong off-odor, completely dried out, tough/papery texture throughout", safe: true, action: "Technically safe but quality is very poor. Consider discarding if the taste/texture is unacceptable.", color: "border-red-200 bg-red-50" },
];

const prevention = [
  "Use airtight freezer bags or containers — squeeze out all air",
  "Wrap items tightly in plastic wrap, THEN in foil",
  "Keep freezer at 0°F (-18°C) or below",
  "Don't overload freezer — air needs to circulate",
  "Label everything with the date",
  "Use oldest items first (FIFO — First In, First Out)",
  "Don't refreeze thawed items",
];

const FreezerBurnIdentifier = () => (
  <div className="space-y-6">
    <p className="text-sm text-gray-600">Freezer burn occurs when air reaches the food's surface and causes dehydration and oxidation. It's NOT dangerous but affects taste and texture.</p>

    <div className="space-y-4">
      {signs.map(s => (
        <div key={s.level} className={`p-5 rounded-xl border-2 ${s.color}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">{s.level} Freezer Burn</h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.safe ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
              {s.safe ? "Safe to eat" : "Discard"}
            </span>
          </div>
          <p className="text-sm text-gray-700"><strong>Signs:</strong> {s.description}</p>
          <p className="text-sm text-gray-700 mt-2"><strong>What to do:</strong> {s.action}</p>
        </div>
      ))}
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900 mb-3">🧊 Prevention Tips</h3>
      <ul className="space-y-2">
        {prevention.map((p, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-blue-500 mt-0.5">✓</span> {p}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default FreezerBurnIdentifier;
