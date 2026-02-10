import { useState } from "react";

const peppers = [
  { name: "Bell Pepper", shu: 0, color: "bg-green-400", flavor: "Sweet, crisp, no heat", uses: "Salads, stir-fry, stuffed peppers" },
  { name: "Banana Pepper", shu: 500, color: "bg-yellow-300", flavor: "Mild tang, slight warmth", uses: "Sandwiches, pizza, pickled" },
  { name: "Poblano", shu: 1500, color: "bg-green-600", flavor: "Rich, earthy, mild heat", uses: "Chiles rellenos, mole, roasted" },
  { name: "Jalapeño", shu: 5000, color: "bg-green-500", flavor: "Bright, grassy, moderate heat", uses: "Salsa, nachos, poppers" },
  { name: "Serrano", shu: 15000, color: "bg-green-700", flavor: "Crisp, sharp heat", uses: "Pico de gallo, Thai dishes" },
  { name: "Cayenne", shu: 40000, color: "bg-orange-500", flavor: "Neutral heat, no frills", uses: "Hot sauce, spice blends, seasoning" },
  { name: "Thai Chili", shu: 75000, color: "bg-red-400", flavor: "Fruity, intense heat", uses: "Thai curries, stir-fry, dipping sauces" },
  { name: "Scotch Bonnet", shu: 200000, color: "bg-orange-600", flavor: "Fruity, tropical, extreme heat", uses: "Jerk chicken, Caribbean sauces" },
  { name: "Habanero", shu: 300000, color: "bg-orange-500", flavor: "Fruity, floral, very hot", uses: "Hot sauces, salsas, marinades" },
  { name: "Ghost Pepper", shu: 1000000, color: "bg-red-600", flavor: "Smoky, slow-building, extreme", uses: "Hot sauces, challenges, dried powder" },
  { name: "Trinidad Scorpion", shu: 1500000, color: "bg-red-700", flavor: "Fruity then overwhelming heat", uses: "Extreme hot sauces" },
  { name: "Carolina Reaper", shu: 2200000, color: "bg-red-800", flavor: "Sweet then volcanic heat", uses: "World's hottest challenges, extract sauces" },
  { name: "Pepper X", shu: 2693000, color: "bg-red-900", flavor: "Intense, immediate searing heat", uses: "World record holder, specialty sauces" },
];

const SpiceHeatScale = () => {
  const [search, setSearch] = useState("");
  const [maxShu, setMaxShu] = useState(2700000);

  const filtered = peppers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) && p.shu <= maxShu
  );

  const heatLevel = (shu: number) => {
    if (shu === 0) return "No Heat";
    if (shu <= 2500) return "Mild";
    if (shu <= 30000) return "Medium";
    if (shu <= 100000) return "Hot";
    if (shu <= 500000) return "Very Hot";
    return "Extreme 🔥";
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">The Scoville Heat Unit (SHU) measures the spiciness of peppers. Higher = hotter.</p>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Search peppers</label>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="e.g., jalapeño"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500" />
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Max heat level</label>
          <select value={maxShu} onChange={e => setMaxShu(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500">
            <option value={2700000}>All peppers</option>
            <option value={2500}>Mild only (≤2,500 SHU)</option>
            <option value={30000}>Medium and below (≤30,000)</option>
            <option value={100000}>Hot and below (≤100,000)</option>
            <option value={500000}>Very Hot and below (≤500,000)</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(p => {
          const maxS = 2700000;
          const pct = Math.max(1, (Math.log10(p.shu + 1) / Math.log10(maxS)) * 100);
          return (
            <div key={p.name} className="p-3 rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <span className="text-lg">🌶️</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{p.name}</span>
                    <div className="text-right">
                      <span className="font-bold">{p.shu.toLocaleString()} SHU</span>
                      <span className="text-xs text-gray-400 ml-2">({heatLevel(p.shu)})</span>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-gray-100 rounded-full mt-1">
                    <div className={`h-4 rounded-full ${p.color} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">{p.flavor}</p>
                  <p className="text-xs text-gray-400">Common uses: {p.uses}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No peppers match your search.</p>}
    </div>
  );
};

export default SpiceHeatScale;
