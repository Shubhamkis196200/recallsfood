import { useState } from "react";

const foods: Record<string, number> = { // grams of sugar per serving
  "Cola (12 oz)": 39, "Apple juice (8 oz)": 24, "Orange juice (8 oz)": 21,
  "Yogurt (flavored, 6 oz)": 19, "Granola bar": 12, "Banana": 14,
  "Apple": 19, "Chocolate bar": 24, "Ice cream (½ cup)": 14,
  "Cereal (1 cup)": 12, "Ketchup (1 tbsp)": 4, "Pasta sauce (½ cup)": 8,
  "Bread (1 slice)": 3, "Cookie": 11, "Donut": 17,
  "Sports drink (20 oz)": 34, "Sweetened tea (12 oz)": 32,
  "Energy drink (8 oz)": 27, "Protein bar": 15, "Muffin": 22,
};

const SugarIntakeTracker = () => {
  const [items, setItems] = useState<{ food: string; qty: number }[]>([]);
  const total = items.reduce((sum, i) => sum + (foods[i.food] || 0) * i.qty, 0);
  const limit = 25; // WHO recommendation for women (men: 36g AHA)
  const add = () => setItems([...items, { food: Object.keys(foods)[0], qty: 1 }]);

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <select value={item.food} onChange={e => { const n = [...items]; n[i].food = e.target.value; setItems(n); }}
            className="flex-1 border rounded-lg px-3 py-2 text-sm">
            {Object.keys(foods).map(f => <option key={f}>{f} ({foods[f]}g)</option>)}
          </select>
          <input type="number" min={0} max={20} value={item.qty}
            onChange={e => { const n = [...items]; n[i].qty = +e.target.value; setItems(n); }}
            className="w-16 border rounded-lg px-3 py-2 text-sm text-center" />
          <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">✕</button>
        </div>
      ))}
      <button onClick={add} className="text-sm text-pink-600 font-medium">+ Add Food</button>

      <div className={`p-6 rounded-xl border-2 text-center ${total > limit ? "border-red-300 bg-red-50" : "border-green-200 bg-green-50"}`}>
        <p className="text-sm text-gray-500">🍬 Daily Sugar</p>
        <p className={`text-4xl font-bold ${total > limit ? "text-red-600" : "text-green-600"}`}>{total}g</p>
        <div className="w-full h-3 bg-gray-200 rounded-full mt-3">
          <div className={`h-3 rounded-full ${total > limit ? "bg-red-500" : "bg-green-500"}`} style={{ width: `${Math.min((total / 50) * 100, 100)}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">WHO limit: 25g/day (women) • AHA limit: 36g/day (men)</p>
      </div>
    </div>
  );
};

export default SugarIntakeTracker;
