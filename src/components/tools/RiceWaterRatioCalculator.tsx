import { useState } from "react";

const riceTypes: Record<string, { ratio: number; time: number; yield: number }> = {
  "White Long Grain": { ratio: 2, time: 18, yield: 3 },
  "White Short Grain": { ratio: 1.25, time: 15, yield: 2.5 },
  "Basmati": { ratio: 1.5, time: 15, yield: 3 },
  "Jasmine": { ratio: 1.5, time: 15, yield: 3 },
  "Brown Rice": { ratio: 2.5, time: 45, yield: 3 },
  "Wild Rice": { ratio: 3, time: 50, yield: 3.5 },
  "Sushi Rice": { ratio: 1.2, time: 15, yield: 2.5 },
  "Arborio (Risotto)": { ratio: 3.5, time: 25, yield: 3 },
  "Sticky/Glutinous": { ratio: 1, time: 20, yield: 2 },
  "Quinoa": { ratio: 2, time: 15, yield: 3 },
};

const RiceWaterRatioCalculator = () => {
  const [type, setType] = useState("White Long Grain");
  const [cups, setCups] = useState(1);
  const r = riceTypes[type];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rice Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className="w-full border rounded-lg px-3 py-2">
            {Object.keys(riceTypes).map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rice (cups, dry)</label>
          <input type="number" min={0.5} max={10} step={0.5} value={cups} onChange={e => setCups(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 text-center">
          <p className="text-xs text-gray-500">💧 Water</p>
          <p className="text-2xl font-bold">{(cups * r.ratio).toFixed(1)} cups</p>
          <p className="text-xs text-gray-400">{r.ratio}:1 ratio</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 text-center">
          <p className="text-xs text-gray-500">⏱️ Cook Time</p>
          <p className="text-2xl font-bold">{r.time} min</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50 text-center">
          <p className="text-xs text-gray-500">🍚 Yield</p>
          <p className="text-2xl font-bold">{(cups * r.yield).toFixed(1)} cups</p>
          <p className="text-xs text-gray-400">cooked</p>
        </div>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 Always rinse rice before cooking (except for risotto).</p>
        <p>💡 Let rice rest 5-10 minutes covered after cooking for fluffier results.</p>
      </div>
    </div>
  );
};

export default RiceWaterRatioCalculator;
