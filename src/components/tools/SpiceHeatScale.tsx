const peppers = [
  { name: "Bell Pepper", shu: 0, color: "bg-green-400" },
  { name: "Banana Pepper", shu: 500, color: "bg-yellow-300" },
  { name: "Poblano", shu: 1500, color: "bg-green-600" },
  { name: "Jalapeño", shu: 5000, color: "bg-green-500" },
  { name: "Serrano", shu: 15000, color: "bg-green-700" },
  { name: "Cayenne", shu: 40000, color: "bg-orange-500" },
  { name: "Thai Chili", shu: 75000, color: "bg-red-400" },
  { name: "Scotch Bonnet", shu: 200000, color: "bg-orange-600" },
  { name: "Habanero", shu: 300000, color: "bg-orange-500" },
  { name: "Ghost Pepper", shu: 1000000, color: "bg-red-600" },
  { name: "Trinidad Scorpion", shu: 1500000, color: "bg-red-700" },
  { name: "Carolina Reaper", shu: 2200000, color: "bg-red-800" },
  { name: "Pepper X", shu: 2693000, color: "bg-red-900" },
];

const SpiceHeatScale = () => (
  <div className="space-y-3">
    <p className="text-sm text-gray-600 mb-4">The Scoville Heat Unit (SHU) measures the spiciness of peppers. Higher = hotter.</p>
    {peppers.map(p => {
      const maxShu = 2700000;
      const pct = Math.max(1, (Math.log10(p.shu + 1) / Math.log10(maxShu)) * 100);
      return (
        <div key={p.name} className="flex items-center gap-3">
          <span className="text-lg">🌶️</span>
          <div className="flex-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{p.name}</span>
              <span className="font-bold">{p.shu.toLocaleString()} SHU</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full mt-1">
              <div className={`h-4 rounded-full ${p.color} transition-all`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default SpiceHeatScale;
