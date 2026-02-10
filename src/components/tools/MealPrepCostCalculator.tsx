import { useState } from "react";

const MealPrepCostCalculator = () => {
  const [ingredients, setIngredients] = useState([
    { name: "Chicken breast (2 lbs)", cost: 7.99 },
    { name: "Rice (5 lb bag)", cost: 4.99 },
    { name: "Broccoli (2 bags frozen)", cost: 3.98 },
    { name: "Olive oil", cost: 0.50 },
    { name: "Seasonings", cost: 0.50 },
  ]);
  const [servings, setServings] = useState(5);

  const total = ingredients.reduce((sum, i) => sum + i.cost, 0);
  const perServing = total / servings;

  const add = () => setIngredients([...ingredients, { name: "", cost: 0 }]);
  const update = (i: number, field: string, val: any) => {
    const next = [...ingredients];
    (next[i] as any)[field] = field === "cost" ? +val : val;
    setIngredients(next);
  };
  const remove = (i: number) => setIngredients(ingredients.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {ingredients.map((ing, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="text" value={ing.name} onChange={e => update(i, "name", e.target.value)} placeholder="Ingredient"
              className="flex-1 border rounded-lg px-3 py-2 text-sm" />
            <div className="relative">
              <span className="absolute left-2 top-2.5 text-gray-400 text-sm">$</span>
              <input type="number" step={0.01} min={0} value={ing.cost} onChange={e => update(i, "cost", e.target.value)}
                className="w-24 border rounded-lg pl-6 pr-2 py-2 text-sm" />
            </div>
            <button onClick={() => remove(i)} className="text-gray-400 hover:text-red-500">✕</button>
          </div>
        ))}
      </div>
      <button onClick={add} className="text-sm text-green-600 hover:text-green-700 font-medium">+ Add Ingredient</button>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Servings</label>
        <input type="number" min={1} max={50} value={servings} onChange={e => setServings(+e.target.value)} className="w-24 border rounded-lg px-3 py-2" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50 text-center">
          <p className="text-xs text-gray-500">Total Cost</p>
          <p className="text-3xl font-bold text-green-600">${total.toFixed(2)}</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-center">
          <p className="text-xs text-gray-500">Cost Per Serving</p>
          <p className="text-3xl font-bold text-emerald-600">${perServing.toFixed(2)}</p>
          <p className="text-xs text-gray-400">vs ~$12-15 eating out</p>
        </div>
      </div>
    </div>
  );
};

export default MealPrepCostCalculator;
