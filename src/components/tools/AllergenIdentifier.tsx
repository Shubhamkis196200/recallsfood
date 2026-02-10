import { useState } from "react";

const allergenDB: Record<string, { allergens: string[]; notes: string }> = {
  "bread": { allergens: ["Wheat/Gluten", "Eggs", "Milk"], notes: "Most breads contain wheat. Check labels for egg and dairy." },
  "pasta": { allergens: ["Wheat/Gluten", "Eggs"], notes: "Traditional pasta contains wheat and eggs. Rice/corn pasta available as alternatives." },
  "chocolate": { allergens: ["Milk", "Soy", "Tree Nuts", "Wheat"], notes: "Dark chocolate may still contain milk traces. Often processed on shared equipment with nuts." },
  "peanut butter": { allergens: ["Peanuts"], notes: "Major allergen. May also contain tree nut traces from shared facilities." },
  "ice cream": { allergens: ["Milk", "Eggs", "Soy", "Tree Nuts", "Wheat"], notes: "Contains dairy. Many flavors include nuts, cookies, or other allergens." },
  "soy sauce": { allergens: ["Wheat/Gluten", "Soy"], notes: "Contains both soy and wheat. Tamari is a wheat-free alternative." },
  "cheese": { allergens: ["Milk"], notes: "Contains dairy proteins (casein, whey). Some aged cheeses are lower in lactose." },
  "cookies": { allergens: ["Wheat/Gluten", "Eggs", "Milk", "Soy"], notes: "Typically contain multiple allergens. May contain tree nuts or peanuts." },
  "cake": { allergens: ["Wheat/Gluten", "Eggs", "Milk"], notes: "Contains wheat flour, eggs, and butter/milk." },
  "pizza": { allergens: ["Wheat/Gluten", "Milk", "Soy"], notes: "Crust has wheat. Cheese has dairy. Some sauces contain soy." },
  "cereal": { allergens: ["Wheat/Gluten", "Milk"], notes: "Many cereals contain wheat. Often consumed with milk." },
  "salad dressing": { allergens: ["Eggs", "Soy", "Fish"], notes: "Caesar dressing contains eggs and anchovies. Many contain soy oil." },
  "fish sticks": { allergens: ["Fish", "Wheat/Gluten", "Eggs"], notes: "Contains fish, wheat breading, and possibly eggs in batter." },
  "shrimp": { allergens: ["Shellfish"], notes: "Major allergen. Crustacean shellfish allergy is one of the most severe." },
  "tofu": { allergens: ["Soy"], notes: "Made from soybeans." },
  "hummus": { allergens: ["Sesame"], notes: "Contains sesame (tahini). Sesame is now a recognized major allergen." },
};

const big9 = ["Milk", "Eggs", "Peanuts", "Tree Nuts", "Wheat/Gluten", "Soy", "Fish", "Shellfish", "Sesame"];

const AllergenIdentifier = () => {
  const [search, setSearch] = useState("");
  const term = search.toLowerCase().trim();
  const match = Object.entries(allergenDB).find(([key]) => key.includes(term) || term.includes(key));

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Search a food or product</label>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="e.g., bread, chocolate, soy sauce..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500" />
      </div>

      {term && match && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 capitalize text-lg">{match[0]}</h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {match[1].allergens.map(a => (
              <span key={a} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">⚠️ {a}</span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">{match[1].notes}</p>
        </div>
      )}

      {term && !match && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
          No allergen data found for "{search}". This doesn't mean it's allergen-free — always check the product label.
        </div>
      )}

      <div>
        <h3 className="font-bold text-gray-900 mb-3">The Big 9 Allergens (FDA)</h3>
        <div className="grid grid-cols-3 gap-2">
          {big9.map(a => (
            <div key={a} className="bg-gray-100 rounded-lg p-3 text-center text-sm font-medium text-gray-700">{a}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllergenIdentifier;
