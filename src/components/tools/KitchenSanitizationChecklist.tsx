import { useState } from "react";

const tasks = {
  "Daily": [
    "Wipe down countertops with disinfectant",
    "Clean and sanitize cutting boards",
    "Wash dish cloths/sponges (or replace)",
    "Clean stovetop after cooking",
    "Sweep kitchen floor",
    "Empty trash if full",
    "Wipe down sink",
    "Clean coffee maker drip tray",
  ],
  "Weekly": [
    "Deep clean sink with baking soda",
    "Clean microwave interior",
    "Wipe down all appliance exteriors",
    "Clean oven exterior and knobs",
    "Mop kitchen floor",
    "Wipe cabinet handles and light switches",
    "Clean out fridge — check for expired items",
    "Sanitize trash can",
  ],
  "Monthly": [
    "Deep clean oven interior",
    "Clean refrigerator shelves and drawers",
    "Descale coffee maker/kettle",
    "Clean range hood filter",
    "Check pantry for expired items",
    "Deep clean dishwasher",
    "Wipe behind and under appliances",
    "Sharpen kitchen knives",
  ],
};

const KitchenSanitizationChecklist = () => {
  const [checked, setChecked] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("kitchenChecklist");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const toggle = (item: string) => {
    const next = new Set(checked);
    if (next.has(item)) next.delete(item); else next.add(item);
    setChecked(next);
    localStorage.setItem("kitchenChecklist", JSON.stringify([...next]));
  };

  const clearAll = () => { setChecked(new Set()); localStorage.removeItem("kitchenChecklist"); };

  const total = Object.values(tasks).flat().length;
  const done = checked.size;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{done} of {total} tasks complete</p>
          <div className="w-48 h-2 bg-gray-200 rounded-full mt-1">
            <div className="h-2 bg-green-500 rounded-full transition-all" style={{ width: `${(done / total) * 100}%` }} />
          </div>
        </div>
        <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700">Reset All</button>
      </div>

      {Object.entries(tasks).map(([freq, items]) => (
        <div key={freq}>
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${freq === "Daily" ? "bg-green-500" : freq === "Weekly" ? "bg-blue-500" : "bg-purple-500"}`} />
            {freq}
          </h3>
          <div className="space-y-2">
            {items.map(item => (
              <label key={item} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${checked.has(item) ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:border-gray-300"}`}>
                <input type="checkbox" checked={checked.has(item)} onChange={() => toggle(item)}
                  className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                <span className={`text-sm ${checked.has(item) ? "line-through text-gray-400" : "text-gray-700"}`}>{item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KitchenSanitizationChecklist;
