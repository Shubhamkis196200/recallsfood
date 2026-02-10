import { useState } from "react";

const zones = [
  { zone: "Top Shelf", temp: "34-38°F (1-3°C)", items: "Ready-to-eat foods, drinks, leftovers, herbs", color: "bg-blue-100 border-blue-300", tip: "Warmest area — best for items that don't need the coldest temps" },
  { zone: "Middle Shelf", temp: "35-38°F (2-3°C)", items: "Dairy, eggs, deli meats, cooked foods", color: "bg-cyan-100 border-cyan-300", tip: "Most consistent temperature zone" },
  { zone: "Bottom Shelf", temp: "32-36°F (0-2°C)", items: "Raw meat, poultry, fish (in sealed containers)", color: "bg-indigo-100 border-indigo-300", tip: "Coldest zone — store raw proteins here to prevent drips onto other foods" },
  { zone: "Crisper Drawers", temp: "34-40°F (1-4°C)", items: "Fruits (low humidity) and vegetables (high humidity)", color: "bg-green-100 border-green-300", tip: "Adjust humidity: low for fruits, high for vegetables" },
  { zone: "Door", temp: "38-42°F (3-6°C)", items: "Condiments, juice, water, butter", color: "bg-amber-100 border-amber-300", tip: "Warmest spot — NEVER store milk or eggs here" },
];

const FridgeTemperatureGuide = () => {
  const [tempF, setTempF] = useState<string>("");
  const temp = parseFloat(tempF);

  const getStatus = () => {
    if (!temp || isNaN(temp)) return null;
    if (temp < 32) return { status: "Too Cold", color: "text-blue-700 bg-blue-50 border-blue-200", msg: "Your fridge is too cold! Foods may freeze, damaging texture and quality. Raise the temperature slightly." };
    if (temp <= 34) return { status: "Cold but OK", color: "text-cyan-700 bg-cyan-50 border-cyan-200", msg: "A bit colder than necessary but safe. Some delicate produce may get frost damage." };
    if (temp <= 38) return { status: "Ideal ✅", color: "text-green-700 bg-green-50 border-green-200", msg: "Perfect! Your fridge is in the ideal range (35-38°F). Food stays safe and fresh." };
    if (temp <= 40) return { status: "Borderline", color: "text-yellow-700 bg-yellow-50 border-yellow-200", msg: "Getting warm. USDA considers 40°F the upper safe limit. Lower your temperature soon." };
    return { status: "Danger Zone! ⚠️", color: "text-red-700 bg-red-50 border-red-200", msg: "Above 40°F is the DANGER ZONE. Bacteria multiply rapidly. Lower temperature immediately or food may become unsafe." };
  };

  const status = getStatus();

  return (
    <div className="space-y-6">
      {/* Temp checker */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-3">🌡️ Check Your Fridge Temperature</h3>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm text-gray-600 block mb-1">What does your fridge thermometer read?</label>
            <input type="number" value={tempF} onChange={e => setTempF(e.target.value)} placeholder="e.g., 37"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500" />
          </div>
          <span className="text-gray-500 pb-2.5">°F</span>
        </div>
        {status && (
          <div className={`mt-3 p-3 rounded-lg border ${status.color} text-sm`}>
            <strong>{status.status}</strong> — {status.msg}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
        <p className="text-sm text-blue-700">Ideal fridge temperature: <strong className="text-2xl">37°F (3°C)</strong></p>
        <p className="text-xs text-blue-500 mt-1">Freezer should be at 0°F (-18°C) or below</p>
      </div>

      <div className="space-y-3">
        {zones.map(z => (
          <div key={z.zone} className={`p-4 rounded-xl border-2 ${z.color}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{z.zone}</h3>
                <p className="text-sm font-mono text-gray-700 mt-1">{z.temp}</p>
                <p className="text-sm text-gray-600 mt-2"><strong>Store:</strong> {z.items}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">💡 {z.tip}</p>
          </div>
        ))}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
        <h3 className="font-bold text-red-800 mb-2">⚠️ Danger Zone</h3>
        <p className="text-red-700">Food left between <strong>40°F–140°F (4°C–60°C)</strong> for more than 2 hours should be discarded. Bacteria multiply rapidly in this range.</p>
      </div>
    </div>
  );
};

export default FridgeTemperatureGuide;
