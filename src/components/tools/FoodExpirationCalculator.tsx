import { useState } from "react";

const foodTypes: Record<string, { fridge: number; freezer: number; pantry: number | null }> = {
  "Raw Chicken": { fridge: 2, freezer: 270, pantry: null },
  "Raw Ground Beef": { fridge: 2, freezer: 120, pantry: null },
  "Raw Steak": { fridge: 5, freezer: 180, pantry: null },
  "Raw Pork": { fridge: 5, freezer: 180, pantry: null },
  "Raw Fish": { fridge: 2, freezer: 90, pantry: null },
  "Cooked Chicken": { fridge: 4, freezer: 120, pantry: null },
  "Cooked Beef": { fridge: 4, freezer: 90, pantry: null },
  "Cooked Rice": { fridge: 4, freezer: 180, pantry: null },
  "Cooked Pasta": { fridge: 5, freezer: 60, pantry: null },
  "Fresh Milk": { fridge: 7, freezer: 90, pantry: null },
  "Hard Cheese": { fridge: 42, freezer: 180, pantry: null },
  "Soft Cheese": { fridge: 7, freezer: 180, pantry: null },
  "Eggs": { fridge: 35, freezer: 365, pantry: null },
  "Fresh Berries": { fridge: 5, freezer: 180, pantry: null },
  "Apples": { fridge: 28, freezer: 240, pantry: 7 },
  "Bread": { fridge: 14, freezer: 90, pantry: 7 },
  "Yogurt": { fridge: 14, freezer: 60, pantry: null },
  "Butter": { fridge: 30, freezer: 270, pantry: null },
  "Deli Meat": { fridge: 5, freezer: 60, pantry: null },
  "Leftovers (General)": { fridge: 4, freezer: 90, pantry: null },
  "Canned Goods (Opened)": { fridge: 5, freezer: null, pantry: null },
  "Canned Goods (Unopened)": { fridge: null, freezer: null, pantry: 730 },
  "Dry Pasta": { fridge: null, freezer: null, pantry: 730 },
  "Rice (Uncooked)": { fridge: null, freezer: null, pantry: 730 },
  "Condiments (Opened)": { fridge: 180, freezer: null, pantry: null },
};

const FoodExpirationCalculator = () => {
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [foodType, setFoodType] = useState("Raw Chicken");

  const food = foodTypes[foodType];
  const purchase = new Date(purchaseDate);

  const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  const formatDate = (date: Date) => date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const isExpired = (days: number) => addDays(purchase, days) < new Date();

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
          <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
          <select value={foodType} onChange={e => setFoodType(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500">
            {Object.keys(foodTypes).map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {food.fridge && (
          <div className={`p-4 rounded-xl border-2 ${isExpired(food.fridge) ? "border-red-300 bg-red-50" : "border-blue-200 bg-blue-50"}`}>
            <p className="text-xs font-semibold uppercase text-gray-500">🧊 Refrigerator</p>
            <p className="text-lg font-bold mt-1">{food.fridge} days</p>
            <p className={`text-sm mt-1 ${isExpired(food.fridge) ? "text-red-600 font-semibold" : "text-gray-600"}`}>
              {isExpired(food.fridge) ? "⚠️ EXPIRED" : `Safe until ${formatDate(addDays(purchase, food.fridge))}`}
            </p>
          </div>
        )}
        {food.freezer && (
          <div className="p-4 rounded-xl border-2 border-cyan-200 bg-cyan-50">
            <p className="text-xs font-semibold uppercase text-gray-500">❄️ Freezer</p>
            <p className="text-lg font-bold mt-1">{food.freezer} days</p>
            <p className="text-sm text-gray-600 mt-1">Safe until {formatDate(addDays(purchase, food.freezer))}</p>
          </div>
        )}
        {food.pantry && (
          <div className={`p-4 rounded-xl border-2 ${isExpired(food.pantry) ? "border-red-300 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
            <p className="text-xs font-semibold uppercase text-gray-500">🗄️ Pantry</p>
            <p className="text-lg font-bold mt-1">{food.pantry} days</p>
            <p className={`text-sm mt-1 ${isExpired(food.pantry) ? "text-red-600 font-semibold" : "text-gray-600"}`}>
              {isExpired(food.pantry) ? "⚠️ EXPIRED" : `Safe until ${formatDate(addDays(purchase, food.pantry))}`}
            </p>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <strong>⚠️ Disclaimer:</strong> These are general guidelines based on USDA recommendations. Always use your senses — if food looks, smells, or tastes off, discard it regardless of dates.
      </div>
    </div>
  );
};

export default FoodExpirationCalculator;
