import { useState } from "react";

const pastaTypes: Record<string, { cookTime: number; waterPerOz: number }> = {
  "Spaghetti": { cookTime: 10, waterPerOz: 0.5 },
  "Penne": { cookTime: 12, waterPerOz: 0.5 },
  "Fusilli": { cookTime: 11, waterPerOz: 0.5 },
  "Farfalle (Bow-tie)": { cookTime: 11, waterPerOz: 0.5 },
  "Rigatoni": { cookTime: 13, waterPerOz: 0.5 },
  "Angel Hair": { cookTime: 5, waterPerOz: 0.5 },
  "Linguine": { cookTime: 10, waterPerOz: 0.5 },
  "Macaroni": { cookTime: 8, waterPerOz: 0.5 },
  "Orzo": { cookTime: 9, waterPerOz: 0.4 },
  "Lasagna Sheets": { cookTime: 10, waterPerOz: 0.6 },
  "Fresh Pasta": { cookTime: 3, waterPerOz: 0.5 },
};

const PastaCookingCalculator = () => {
  const [type, setType] = useState("Spaghetti");
  const [oz, setOz] = useState(8);
  const p = pastaTypes[type];
  const waterQt = Math.ceil(oz * p.waterPerOz);
  const saltTsp = waterQt * 1.5;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pasta Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="w-full border rounded-lg px-3 py-2">
            {Object.keys(pastaTypes).map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (oz)</label>
          <input type="number" min={2} max={64} value={oz} onChange={e => setOz(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          <p className="text-xs text-gray-400">Standard serving: 2 oz dry per person</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 text-center">
          <p className="text-xs text-gray-500">💧 Water</p>
          <p className="text-2xl font-bold">{waterQt} qt</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">🧂 Salt</p>
          <p className="text-2xl font-bold">{saltTsp} tsp</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-yellow-200 bg-yellow-50 text-center">
          <p className="text-xs text-gray-500">⏱️ Cook Time</p>
          <p className="text-2xl font-bold">{p.cookTime} min</p>
        </div>
      </div>

      <p className="text-xs text-gray-400">Serves approximately {Math.round(oz / 2)} people (2 oz dry per serving). For al dente, subtract 1-2 minutes.</p>
    </div>
  );
};

export default PastaCookingCalculator;
