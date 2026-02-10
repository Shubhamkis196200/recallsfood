import { useState } from "react";

const temps = [
  { food: "Beef Steaks", temp: 145, rest: "3 min", icon: "🥩" },
  { food: "Beef Roasts", temp: 145, rest: "3 min", icon: "🥩" },
  { food: "Ground Beef", temp: 160, rest: "None", icon: "🍔" },
  { food: "Pork Chops", temp: 145, rest: "3 min", icon: "🥩" },
  { food: "Pork Roast", temp: 145, rest: "3 min", icon: "🥩" },
  { food: "Ground Pork", temp: 160, rest: "None", icon: "🍖" },
  { food: "Chicken Breast", temp: 165, rest: "None", icon: "🍗" },
  { food: "Chicken Thighs", temp: 165, rest: "None", icon: "🍗" },
  { food: "Whole Chicken", temp: 165, rest: "None", icon: "🐔" },
  { food: "Ground Turkey", temp: 165, rest: "None", icon: "🦃" },
  { food: "Turkey Breast", temp: 165, rest: "None", icon: "🦃" },
  { food: "Duck", temp: 165, rest: "None", icon: "🦆" },
  { food: "Lamb Chops", temp: 145, rest: "3 min", icon: "🐑" },
  { food: "Ground Lamb", temp: 160, rest: "None", icon: "🐑" },
  { food: "Fish Fillets", temp: 145, rest: "None", icon: "🐟" },
  { food: "Shrimp", temp: 145, rest: "None", icon: "🦐" },
  { food: "Lobster", temp: 145, rest: "None", icon: "🦞" },
  { food: "Scallops", temp: 145, rest: "None", icon: "🐚" },
  { food: "Ham (Fresh)", temp: 145, rest: "3 min", icon: "🍖" },
  { food: "Ham (Pre-cooked, reheat)", temp: 140, rest: "None", icon: "🍖" },
  { food: "Eggs", temp: 160, rest: "None", icon: "🥚" },
  { food: "Casseroles", temp: 165, rest: "None", icon: "🍲" },
  { food: "Leftovers (Reheating)", temp: 165, rest: "None", icon: "♨️" },
  { food: "Stuffing", temp: 165, rest: "None", icon: "🥘" },
];

const CookingTemperatureChart = () => {
  const [search, setSearch] = useState("");
  const filtered = temps.filter(t => t.food.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search food (e.g., chicken, beef, fish)..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="px-4 py-3 text-left rounded-tl-lg">Food</th>
              <th className="px-4 py-3 text-center">Min. Internal Temp</th>
              <th className="px-4 py-3 text-center rounded-tr-lg">Rest Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={t.food} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-medium">{t.icon} {t.food}</td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-block bg-red-100 text-red-700 font-bold px-2 py-1 rounded">{t.temp}°F / {Math.round((t.temp - 32) * 5/9)}°C</span>
                </td>
                <td className="px-4 py-3 text-center text-gray-600">{t.rest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">Source: USDA Food Safety and Inspection Service</p>
    </div>
  );
};

export default CookingTemperatureChart;
