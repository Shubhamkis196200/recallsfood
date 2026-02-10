import { useState } from "react";

const WaterIntakeCalculator = () => {
  const [weight, setWeight] = useState(170);
  const [activity, setActivity] = useState<"low"|"moderate"|"high">("moderate");
  const [climate, setClimate] = useState<"temperate"|"hot">("temperate");

  const base = weight * 0.5; // oz
  const activityAdd = activity === "low" ? 0 : activity === "moderate" ? 16 : 32;
  const climateAdd = climate === "hot" ? 16 : 0;
  const totalOz = base + activityAdd + climateAdd;
  const cups = totalOz / 8;
  const liters = totalOz * 0.0296;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
          <input type="number" min={50} max={500} value={weight} onChange={e => setWeight(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
          <select value={activity} onChange={e => setActivity(e.target.value as any)} className="w-full border rounded-lg px-3 py-2">
            <option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High/Athletic</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Climate</label>
          <select value={climate} onChange={e => setClimate(e.target.value as any)} className="w-full border rounded-lg px-3 py-2">
            <option value="temperate">Temperate</option><option value="hot">Hot/Humid</option>
          </select>
        </div>
      </div>

      <div className="p-6 rounded-xl border-2 border-blue-200 bg-blue-50 text-center">
        <p className="text-sm text-gray-500">💧 Daily Water Intake</p>
        <p className="text-4xl font-bold text-blue-600">{Math.round(totalOz)} oz</p>
        <p className="text-gray-500">{cups.toFixed(1)} cups • {liters.toFixed(1)} liters</p>
        <p className="text-sm text-gray-400 mt-2">That's about {Math.ceil(totalOz / 16.9)} standard water bottles (16.9 oz)</p>
      </div>
    </div>
  );
};

export default WaterIntakeCalculator;
