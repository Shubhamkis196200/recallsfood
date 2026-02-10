import { useState } from "react";

const conversions: Record<string, number> = {
  "teaspoon (tsp)": 4.929,
  "tablespoon (tbsp)": 14.787,
  "fluid ounce (fl oz)": 29.574,
  "cup": 236.588,
  "pint": 473.176,
  "quart": 946.353,
  "gallon": 3785.41,
  "milliliter (mL)": 1,
  "liter (L)": 1000,
  "gram (g)": 1,
  "ounce (oz)": 28.3495,
  "pound (lb)": 453.592,
  "kilogram (kg)": 1000,
};

const volumeUnits = ["teaspoon (tsp)", "tablespoon (tbsp)", "fluid ounce (fl oz)", "cup", "pint", "quart", "gallon", "milliliter (mL)", "liter (L)"];
const weightUnits = ["gram (g)", "ounce (oz)", "pound (lb)", "kilogram (kg)"];

const UnitConverter = () => {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState("cup");
  const [type, setType] = useState<"volume" | "weight">("volume");

  const units = type === "volume" ? volumeUnits : weightUnits;
  const baseML = value * conversions[from];

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button onClick={() => { setType("volume"); setFrom("cup"); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${type === "volume" ? "bg-orange-600 text-white" : "bg-gray-100"}`}>Volume</button>
        <button onClick={() => { setType("weight"); setFrom("gram (g)"); }} className={`px-4 py-2 rounded-lg text-sm font-medium ${type === "weight" ? "bg-orange-600 text-white" : "bg-gray-100"}`}>Weight</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input type="number" value={value} onChange={e => setValue(+e.target.value)} min={0} step={0.01}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <select value={from} onChange={e => setFrom(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2">
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {units.filter(u => u !== from).map(u => (
          <div key={u} className="p-3 rounded-lg bg-white border border-gray-200">
            <p className="text-xs text-gray-500">{u}</p>
            <p className="text-lg font-bold text-gray-900">{(baseML / conversions[u]).toFixed(3)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitConverter;
