import { useState } from "react";

const yeastTypes: Record<string, { idealTemp: number; baseTime: number }> = {
  "Active Dry Yeast": { idealTemp: 80, baseTime: 90 },
  "Instant Yeast": { idealTemp: 78, baseTime: 60 },
  "Fresh/Cake Yeast": { idealTemp: 82, baseTime: 75 },
};

const BreadProofingCalculator = () => {
  const [yeast, setYeast] = useState("Active Dry Yeast");
  const [temp, setTemp] = useState(72);

  const y = yeastTypes[yeast];
  const tempFactor = Math.max(0.5, 2 - (temp / y.idealTemp));
  const firstRise = Math.round(y.baseTime * tempFactor);
  const secondRise = Math.round(firstRise * 0.6);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yeast Type</label>
          <select value={yeast} onChange={e => setYeast(e.target.value)} className="w-full border rounded-lg px-3 py-2">
            {Object.keys(yeastTypes).map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Temperature (°F)</label>
          <input type="range" min={60} max={95} value={temp} onChange={e => setTemp(+e.target.value)} className="w-full" />
          <p className="text-center font-bold">{temp}°F / {Math.round((temp - 32) * 5 / 9)}°C</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border-2 border-amber-200 bg-amber-50 text-center">
          <p className="text-sm text-gray-500">First Rise (Bulk Ferment)</p>
          <p className="text-3xl font-bold text-amber-700">{firstRise} min</p>
          <p className="text-xs text-gray-400">Until doubled in size</p>
        </div>
        <div className="p-5 rounded-xl border-2 border-amber-100 bg-amber-50/50 text-center">
          <p className="text-sm text-gray-500">Second Rise (After Shaping)</p>
          <p className="text-3xl font-bold text-amber-600">{secondRise} min</p>
          <p className="text-xs text-gray-400">Until puffy, ~50% larger</p>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        💡 Tip: For better flavor, cold-proof in the fridge for 8-24 hours. Slower fermentation = more complex taste.
      </div>
    </div>
  );
};

export default BreadProofingCalculator;
