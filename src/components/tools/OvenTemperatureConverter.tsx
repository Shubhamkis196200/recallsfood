import { useState } from "react";

const presets = [
  { name: "Low/Slow Roast", f: 250 },
  { name: "Standard Bake", f: 350 },
  { name: "Hot Bake", f: 425 },
  { name: "Broil", f: 500 },
  { name: "Pizza", f: 475 },
  { name: "Cookies", f: 375 },
  { name: "Bread", f: 400 },
];

const toC = (f: number) => Math.round((f - 32) * 5 / 9);
const toF = (c: number) => Math.round(c * 9 / 5 + 32);
const toGas = (f: number) => {
  if (f < 250) return "½";
  if (f < 275) return "1";
  if (f < 300) return "2";
  if (f < 325) return "3";
  if (f < 350) return "4";
  if (f < 375) return "5";
  if (f < 400) return "6";
  if (f < 425) return "7";
  if (f < 450) return "8";
  if (f < 475) return "9";
  return "10";
};

const OvenTemperatureConverter = () => {
  const [temp, setTemp] = useState(350);
  const [unit, setUnit] = useState<"F" | "C">("F");
  const f = unit === "F" ? temp : toF(temp);
  const c = unit === "C" ? temp : toC(temp);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
          <input type="number" value={temp} onChange={e => setTemp(+e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Input Unit</label>
          <select value={unit} onChange={e => setUnit(e.target.value as "F" | "C")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2">
            <option value="F">Fahrenheit (°F)</option>
            <option value="C">Celsius (°C)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 text-center">
          <p className="text-xs text-gray-500">Fahrenheit</p>
          <p className="text-3xl font-bold">{f}°F</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 text-center">
          <p className="text-xs text-gray-500">Celsius</p>
          <p className="text-3xl font-bold">{c}°C</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 text-center">
          <p className="text-xs text-gray-500">Gas Mark</p>
          <p className="text-3xl font-bold">{toGas(f)}</p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-2">Common Presets</h3>
        <div className="flex flex-wrap gap-2">
          {presets.map(p => (
            <button key={p.name} onClick={() => { setTemp(p.f); setUnit("F"); }}
              className="text-xs px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              {p.name} ({p.f}°F)
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OvenTemperatureConverter;
