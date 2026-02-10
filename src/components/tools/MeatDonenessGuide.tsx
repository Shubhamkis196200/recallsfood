const doneness = [
  { level: "Rare", tempF: 125, color: "bg-red-600", desc: "Cool red center. Very soft to touch.", meats: ["Beef steaks", "Lamb chops"] },
  { level: "Medium Rare", tempF: 135, color: "bg-red-500", desc: "Warm red center. Yields gently to pressure.", meats: ["Beef steaks", "Lamb chops", "Venison"] },
  { level: "Medium", tempF: 145, color: "bg-pink-500", desc: "Warm pink center. Yields to pressure.", meats: ["Beef", "Lamb", "Pork", "Veal"] },
  { level: "Medium Well", tempF: 150, color: "bg-pink-300", desc: "Slight pink center. Firm to touch.", meats: ["Beef", "Pork", "Lamb"] },
  { level: "Well Done", tempF: 160, color: "bg-gray-400", desc: "No pink. Firm throughout.", meats: ["Beef", "Pork", "Lamb", "Ground meats"] },
];

const MeatDonenessGuide = () => (
  <div className="space-y-4">
    {doneness.map(d => (
      <div key={d.level} className="flex items-stretch gap-4 p-4 rounded-xl border border-gray-200 bg-white">
        <div className={`w-16 h-16 ${d.color} rounded-lg flex-shrink-0 flex items-center justify-center`}>
          <span className="text-white text-xs font-bold text-center">{d.tempF}°F</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{d.level}</h3>
          <p className="text-sm text-gray-500">{d.tempF}°F / {Math.round((d.tempF - 32) * 5 / 9)}°C</p>
          <p className="text-sm text-gray-600 mt-1">{d.desc}</p>
          <p className="text-xs text-gray-400 mt-1">Best for: {d.meats.join(", ")}</p>
        </div>
      </div>
    ))}

    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
      <strong>USDA Minimum:</strong> The USDA recommends all whole cuts of beef, pork, lamb, and veal reach 145°F with a 3-minute rest. Ground meats should reach 160°F. All poultry should reach 165°F.
    </div>
  </div>
);

export default MeatDonenessGuide;
