import { useState } from "react";

const foodTypes: Record<string, { baseTime: number; pressureAdd: number }> = {
  "Tomatoes (whole)": { baseTime: 85, pressureAdd: 0 },
  "Tomatoes (crushed)": { baseTime: 45, pressureAdd: 0 },
  "Green Beans": { baseTime: 20, pressureAdd: 10 },
  "Corn (whole kernel)": { baseTime: 55, pressureAdd: 10 },
  "Carrots": { baseTime: 25, pressureAdd: 10 },
  "Peaches": { baseTime: 30, pressureAdd: 0 },
  "Pears": { baseTime: 25, pressureAdd: 0 },
  "Pickles": { baseTime: 15, pressureAdd: 0 },
  "Jam/Jelly": { baseTime: 10, pressureAdd: 0 },
  "Salsa": { baseTime: 20, pressureAdd: 0 },
  "Chicken (boneless)": { baseTime: 75, pressureAdd: 10 },
  "Beef (chunks)": { baseTime: 75, pressureAdd: 10 },
  "Fish": { baseTime: 100, pressureAdd: 10 },
  "Soups (with meat)": { baseTime: 75, pressureAdd: 10 },
};

const altitudeAdjustments = [
  { range: "0-1,000 ft", boilingWater: 0, pressure: 0 },
  { range: "1,001-2,000 ft", boilingWater: 5, pressure: 0 },
  { range: "2,001-4,000 ft", boilingWater: 10, pressure: 0 },
  { range: "4,001-6,000 ft", boilingWater: 15, pressure: 5 },
  { range: "6,001-8,000 ft", boilingWater: 20, pressure: 5 },
  { range: "8,001-10,000 ft", boilingWater: 25, pressure: 10 },
];

const SafeCanningCalculator = () => {
  const [food, setFood] = useState("Tomatoes (whole)");
  const [altitude, setAltitude] = useState(0);

  const f = foodTypes[food];
  const alt = altitudeAdjustments[altitude];
  const isAcidic = f.pressureAdd === 0;
  const time = f.baseTime + (isAcidic ? alt.boilingWater : 0);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
          <select value={food} onChange={e => setFood(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
            {Object.keys(foodTypes).map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Altitude</label>
          <select value={altitude} onChange={e => setAltitude(+e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
            {altitudeAdjustments.map((a, i) => <option key={i} value={i}>{a.range}</option>)}
          </select>
        </div>
      </div>

      <div className={`p-6 rounded-xl border-2 ${isAcidic ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
        <p className="text-sm font-semibold uppercase text-gray-500">Recommended Method</p>
        <p className="text-xl font-bold mt-1">{isAcidic ? "🫕 Boiling Water Bath" : "⚡ Pressure Canner"}</p>
        <p className="text-3xl font-bold mt-3 text-red-600">{time} minutes</p>
        {!isAcidic && <p className="text-sm text-gray-600 mt-1">At {10 + alt.pressure} PSI pressure</p>}
        <p className="text-xs text-gray-500 mt-2">For pint jars. Quarts may require additional time.</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <strong>⚠️ Safety Note:</strong> Low-acid foods (vegetables, meats) MUST be pressure canned. Boiling water bath is only safe for high-acid foods.
      </div>
    </div>
  );
};

export default SafeCanningCalculator;
