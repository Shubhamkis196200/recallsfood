import { useState } from "react";

const foods: Record<string, number> = { // mg sodium
  "Bread (1 slice)": 170, "Cheese (1 oz)": 180, "Deli turkey (2 oz)": 500,
  "Canned soup (1 cup)": 890, "Pizza (1 slice)": 640, "Hot dog": 560,
  "Soy sauce (1 tbsp)": 920, "Pretzels (1 oz)": 450, "Frozen dinner": 800,
  "Bacon (3 slices)": 460, "Ketchup (1 tbsp)": 160, "Chips (1 oz)": 170,
  "Salad dressing (2 tbsp)": 310, "Pickles (1)": 785, "Pasta sauce (½ cup)": 480,
  "Fast food burger": 1050, "French fries (medium)": 270, "Restaurant meal (avg)": 1200,
};

const SodiumCalculator = () => {
  const [items, setItems] = useState<{ food: string; qty: number }[]>([]);
  const total = items.reduce((sum, i) => sum + (foods[i.food] || 0) * i.qty, 0);
  const limit = 2300;
  const add = () => setItems([...items, { food: Object.keys(foods)[0], qty: 1 }]);

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <select value={item.food} onChange={e => { const n = [...items]; n[i].food = e.target.value; setItems(n); }}
            className="flex-1 border rounded-lg px-3 py-2 text-sm">
            {Object.keys(foods).map(f => <option key={f}>{f} ({foods[f]}mg)</option>)}
          </select>
          <input type="number" min={0} max={20} value={item.qty}
            onChange={e => { const n = [...items]; n[i].qty = +e.target.value; setItems(n); }}
            className="w-16 border rounded-lg px-3 py-2 text-sm text-center" />
          <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">✕</button>
        </div>
      ))}
      <button onClick={add} className="text-sm text-gray-600 font-medium">+ Add Food</button>

      <div className={`p-6 rounded-xl border-2 text-center ${total > limit ? "border-red-300 bg-red-50" : "border-green-200 bg-green-50"}`}>
        <p className="text-sm text-gray-500">🧂 Daily Sodium</p>
        <p className={`text-4xl font-bold ${total > limit ? "text-red-600" : "text-green-600"}`}>{total.toLocaleString()} mg</p>
        <div className="w-full h-3 bg-gray-200 rounded-full mt-3">
          <div className={`h-3 rounded-full ${total > limit ? "bg-red-500" : "bg-green-500"}`} style={{ width: `${Math.min((total / limit) * 100, 100)}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">FDA recommended: &lt;2,300mg/day • Ideal: &lt;1,500mg/day</p>
      </div>
    </div>
  );
};

export default SodiumCalculator;
