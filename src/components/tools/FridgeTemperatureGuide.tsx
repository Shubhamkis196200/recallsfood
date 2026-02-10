const zones = [
  { zone: "Top Shelf", temp: "34-38°F (1-3°C)", items: "Ready-to-eat foods, drinks, leftovers, herbs", color: "bg-blue-100 border-blue-300", tip: "Warmest area — best for items that don't need the coldest temps" },
  { zone: "Middle Shelf", temp: "35-38°F (2-3°C)", items: "Dairy, eggs, deli meats, cooked foods", color: "bg-cyan-100 border-cyan-300", tip: "Most consistent temperature zone" },
  { zone: "Bottom Shelf", temp: "32-36°F (0-2°C)", items: "Raw meat, poultry, fish (in sealed containers)", color: "bg-indigo-100 border-indigo-300", tip: "Coldest zone — store raw proteins here to prevent drips onto other foods" },
  { zone: "Crisper Drawers", temp: "34-40°F (1-4°C)", items: "Fruits (low humidity) and vegetables (high humidity)", color: "bg-green-100 border-green-300", tip: "Adjust humidity: low for fruits, high for vegetables" },
  { zone: "Door", temp: "38-42°F (3-6°C)", items: "Condiments, juice, water, butter", color: "bg-amber-100 border-amber-300", tip: "Warmest spot — NEVER store milk or eggs here" },
];

const FridgeTemperatureGuide = () => (
  <div className="space-y-6">
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

export default FridgeTemperatureGuide;
