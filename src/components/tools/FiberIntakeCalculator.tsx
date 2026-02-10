import { useState } from "react";

const foods: Record<string, number> = { // grams fiber per serving
  "Black beans (½ cup)": 7.5, "Lentils (½ cup)": 7.8, "Chickpeas (½ cup)": 6.2,
  "Avocado (½)": 5, "Raspberries (1 cup)": 8, "Pear": 5.5,
  "Apple (with skin)": 4.4, "Banana": 3.1, "Broccoli (1 cup)": 5.1,
  "Artichoke": 10.3, "Green peas (½ cup)": 4.4, "Oatmeal (1 cup)": 4,
  "Whole wheat bread (1 slice)": 2, "Quinoa (1 cup)": 5.2, "Brown rice (1 cup)": 3.5,
  "Sweet potato": 3.8, "Almonds (1 oz)": 3.5, "Popcorn (3 cups)": 3.5,
  "Chia seeds (1 oz)": 10.6, "Flaxseed (1 tbsp)": 2.8,
};

const FiberIntakeCalculator = () => {
  const [items, setItems] = useState<{ food: string; qty: number }[]>([]);
  const [gender, setGender] = useState<"male"|"female">("male");
  const total = items.reduce((sum, i) => sum + (foods[i.food] || 0) * i.qty, 0);
  const target = gender === "male" ? 38 : 25;
  const add = () => setItems([...items, { food: Object.keys(foods)[0], qty: 1 }]);

  return (
    <div className="space-y-4">
      <select value={gender} onChange={e => setGender(e.target.value as any)} className="border rounded-lg px-3 py-2 text-sm">
        <option value="male">Male (target: 38g)</option><option value="female">Female (target: 25g)</option>
      </select>

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
      <button onClick={add} className="text-sm text-lime-700 font-medium">+ Add Food</button>

      <div className={`p-6 rounded-xl border-2 text-center ${total >= target ? "border-green-300 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}>
        <p className="text-sm text-gray-500">🌾 Daily Fiber</p>
        <p className={`text-4xl font-bold ${total >= target ? "text-green-600" : "text-yellow-600"}`}>{total.toFixed(1)}g</p>
        <div className="w-full h-3 bg-gray-200 rounded-full mt-3">
          <div className={`h-3 rounded-full ${total >= target ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${Math.min((total / target) * 100, 100)}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">Target: {target}g/day • {total >= target ? "✅ You're meeting your goal!" : `${(target - total).toFixed(1)}g to go`}</p>
      </div>
    </div>
  );
};

export default FiberIntakeCalculator;
