import { useState } from "react";

const oils = [
  { name: "Flaxseed Oil", smoke: 225, best: "Dressings, finishing", icon: "🫒", methods: ["dressing"] },
  { name: "Butter", smoke: 350, best: "Low-heat sautéing, baking", icon: "🧈", methods: ["baking", "sauteing"] },
  { name: "Coconut Oil (Virgin)", smoke: 350, best: "Baking, medium-heat sautéing", icon: "🥥", methods: ["baking", "sauteing"] },
  { name: "Extra Virgin Olive Oil", smoke: 375, best: "Dressings, light sautéing", icon: "🫒", methods: ["dressing", "sauteing"] },
  { name: "Sesame Oil", smoke: 410, best: "Asian dishes, finishing", icon: "🫒", methods: ["sauteing", "stir-frying"] },
  { name: "Vegetable Oil", smoke: 400, best: "Frying, baking, all-purpose", icon: "🌻", methods: ["frying", "baking", "sauteing"] },
  { name: "Canola Oil", smoke: 400, best: "Frying, baking, all-purpose", icon: "🌼", methods: ["frying", "baking", "sauteing"] },
  { name: "Grapeseed Oil", smoke: 420, best: "High-heat sautéing, frying", icon: "🍇", methods: ["frying", "sauteing"] },
  { name: "Peanut Oil", smoke: 450, best: "Deep frying, stir-frying", icon: "🥜", methods: ["deep-frying", "stir-frying", "frying"] },
  { name: "Sunflower Oil", smoke: 450, best: "Deep frying, high-heat cooking", icon: "🌻", methods: ["deep-frying", "frying"] },
  { name: "Light/Refined Olive Oil", smoke: 465, best: "Frying, roasting", icon: "🫒", methods: ["frying", "roasting"] },
  { name: "Ghee (Clarified Butter)", smoke: 485, best: "High-heat sautéing, Indian cooking", icon: "🧈", methods: ["sauteing", "frying", "roasting"] },
  { name: "Avocado Oil", smoke: 520, best: "Very high-heat, grilling, searing", icon: "🥑", methods: ["grilling", "searing", "deep-frying", "frying", "roasting"] },
].sort((a, b) => a.smoke - b.smoke);

const cookingMethods = [
  { id: "all", label: "All Oils", minTemp: 0 },
  { id: "dressing", label: "Dressings / No Heat", minTemp: 0 },
  { id: "baking", label: "Baking (325-375°F)", minTemp: 325 },
  { id: "sauteing", label: "Sautéing (350-400°F)", minTemp: 350 },
  { id: "stir-frying", label: "Stir-Frying (400-450°F)", minTemp: 400 },
  { id: "frying", label: "Pan Frying (375-450°F)", minTemp: 375 },
  { id: "deep-frying", label: "Deep Frying (350-375°F)", minTemp: 350 },
  { id: "roasting", label: "Roasting (400-475°F)", minTemp: 400 },
  { id: "grilling", label: "Grilling / Searing (450°F+)", minTemp: 450 },
];

const SmokePointChart = () => {
  const [method, setMethod] = useState("all");

  const filtered = method === "all" ? oils :
    oils.filter(o => o.methods.includes(method));

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">Choose your cooking method to see which oils are best suited. Oils sorted by smoke point.</p>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">What are you cooking?</label>
        <div className="flex flex-wrap gap-2">
          {cookingMethods.map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${method === m.id ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(o => {
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

      {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No oils matched. Try a different cooking method.</p>}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <strong>Safety tip:</strong> When oil reaches its smoke point, it begins to break down and release harmful compounds. If you see smoke, turn down the heat immediately. Never leave hot oil unattended.
      </div>
    </div>
  );
};

export default SmokePointChart;
