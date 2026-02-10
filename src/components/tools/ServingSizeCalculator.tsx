import { useState } from "react";

const servingData: Record<string, { perPerson: string; unit: string }> = {
  "Meat (boneless)": { perPerson: "6-8", unit: "oz" },
  "Meat (bone-in)": { perPerson: "8-12", unit: "oz" },
  "Chicken Breast": { perPerson: "6-8", unit: "oz" },
  "Fish Fillet": { perPerson: "6-8", unit: "oz" },
  "Rice/Pasta (dry)": { perPerson: "2-3", unit: "oz" },
  "Salad Greens": { perPerson: "2-3", unit: "cups" },
  "Vegetables (side)": { perPerson: "4-6", unit: "oz" },
  "Bread": { perPerson: "1.5-2", unit: "slices" },
  "Soup": { perPerson: "8-12", unit: "oz" },
  "Dessert": { perPerson: "1", unit: "serving" },
  "Appetizers": { perPerson: "4-6", unit: "pieces" },
  "Potatoes": { perPerson: "5-6", unit: "oz" },
};

const ServingSizeCalculator = () => {
  const [guests, setGuests] = useState(4);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
        <input type="number" min={1} max={200} value={guests} onChange={e => setGuests(+e.target.value)}
          className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500" />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {Object.entries(servingData).map(([food, info]) => {
          const [low, high] = info.perPerson.split("-").map(Number);
          const totalLow = Math.ceil((low || 1) * guests);
          const totalHigh = high ? Math.ceil(high * guests) : totalLow;
          return (
            <div key={food} className="p-4 rounded-xl border border-gray-200 bg-white">
              <h3 className="font-medium text-gray-900 text-sm">{food}</h3>
              <p className="text-lg font-bold text-rose-600 mt-1">
                {totalLow === totalHigh ? totalLow : `${totalLow}–${totalHigh}`} {info.unit}
              </p>
              <p className="text-xs text-gray-400">{info.perPerson} {info.unit} per person</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServingSizeCalculator;
