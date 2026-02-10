import { useState } from "react";

const pans: Record<string, number> = { // volume in cups
  '8" round': 6, '9" round': 8, '10" round': 11,
  '8" square': 8, '9" square': 10,
  '9x13" rectangle': 14, '11x7" rectangle': 10,
  '8x4" loaf': 4, '9x5" loaf': 6,
  'Standard muffin (12)': 3, '9" pie plate': 4,
  '10" bundt': 12, '10" tube': 16,
  'Jelly roll (15x10)': 10,
};

const PanSizeConverter = () => {
  const [from, setFrom] = useState('9" round');
  const [to, setTo] = useState('8" square');

  const ratio = pans[to] / pans[from];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Original Pan</label>
          <select value={from} onChange={e => setFrom(e.target.value)} className="w-full border rounded-lg px-3 py-2">
            {Object.keys(pans).map(p => <option key={p}>{p}</option>)}
          </select>
          <p className="text-xs text-gray-400 mt-1">Volume: {pans[from]} cups</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Pan</label>
          <select value={to} onChange={e => setTo(e.target.value)} className="w-full border rounded-lg px-3 py-2">
            {Object.keys(pans).map(p => <option key={p}>{p}</option>)}
          </select>
          <p className="text-xs text-gray-400 mt-1">Volume: {pans[to]} cups</p>
        </div>
      </div>

      <div className="bg-zinc-50 border-2 border-zinc-200 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-500">Multiply all ingredients by:</p>
        <p className="text-4xl font-bold text-gray-900 mt-2">{ratio.toFixed(2)}x</p>
        {ratio > 1 && <p className="text-sm text-gray-500 mt-1">New pan is larger — increase recipe</p>}
        {ratio < 1 && <p className="text-sm text-gray-500 mt-1">New pan is smaller — decrease recipe</p>}
        {ratio === 1 && <p className="text-sm text-green-600 mt-1">Same volume — no change needed!</p>}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700">
        💡 When changing pan sizes, watch your baking time. Thinner layers bake faster; deeper layers need longer at a slightly lower temperature.
      </div>
    </div>
  );
};

export default PanSizeConverter;
