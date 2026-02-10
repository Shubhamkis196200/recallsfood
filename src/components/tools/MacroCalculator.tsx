import { useState } from "react";

const MacroCalculator = () => {
  const [calories, setCalories] = useState(2000);
  const [goal, setGoal] = useState<"lose"|"maintain"|"gain">("maintain");

  const splits = {
    lose: { protein: 0.40, carbs: 0.30, fat: 0.30 },
    maintain: { protein: 0.30, carbs: 0.40, fat: 0.30 },
    gain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
  };

  const s = splits[goal];
  const protein = Math.round((calories * s.protein) / 4);
  const carbs = Math.round((calories * s.carbs) / 4);
  const fat = Math.round((calories * s.fat) / 9);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Daily Calories</label>
          <input type="number" min={1000} max={6000} value={calories} onChange={e => setCalories(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
          <select value={goal} onChange={e => setGoal(e.target.value as any)} className="w-full border rounded-lg px-3 py-2">
            <option value="lose">Lose Fat</option><option value="maintain">Maintain</option><option value="gain">Build Muscle</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 text-center">
          <p className="text-xs text-gray-500">🥩 Protein</p>
          <p className="text-3xl font-bold text-red-600">{protein}g</p>
          <p className="text-xs text-gray-400">{Math.round(s.protein * 100)}% • {Math.round(calories * s.protein)} cal</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 text-center">
          <p className="text-xs text-gray-500">🍞 Carbs</p>
          <p className="text-3xl font-bold text-amber-600">{carbs}g</p>
          <p className="text-xs text-gray-400">{Math.round(s.carbs * 100)}% • {Math.round(calories * s.carbs)} cal</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50 text-center">
          <p className="text-xs text-gray-500">🥑 Fat</p>
          <p className="text-3xl font-bold text-green-600">{fat}g</p>
          <p className="text-xs text-gray-400">{Math.round(s.fat * 100)}% • {Math.round(calories * s.fat)} cal</p>
        </div>
      </div>
    </div>
  );
};

export default MacroCalculator;
