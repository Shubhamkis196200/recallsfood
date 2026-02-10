import { useState } from "react";

const storageData = [
  { food: "Raw Chicken", fridge: "1-2 days", freezer: "9 months", pantry: "—", icon: "🍗" },
  { food: "Raw Ground Beef", fridge: "1-2 days", freezer: "3-4 months", pantry: "—", icon: "🥩" },
  { food: "Raw Steak", fridge: "3-5 days", freezer: "6-12 months", pantry: "—", icon: "🥩" },
  { food: "Raw Fish", fridge: "1-2 days", freezer: "3-6 months", pantry: "—", icon: "🐟" },
  { food: "Raw Shrimp", fridge: "1-2 days", freezer: "6-12 months", pantry: "—", icon: "🦐" },
  { food: "Cooked Meat/Poultry", fridge: "3-4 days", freezer: "2-3 months", pantry: "—", icon: "🍖" },
  { food: "Cooked Rice", fridge: "4-6 days", freezer: "6 months", pantry: "—", icon: "🍚" },
  { food: "Cooked Pasta", fridge: "3-5 days", freezer: "1-2 months", pantry: "—", icon: "🍝" },
  { food: "Milk", fridge: "5-7 days", freezer: "3 months", pantry: "—", icon: "🥛" },
  { food: "Hard Cheese", fridge: "3-4 weeks (opened)", freezer: "6 months", pantry: "—", icon: "🧀" },
  { food: "Soft Cheese", fridge: "1 week (opened)", freezer: "6 months", pantry: "—", icon: "🧀" },
  { food: "Eggs", fridge: "3-5 weeks", freezer: "1 year (beaten)", pantry: "—", icon: "🥚" },
  { food: "Yogurt", fridge: "1-2 weeks", freezer: "1-2 months", pantry: "—", icon: "🥛" },
  { food: "Butter", fridge: "1-2 months", freezer: "6-9 months", pantry: "—", icon: "🧈" },
  { food: "Deli Meat", fridge: "3-5 days (opened)", freezer: "1-2 months", pantry: "—", icon: "🥓" },
  { food: "Hot Dogs", fridge: "1 week (opened)", freezer: "1-2 months", pantry: "—", icon: "🌭" },
  { food: "Fresh Berries", fridge: "3-5 days", freezer: "6-12 months", pantry: "—", icon: "🫐" },
  { food: "Apples", fridge: "4-6 weeks", freezer: "8 months", pantry: "5-7 days", icon: "🍎" },
  { food: "Bananas", fridge: "5-7 days", freezer: "2-3 months", pantry: "2-5 days", icon: "🍌" },
  { food: "Lettuce/Salad", fridge: "3-7 days", freezer: "—", pantry: "—", icon: "🥬" },
  { food: "Tomatoes", fridge: "1-2 weeks", freezer: "2 months", pantry: "5-7 days", icon: "🍅" },
  { food: "Bread", fridge: "—", freezer: "3 months", pantry: "5-7 days", icon: "🍞" },
  { food: "Canned Goods (Opened)", fridge: "3-4 days", freezer: "2 months", pantry: "—", icon: "🥫" },
  { food: "Canned Goods (Unopened)", fridge: "—", freezer: "—", pantry: "1-5 years", icon: "🥫" },
  { food: "Dry Pasta", fridge: "—", freezer: "—", pantry: "1-2 years", icon: "🍝" },
  { food: "Rice (Uncooked, White)", fridge: "—", freezer: "—", pantry: "2+ years", icon: "🍚" },
  { food: "Flour", fridge: "—", freezer: "1 year", pantry: "6-8 months", icon: "🌾" },
  { food: "Sugar", fridge: "—", freezer: "—", pantry: "Indefinite", icon: "🍬" },
  { food: "Olive Oil", fridge: "—", freezer: "—", pantry: "18-24 months", icon: "🫒" },
  { food: "Condiments (Opened)", fridge: "6-12 months", freezer: "—", pantry: "—", icon: "🧴" },
];

const FoodStorageTimeGuide = () => {
  const [search, setSearch] = useState("");
  const filtered = storageData.filter(f => f.food.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <input type="text" placeholder="Search foods..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-teal-600 text-white">
              <th className="px-3 py-3 text-left">Food</th>
              <th className="px-3 py-3 text-center">🧊 Fridge</th>
              <th className="px-3 py-3 text-center">❄️ Freezer</th>
              <th className="px-3 py-3 text-center">🗄️ Pantry</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => (
              <tr key={f.food} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-3 py-2.5 font-medium">{f.icon} {f.food}</td>
                <td className="px-3 py-2.5 text-center text-gray-700">{f.fridge}</td>
                <td className="px-3 py-2.5 text-center text-gray-700">{f.freezer}</td>
                <td className="px-3 py-2.5 text-center text-gray-700">{f.pantry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodStorageTimeGuide;
