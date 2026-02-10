import { useState } from "react";

const produce: Record<string, string[]> = {
  January: ["Citrus", "Kale", "Leeks", "Turnips", "Sweet Potatoes", "Cabbage", "Broccoli"],
  February: ["Citrus", "Kale", "Brussels Sprouts", "Parsnips", "Turnips", "Avocados"],
  March: ["Artichokes", "Asparagus", "Lettuce", "Mushrooms", "Peas", "Radishes"],
  April: ["Asparagus", "Peas", "Rhubarb", "Spring Onions", "Spinach", "Strawberries"],
  May: ["Strawberries", "Cherries", "Apricots", "Peas", "Asparagus", "Artichokes"],
  June: ["Blueberries", "Strawberries", "Cherries", "Peaches", "Corn", "Tomatoes", "Zucchini"],
  July: ["Blackberries", "Blueberries", "Corn", "Cucumbers", "Green Beans", "Peaches", "Tomatoes", "Watermelon"],
  August: ["Corn", "Eggplant", "Figs", "Grapes", "Melons", "Peppers", "Tomatoes", "Zucchini"],
  September: ["Apples", "Grapes", "Pears", "Peppers", "Squash", "Sweet Potatoes", "Tomatoes"],
  October: ["Apples", "Cranberries", "Pumpkins", "Squash", "Sweet Potatoes", "Turnips", "Pears"],
  November: ["Cranberries", "Pomegranates", "Squash", "Sweet Potatoes", "Turnips", "Pears", "Kale"],
  December: ["Citrus", "Cranberries", "Kale", "Pears", "Pomegranates", "Sweet Potatoes", "Turnips"],
};

const monthColors: Record<string, string> = {
  January: "bg-blue-100", February: "bg-blue-50", March: "bg-green-100", April: "bg-green-200",
  May: "bg-green-300", June: "bg-yellow-100", July: "bg-yellow-200", August: "bg-orange-100",
  September: "bg-orange-200", October: "bg-amber-200", November: "bg-amber-300", December: "bg-blue-100",
};

const SeasonalProduceCalendar = () => {
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const [month, setMonth] = useState(currentMonth);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1">
        {Object.keys(produce).map(m => (
          <button key={m} onClick={() => setMonth(m)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${month === m ? "bg-green-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
            {m.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className={`p-6 rounded-xl ${monthColors[month] || "bg-gray-100"}`}>
        <h3 className="font-bold text-xl text-gray-900">🥬 {month}</h3>
        <div className="flex flex-wrap gap-2 mt-4">
          {produce[month].map(p => (
            <span key={p} className="bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 shadow-sm">
              {p}
            </span>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500">Seasonal availability varies by region. This calendar is based on general US seasons.</p>
    </div>
  );
};

export default SeasonalProduceCalendar;
