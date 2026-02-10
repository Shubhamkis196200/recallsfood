import { useState } from "react";

const subs: Record<string, { alternatives: { name: string; amount: string; notes: string }[] }> = {
  "Eggs (1 egg)": { alternatives: [
    { name: "Flax egg", amount: "1 tbsp ground flax + 3 tbsp water", notes: "Let sit 5 min. Good for baking." },
    { name: "Chia egg", amount: "1 tbsp chia seeds + 3 tbsp water", notes: "Let sit 5 min. Slight crunch." },
    { name: "Mashed banana", amount: "¼ cup", notes: "Adds sweetness. Best for quick breads/muffins." },
    { name: "Applesauce", amount: "¼ cup", notes: "Adds moisture. Reduce other liquids slightly." },
    { name: "Silken tofu", amount: "¼ cup blended", notes: "Neutral flavor. Good for dense baking." },
  ]},
  "Butter (1 cup)": { alternatives: [
    { name: "Coconut oil", amount: "1 cup", notes: "Solid at room temp. Great for baking." },
    { name: "Olive oil", amount: "¾ cup", notes: "Best for savory dishes." },
    { name: "Applesauce", amount: "½ cup", notes: "Reduces fat. Best for sweet baking." },
    { name: "Greek yogurt", amount: "½ cup", notes: "Adds protein. Good for muffins/cakes." },
    { name: "Avocado", amount: "1 cup mashed", notes: "Creamy texture. May tint color green." },
  ]},
  "Milk (1 cup)": { alternatives: [
    { name: "Oat milk", amount: "1 cup", notes: "Creamy, neutral. Best overall substitute." },
    { name: "Almond milk", amount: "1 cup", notes: "Lighter, slightly nutty." },
    { name: "Soy milk", amount: "1 cup", notes: "Closest in protein content." },
    { name: "Coconut milk", amount: "1 cup", notes: "Rich, slight coconut flavor." },
    { name: "Water + 1 tbsp butter", amount: "1 cup", notes: "In a pinch for cooking." },
  ]},
  "All-Purpose Flour (1 cup)": { alternatives: [
    { name: "Almond flour", amount: "1 cup", notes: "Gluten-free. Denser, moister results." },
    { name: "Oat flour", amount: "1 cup", notes: "Blend oats until fine. Slightly sweet." },
    { name: "Coconut flour", amount: "⅓ cup + extra liquid", notes: "Very absorbent. Add more eggs/liquid." },
    { name: "GF flour blend", amount: "1 cup", notes: "Cup-for-cup blends work best." },
  ]},
  "Heavy Cream (1 cup)": { alternatives: [
    { name: "Coconut cream", amount: "1 cup", notes: "Full-fat coconut milk, chilled." },
    { name: "Cashew cream", amount: "1 cup soaked cashews blended", notes: "Soak 4hrs, blend with ½ cup water." },
    { name: "Evaporated milk", amount: "1 cup", notes: "Lower fat but similar richness." },
  ]},
  "Sugar (1 cup)": { alternatives: [
    { name: "Honey", amount: "¾ cup", notes: "Reduce liquid by 2 tbsp. Lower oven by 25°F." },
    { name: "Maple syrup", amount: "¾ cup", notes: "Reduce liquid by 3 tbsp." },
    { name: "Coconut sugar", amount: "1 cup", notes: "1:1 swap. Deeper, caramel flavor." },
  ]},
};

const SubstitutionFinder = () => {
  const [selected, setSelected] = useState("Eggs (1 egg)");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">What do you need to replace?</label>
        <select value={selected} onChange={e => setSelected(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-lime-500">
          {Object.keys(subs).map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {subs[selected].alternatives.map(a => (
          <div key={a.name} className="p-4 rounded-xl border border-gray-200 bg-white hover:border-lime-300 transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gray-900">{a.name}</h3>
              <span className="text-sm font-mono bg-lime-100 text-lime-700 px-2 py-0.5 rounded">{a.amount}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{a.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubstitutionFinder;
