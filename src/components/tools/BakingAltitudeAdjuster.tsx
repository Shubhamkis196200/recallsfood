import { useState } from "react";

const BakingAltitudeAdjuster = () => {
  const [altitude, setAltitude] = useState(5000);
  const [sugar, setSugar] = useState(1);
  const [liquid, setLiquid] = useState(1);
  const [flour, setFlour] = useState(2);
  const [leavening, setLeavening] = useState(1);
  const [ovenTemp, setOvenTemp] = useState(350);

  const factor = altitude < 3000 ? 0 : altitude < 5000 ? 1 : altitude < 7000 ? 2 : 3;
  const sugarReduce = [0, 0.06, 0.12, 0.18][factor]; // cups per cup
  const liquidIncrease = [0, 0.02, 0.04, 0.06][factor]; // cups per cup
  const flourIncrease = [0, 0.06, 0.06, 0.12][factor]; // cups per cup
  const leaveningReduce = [0, 0.12, 0.25, 0.25][factor]; // fraction to reduce
  const tempIncrease = [0, 15, 25, 25][factor];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Altitude (feet)</label>
        <input type="range" min={0} max={10000} step={500} value={altitude} onChange={e => setAltitude(+e.target.value)}
          className="w-full" />
        <p className="text-center text-lg font-bold">{altitude.toLocaleString()} ft</p>
      </div>

      {factor === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
          ✅ No adjustment needed below 3,000 ft. Your recipes should work as-is!
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Original Sugar (cups)</label>
              <input type="number" step={0.25} min={0} value={sugar} onChange={e => setSugar(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Original Liquid (cups)</label>
              <input type="number" step={0.25} min={0} value={liquid} onChange={e => setLiquid(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Original Flour (cups)</label>
              <input type="number" step={0.25} min={0} value={flour} onChange={e => setFlour(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Original Leavening (tsp)</label>
              <input type="number" step={0.25} min={0} value={leavening} onChange={e => setLeavening(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-amber-800">⛰️ Adjusted Recipe</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between"><span>Sugar:</span><strong>{(sugar - sugar * sugarReduce).toFixed(2)} cups</strong></div>
              <div className="flex justify-between"><span>Liquid:</span><strong>{(liquid + liquid * liquidIncrease).toFixed(2)} cups</strong></div>
              <div className="flex justify-between"><span>Flour:</span><strong>{(flour + flour * flourIncrease).toFixed(2)} cups</strong></div>
              <div className="flex justify-between"><span>Leavening:</span><strong>{(leavening - leavening * leaveningReduce).toFixed(2)} tsp</strong></div>
              <div className="flex justify-between"><span>Oven Temp:</span><strong>{ovenTemp + tempIncrease}°F</strong></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BakingAltitudeAdjuster;
