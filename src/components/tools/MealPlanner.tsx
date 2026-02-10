import { useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const meals = ["Breakfast", "Lunch", "Dinner", "Snack"];

const MealPlanner = () => {
  const [plan, setPlan] = useState<Record<string, Record<string, string>>>(() => {
    const init: Record<string, Record<string, string>> = {};
    days.forEach(d => { init[d] = {}; meals.forEach(m => { init[d][m] = ""; }); });
    return init;
  });

  const update = (day: string, meal: string, value: string) => {
    setPlan(p => ({ ...p, [day]: { ...p[day], [meal]: value } }));
  };

  const filled = Object.values(plan).flatMap(d => Object.values(d)).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{filled}/{days.length * meals.length} meals planned</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-3 py-2 text-left">Day</th>
              {meals.map(m => <th key={m} className="px-3 py-2 text-left">{m}</th>)}
            </tr>
          </thead>
          <tbody>
            {days.map((d, i) => (
              <tr key={d} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-3 py-2 font-medium whitespace-nowrap">{d}</td>
                {meals.map(m => (
                  <td key={m} className="px-2 py-1">
                    <input type="text" value={plan[d][m]} onChange={e => update(d, m, e.target.value)}
                      placeholder="Enter meal..."
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <button onClick={() => {
          const init: Record<string, Record<string, string>> = {};
          days.forEach(d => { init[d] = {}; meals.forEach(m => { init[d][m] = ""; }); });
          setPlan(init);
        }} className="text-xs text-red-500 hover:text-red-700">Clear All</button>
      </div>
    </div>
  );
};

export default MealPlanner;
