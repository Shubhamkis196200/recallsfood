import { useState } from "react";

const doneness = [
  { level: "Rare", tempF: 125, color: "bg-red-600", desc: "Cool red center. Very soft to touch.", meats: ["Beef steaks", "Lamb chops"] },
  { level: "Medium Rare", tempF: 135, color: "bg-red-500", desc: "Warm red center. Yields gently to pressure.", meats: ["Beef steaks", "Lamb chops", "Venison"] },
  { level: "Medium", tempF: 145, color: "bg-pink-500", desc: "Warm pink center. Yields to pressure.", meats: ["Beef", "Lamb", "Pork", "Veal"] },
  { level: "Medium Well", tempF: 150, color: "bg-pink-300", desc: "Slight pink center. Firm to touch.", meats: ["Beef", "Pork", "Lamb"] },
  { level: "Well Done", tempF: 160, color: "bg-gray-400", desc: "No pink. Firm throughout.", meats: ["Beef", "Pork", "Lamb", "Ground meats"] },
];

const poultryMinTemp = 165;
const groundMeatMinTemp = 160;
const wholeCutsMinTemp = 145;

const meatTypes = ["All", "Beef", "Pork", "Lamb", "Poultry", "Ground Meat", "Fish"] as const;

const safeTemps: Record<string, { tempF: number; notes: string }> = {
  "Poultry": { tempF: 165, notes: "All poultry (chicken, turkey, duck) must reach 165°F. No exceptions — no rare chicken!" },
  "Ground Meat": { tempF: 160, notes: "All ground meats (burgers, meatloaf, sausage) must reach 160°F. Grinding spreads bacteria throughout." },
  "Fish": { tempF: 145, notes: "Fish should reach 145°F or cook until flesh is opaque and flakes easily. Shellfish cook until shells open." },
};

const MeatDonenessGuide = () => {
  const [filter, setFilter] = useState<string>("All");
  const [yourTemp, setYourTemp] = useState<string>("");

  const temp = parseFloat(yourTemp);
  const filtered = filter === "All" ? doneness :
    doneness.filter(d => d.meats.some(m => m.toLowerCase().includes(filter.toLowerCase())));

  const getVerdict = () => {
    if (!temp || isNaN(temp)) return null;
    if (temp < 125) return { text: "Too low — not safe to eat. Continue cooking.", color: "text-red-700 bg-red-50 border-red-200" };
    if (temp >= 165) return { text: "Safe for ALL meats including poultry.", color: "text-green-700 bg-green-50 border-green-200" };
    if (temp >= 160) return { text: "Safe for whole cuts, ground meats, and most proteins. Not safe for poultry (need 165°F).", color: "text-yellow-700 bg-yellow-50 border-yellow-200" };
    if (temp >= 145) return { text: "Safe for whole cuts of beef, pork, lamb, veal (with 3-min rest). NOT safe for ground meat or poultry.", color: "text-yellow-700 bg-yellow-50 border-yellow-200" };
    return { text: "Below USDA minimum. May be acceptable for whole-muscle beef/lamb steaks if you accept the risk.", color: "text-orange-700 bg-orange-50 border-orange-200" };
  };

  const verdict = getVerdict();

  return (
    <div className="space-y-6">
      {/* Temperature checker */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-3">🌡️ Check Your Temperature</h3>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm text-gray-600 block mb-1">Enter your meat thermometer reading</label>
            <input type="number" value={yourTemp} onChange={e => setYourTemp(e.target.value)}
              placeholder="e.g., 155" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500" />
          </div>
          <span className="text-gray-500 pb-2.5">°F</span>
        </div>
        {verdict && (
          <div className={`mt-3 p-3 rounded-lg border ${verdict.color} text-sm`}>
            {verdict.text}
          </div>
        )}
      </div>

      {/* Filter */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Filter by meat type</label>
        <div className="flex flex-wrap gap-2">
          {meatTypes.map(m => (
            <button key={m} onClick={() => setFilter(m)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${filter === m ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Special safety notes */}
      {safeTemps[filter] && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-bold text-red-800">USDA Minimum: {safeTemps[filter].tempF}°F</p>
          <p className="text-sm text-red-700 mt-1">{safeTemps[filter].notes}</p>
        </div>
      )}

      {/* Doneness chart */}
      {filtered.map(d => (
        <div key={d.level} className="flex items-stretch gap-4 p-4 rounded-xl border border-gray-200 bg-white">
          <div className={`w-16 h-16 ${d.color} rounded-lg flex-shrink-0 flex items-center justify-center`}>
            <span className="text-white text-xs font-bold text-center">{d.tempF}°F</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{d.level}</h3>
            <p className="text-sm text-gray-500">{d.tempF}°F / {Math.round((d.tempF - 32) * 5 / 9)}°C</p>
            <p className="text-sm text-gray-600 mt-1">{d.desc}</p>
            <p className="text-xs text-gray-400 mt-1">Best for: {d.meats.join(", ")}</p>
          </div>
        </div>
      ))}

      {filtered.length === 0 && safeTemps[filter] && (
        <p className="text-sm text-gray-500 text-center py-4">
          {filter} does not have variable doneness levels — it must always reach {safeTemps[filter].tempF}°F.
        </p>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <strong>USDA Minimum:</strong> Whole cuts of beef, pork, lamb, and veal: 145°F with 3-min rest. Ground meats: 160°F. All poultry: 165°F.
      </div>
    </div>
  );
};

export default MeatDonenessGuide;
