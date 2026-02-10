import { useState } from "react";

const drinks: Record<string, number> = {
  "Coffee (8 oz)": 95,
  "Espresso (1 shot)": 63,
  "Decaf Coffee (8 oz)": 5,
  "Black Tea (8 oz)": 47,
  "Green Tea (8 oz)": 28,
  "Cola (12 oz)": 34,
  "Diet Cola (12 oz)": 46,
  "Energy Drink (8 oz)": 80,
  "Monster/Rockstar (16 oz)": 160,
  "Red Bull (8.4 oz)": 80,
  "Hot Chocolate (8 oz)": 5,
  "Dark Chocolate (1 oz)": 23,
  "Pre-Workout (1 scoop)": 200,
};

const CaffeineCalculator = () => {
  const [items, setItems] = useState<{ drink: string; qty: number }[]>([
    { drink: "Coffee (8 oz)", qty: 2 },
  ]);

  const total = items.reduce((sum, i) => sum + (drinks[i.drink] || 0) * i.qty, 0);
  const limit = 400;
  const pct = Math.min((total / limit) * 100, 100);
  const over = total > limit;

  const add = () => setItems([...items, { drink: "Coffee (8 oz)", qty: 1 }]);

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <select value={item.drink} onChange={e => { const n = [...items]; n[i].drink = e.target.value; setItems(n); }}
            className="flex-1 border rounded-lg px-3 py-2 text-sm">
            {Object.keys(drinks).map(d => <option key={d}>{d}</option>)}
          </select>
          <input type="number" min={0} max={20} value={item.qty}
            onChange={e => { const n = [...items]; n[i].qty = +e.target.value; setItems(n); }}
            className="w-16 border rounded-lg px-3 py-2 text-sm text-center" />
          <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">✕</button>
        </div>
      ))}
      <button onClick={add} className="text-sm text-amber-700 font-medium">+ Add Drink</button>

      <div className={`p-6 rounded-xl border-2 text-center ${over ? "border-red-300 bg-red-50" : "border-green-200 bg-green-50"}`}>
        <p className="text-sm text-gray-500">Daily Caffeine Intake</p>
        <p className={`text-4xl font-bold ${over ? "text-red-600" : "text-green-600"}`}>{total} mg</p>
        <div className="w-full h-3 bg-gray-200 rounded-full mt-3">
          <div className={`h-3 rounded-full ${over ? "bg-red-500" : "bg-green-500"}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">{total}/{limit} mg (FDA recommended max)</p>
        {over && <p className="text-sm text-red-600 font-medium mt-2">⚠️ You're over the recommended daily limit!</p>}
      </div>
    </div>
  );
};

export default CaffeineCalculator;
