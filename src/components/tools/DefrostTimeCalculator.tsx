import { useState } from "react";

const methods = [
  { name: "Refrigerator (Safest)", factor: 5, unit: "hours", note: "Allow ~5 hours per pound. Safest method — keeps food at safe temp throughout." },
  { name: "Cold Water", factor: 0.5, unit: "hours", note: "~30 min per pound. Submerge sealed food in cold water, changing water every 30 min." },
  { name: "Microwave", factor: 0.1, unit: "hours", note: "~6 min per pound. Cook immediately after. Not recommended for large items." },
];

const DefrostTimeCalculator = () => {
  const [weight, setWeight] = useState(2);
  const [unit, setUnit] = useState<"lb"|"kg">("lb");
  const lbs = unit === "kg" ? weight * 2.205 : weight;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
          <input type="number" min={0.1} step={0.1} value={weight} onChange={e => setWeight(+e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select value={unit} onChange={e => setUnit(e.target.value as "lb"|"kg")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500">
            <option value="lb">Pounds (lb)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {methods.map(m => {
          const hrs = lbs * m.factor;
          const display = hrs >= 24 ? `${Math.round(hrs / 24 * 10) / 10} days` : hrs >= 1 ? `${Math.round(hrs * 10) / 10} hours` : `${Math.round(hrs * 60)} min`;
          return (
            <div key={m.name} className="p-4 rounded-xl border-2 border-gray-200 bg-white">
              <h3 className="font-bold text-gray-900 text-sm">{m.name}</h3>
              <p className="text-2xl font-bold text-red-600 mt-2">{display}</p>
              <p className="text-xs text-gray-500 mt-2">{m.note}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
        <strong>⚠️ Never defrost at room temperature!</strong> The outer surface can reach the danger zone (40-140°F) while the inside is still frozen.
      </div>
    </div>
  );
};

export default DefrostTimeCalculator;
