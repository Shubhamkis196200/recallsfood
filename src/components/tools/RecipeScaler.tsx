import { useState } from "react";

const RecipeScaler = () => {
  const [original, setOriginal] = useState(4);
  const [desired, setDesired] = useState(8);
  const [ingredients, setIngredients] = useState([
    { name: "Flour", amount: 2, unit: "cups" },
    { name: "Sugar", amount: 1, unit: "cup" },
    { name: "Butter", amount: 0.5, unit: "cup" },
    { name: "Eggs", amount: 2, unit: "" },
    { name: "Milk", amount: 1, unit: "cup" },
    { name: "Salt", amount: 0.5, unit: "tsp" },
  ]);

  const ratio = desired / original;
  const addIngredient = () => setIngredients([...ingredients, { name: "", amount: 0, unit: "" }]);
  const update = (i: number, field: string, val: string | number) => {
    const next = [...ingredients];
    (next[i] as any)[field] = val;
    setIngredients(next);
  };
  const remove = (i: number) => setIngredients(ingredients.filter((_, idx) => idx !== i));

  const formatAmount = (n: number) => {
    if (n === Math.floor(n)) return n.toString();
    const fractions: Record<string, string> = { "0.25": "¼", "0.33": "⅓", "0.5": "½", "0.67": "⅔", "0.75": "¾" };
    const whole = Math.floor(n);
    const frac = Math.round((n - whole) * 100) / 100;
    const fracStr = fractions[frac.toFixed(2)] || frac.toFixed(2);
    return whole > 0 ? `${whole} ${fracStr}` : fracStr;
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Original Servings</label>
          <input type="number" min={1} value={original} onChange={e => setOriginal(+e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desired Servings</label>
          <input type="number" min={1} value={desired} onChange={e => setDesired(+e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500" />
        </div>
      </div>

      <p className="text-sm text-gray-500">Scaling factor: <strong className="text-orange-600">{ratio.toFixed(2)}x</strong></p>

      <div className="space-y-2">
        {ingredients.map((ing, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="text" value={ing.name} onChange={e => update(i, "name", e.target.value)} placeholder="Ingredient"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <input type="number" value={ing.amount} onChange={e => update(i, "amount", +e.target.value)} min={0} step={0.25}
              className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <input type="text" value={ing.unit} onChange={e => update(i, "unit", e.target.value)} placeholder="unit"
              className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            <span className="text-sm font-bold text-orange-600 w-20 text-right">{formatAmount(ing.amount * ratio)} {ing.unit}</span>
            <button onClick={() => remove(i)} className="text-gray-400 hover:text-red-500">✕</button>
          </div>
        ))}
      </div>

      <button onClick={addIngredient} className="text-sm text-orange-600 hover:text-orange-700 font-medium">+ Add Ingredient</button>
    </div>
  );
};

export default RecipeScaler;
