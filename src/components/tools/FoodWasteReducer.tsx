import { useState } from "react";

const recipeDB: Record<string, { name: string; ingredients: string[]; time: string }[]> = {
  chicken: [
    { name: "Chicken Stir-Fry", ingredients: ["chicken", "vegetables", "soy sauce", "rice"], time: "20 min" },
    { name: "Chicken Salad", ingredients: ["chicken", "lettuce", "mayo", "celery"], time: "10 min" },
    { name: "Chicken Soup", ingredients: ["chicken", "broth", "vegetables", "noodles"], time: "30 min" },
  ],
  rice: [
    { name: "Fried Rice", ingredients: ["rice", "eggs", "soy sauce", "vegetables"], time: "15 min" },
    { name: "Rice Bowls", ingredients: ["rice", "protein", "vegetables", "sauce"], time: "20 min" },
  ],
  eggs: [
    { name: "Scrambled Eggs", ingredients: ["eggs", "butter", "salt"], time: "5 min" },
    { name: "Frittata", ingredients: ["eggs", "vegetables", "cheese"], time: "20 min" },
    { name: "Egg Fried Rice", ingredients: ["eggs", "rice", "soy sauce"], time: "10 min" },
  ],
  pasta: [
    { name: "Pasta Aglio e Olio", ingredients: ["pasta", "garlic", "olive oil", "chili flakes"], time: "15 min" },
    { name: "Pasta Primavera", ingredients: ["pasta", "vegetables", "olive oil", "parmesan"], time: "20 min" },
  ],
  potatoes: [
    { name: "Baked Potatoes", ingredients: ["potatoes", "butter", "sour cream", "cheese"], time: "45 min" },
    { name: "Potato Soup", ingredients: ["potatoes", "broth", "cream", "bacon"], time: "30 min" },
    { name: "Hash Browns", ingredients: ["potatoes", "oil", "salt"], time: "15 min" },
  ],
  vegetables: [
    { name: "Vegetable Stir-Fry", ingredients: ["vegetables", "soy sauce", "garlic", "oil"], time: "15 min" },
    { name: "Roasted Vegetables", ingredients: ["vegetables", "olive oil", "herbs"], time: "30 min" },
  ],
  bread: [
    { name: "French Toast", ingredients: ["bread", "eggs", "milk", "cinnamon"], time: "10 min" },
    { name: "Bread Pudding", ingredients: ["bread", "eggs", "milk", "sugar", "vanilla"], time: "45 min" },
    { name: "Croutons", ingredients: ["bread", "olive oil", "garlic", "herbs"], time: "15 min" },
  ],
};

const FoodWasteReducer = () => {
  const [input, setInput] = useState("");
  const terms = input.toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
  const matches = terms.flatMap(t =>
    Object.entries(recipeDB)
      .filter(([key]) => key.includes(t) || t.includes(key))
      .flatMap(([, recipes]) => recipes)
  ).filter((r, i, arr) => arr.findIndex(x => x.name === r.name) === i);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">What ingredients do you have? (comma-separated)</label>
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder="e.g., chicken, rice, eggs, bread"
          className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500" />
      </div>

      {terms.length > 0 && matches.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No recipes found. Try: chicken, rice, eggs, pasta, potatoes, vegetables, bread</p>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {matches.map(r => (
          <div key={r.name} className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-900">{r.name}</h3>
            <p className="text-xs text-gray-400 mt-1">⏱️ {r.time}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {r.ingredients.map(ing => (
                <span key={ing} className={`text-xs px-2 py-0.5 rounded-full ${terms.some(t => ing.includes(t)) ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {ing}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodWasteReducer;
