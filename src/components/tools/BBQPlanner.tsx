import { useState } from "react";

const meats: Record<string, { lbsPerPerson: number; cookTimePerLb: number; restMin: number; temp: number }> = {
  "Beef Brisket": { lbsPerPerson: 0.5, cookTimePerLb: 75, restMin: 30, temp: 200 },
  "Pork Ribs (baby back)": { lbsPerPerson: 0.75, cookTimePerLb: 45, restMin: 15, temp: 195 },
  "Pork Ribs (spare)": { lbsPerPerson: 1, cookTimePerLb: 50, restMin: 15, temp: 195 },
  "Pulled Pork (shoulder)": { lbsPerPerson: 0.33, cookTimePerLb: 90, restMin: 30, temp: 203 },
  "Chicken (whole)": { lbsPerPerson: 0.75, cookTimePerLb: 20, restMin: 15, temp: 165 },
  "Chicken Wings": { lbsPerPerson: 0.5, cookTimePerLb: 10, restMin: 5, temp: 165 },
  "Burgers (¼ lb)": { lbsPerPerson: 0.5, cookTimePerLb: 0, restMin: 5, temp: 160 },
  "Hot Dogs": { lbsPerPerson: 0.25, cookTimePerLb: 0, restMin: 0, temp: 165 },
  "Sausages": { lbsPerPerson: 0.33, cookTimePerLb: 0, restMin: 5, temp: 160 },
  "Steak": { lbsPerPerson: 0.5, cookTimePerLb: 0, restMin: 10, temp: 145 },
};

const BBQPlanner = () => {
  const [guests, setGuests] = useState(10);
  const [meat, setMeat] = useState("Pulled Pork (shoulder)");

  const m = meats[meat];
  const totalLbs = Math.ceil(m.lbsPerPerson * guests * 10) / 10;
  const cookMins = totalLbs * m.cookTimePerLb;
  const cookHrs = Math.ceil(cookMins / 60 * 10) / 10;

  const sides = [
    { name: "Coleslaw", amount: `${Math.ceil(guests * 0.3)} lbs` },
    { name: "Baked Beans", amount: `${Math.ceil(guests * 0.25)} lbs` },
    { name: "Corn", amount: `${guests} ears` },
    { name: "Potato Salad", amount: `${Math.ceil(guests * 0.3)} lbs` },
    { name: "Buns/Bread", amount: `${Math.ceil(guests * 1.5)} pieces` },
    { name: "BBQ Sauce", amount: `${Math.ceil(guests / 8)} bottles` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
          <input type="number" min={2} max={100} value={guests} onChange={e => setGuests(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Main Meat</label>
          <select value={meat} onChange={e => setMeat(e.target.value)} className="w-full border rounded-lg px-3 py-2">
            {Object.keys(meats).map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border-2 border-orange-200 bg-orange-50 text-center">
          <p className="text-xs text-gray-500">🥩 Meat Needed</p>
          <p className="text-2xl font-bold text-orange-600">{totalLbs} lbs</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 text-center">
          <p className="text-xs text-gray-500">🌡️ Target Temp</p>
          <p className="text-2xl font-bold text-red-600">{m.temp}°F</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50 text-center">
          <p className="text-xs text-gray-500">⏱️ Cook Time</p>
          <p className="text-2xl font-bold text-amber-600">{cookHrs > 0 ? `~${cookHrs}h` : "8-10 min"}</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 text-center">
          <p className="text-xs text-gray-500">😴 Rest Time</p>
          <p className="text-2xl font-bold text-blue-600">{m.restMin} min</p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-2">🥗 Recommended Sides</h3>
        <div className="grid sm:grid-cols-3 gap-2">
          {sides.map(s => (
            <div key={s.name} className="flex justify-between p-3 rounded-lg border border-gray-200 text-sm">
              <span>{s.name}</span>
              <span className="font-bold text-orange-600">{s.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BBQPlanner;
