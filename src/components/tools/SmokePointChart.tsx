const oils = [
  { name: "Flaxseed Oil", smoke: 225, best: "Dressings, finishing", icon: "🫒" },
  { name: "Butter", smoke: 350, best: "Low-heat sautéing, baking", icon: "🧈" },
  { name: "Coconut Oil (Virgin)", smoke: 350, best: "Baking, medium-heat sautéing", icon: "🥥" },
  { name: "Extra Virgin Olive Oil", smoke: 375, best: "Dressings, light sautéing", icon: "🫒" },
  { name: "Sesame Oil", smoke: 410, best: "Asian dishes, finishing", icon: "🫒" },
  { name: "Vegetable Oil", smoke: 400, best: "Frying, baking, all-purpose", icon: "🌻" },
  { name: "Canola Oil", smoke: 400, best: "Frying, baking, all-purpose", icon: "🌼" },
  { name: "Grapeseed Oil", smoke: 420, best: "High-heat sautéing, frying", icon: "🍇" },
  { name: "Peanut Oil", smoke: 450, best: "Deep frying, stir-frying", icon: "🥜" },
  { name: "Sunflower Oil", smoke: 450, best: "Deep frying, high-heat cooking", icon: "🌻" },
  { name: "Avocado Oil", smoke: 520, best: "Very high-heat, grilling, searing", icon: "🥑" },
  { name: "Ghee (Clarified Butter)", smoke: 485, best: "High-heat sautéing, Indian cooking", icon: "🧈" },
  { name: "Light/Refined Olive Oil", smoke: 465, best: "Frying, roasting", icon: "🫒" },
].sort((a, b) => a.smoke - b.smoke);

const SmokePointChart = () => (
  <div className="space-y-4">
    <p className="text-sm text-gray-600">Oils sorted from lowest to highest smoke point. Choose the right oil for your cooking method.</p>
    <div className="space-y-2">
      {oils.map(o => {
        const maxSmoke = 520;
        const pct = (o.smoke / maxSmoke) * 100;
        const color = o.smoke < 350 ? "bg-blue-400" : o.smoke < 400 ? "bg-yellow-400" : o.smoke < 450 ? "bg-orange-400" : "bg-red-400";
        return (
          <div key={o.name} className="flex items-center gap-3">
            <span className="text-lg w-8">{o.icon}</span>
            <div className="flex-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{o.name}</span>
                <span className="font-bold">{o.smoke}°F / {Math.round((o.smoke - 32) * 5 / 9)}°C</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full mt-1">
                <div className={`h-3 rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Best for: {o.best}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default SmokePointChart;
