import { useState } from "react";

const FoodBudgetCalculator = () => {
  const [income, setIncome] = useState(4000);
  const [household, setHousehold] = useState(2);
  const [style, setStyle] = useState<"thrifty"|"low"|"moderate"|"liberal">("moderate");

  const monthly: Record<string, Record<number, number>> = {
    thrifty: { 1: 210, 2: 390, 3: 510, 4: 640, 5: 750, 6: 860 },
    low: { 1: 270, 2: 500, 3: 660, 4: 820, 5: 960, 6: 1100 },
    moderate: { 1: 330, 2: 610, 3: 810, 4: 1010, 5: 1180, 6: 1350 },
    liberal: { 1: 400, 2: 760, 3: 1010, 4: 1250, 5: 1460, 6: 1670 },
  };

  const size = Math.min(household, 6);
  const budget = monthly[style][size] || monthly[style][6];
  const pctIncome = ((budget / income) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income ($)</label>
          <input type="number" min={0} value={income} onChange={e => setIncome(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Household Size</label>
          <input type="number" min={1} max={10} value={household} onChange={e => setHousehold(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget Style</label>
          <select value={style} onChange={e => setStyle(e.target.value as any)} className="w-full border rounded-lg px-3 py-2">
            <option value="thrifty">Thrifty</option><option value="low">Low-Cost</option>
            <option value="moderate">Moderate</option><option value="liberal">Liberal</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border-2 border-green-200 bg-green-50 text-center">
          <p className="text-sm text-gray-500">Monthly Food Budget</p>
          <p className="text-4xl font-bold text-green-600">${budget}</p>
          <p className="text-sm text-gray-400">${Math.round(budget / 4)}/week • ${Math.round(budget / 30)}/day</p>
        </div>
        <div className="p-5 rounded-xl border-2 border-blue-200 bg-blue-50 text-center">
          <p className="text-sm text-gray-500">% of Income</p>
          <p className="text-4xl font-bold text-blue-600">{pctIncome}%</p>
          <p className="text-xs text-gray-400">USDA recommends 10-15% of income</p>
        </div>
      </div>

      <p className="text-xs text-gray-500">Based on USDA Food Plans (2024-2025 estimates). Actual costs vary by location.</p>
    </div>
  );
};

export default FoodBudgetCalculator;
