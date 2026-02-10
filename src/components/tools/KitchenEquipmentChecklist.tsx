import { useState } from "react";

const equipment: Record<string, { items: string[] }> = {
  "Essential Cooking": { items: [
    "Chef's knife (8-10 inch)", "Paring knife", "Cutting board (2+)", "Large pot (8+ qt)",
    "Medium saucepan (3 qt)", "Large skillet/fry pan", "Baking sheet (2)", "Wooden spoons",
    "Spatula (silicone)", "Tongs", "Ladle", "Whisk",
  ]},
  "Measuring & Prep": { items: [
    "Measuring cups (dry)", "Measuring cups (liquid)", "Measuring spoons",
    "Mixing bowls (set of 3)", "Colander/strainer", "Can opener", "Vegetable peeler",
    "Box grater", "Kitchen shears",
  ]},
  "Baking": { items: [
    "9x13 baking dish", "Muffin tin", "Cooling rack", "Rolling pin",
    "Pie dish", "Loaf pan", "Parchment paper",
  ]},
  "Storage & Safety": { items: [
    "Food storage containers", "Plastic wrap/foil", "Zip-lock bags", "Food thermometer",
    "Oven mitts (2)", "Kitchen towels", "Paper towels", "Dish soap & sponges",
  ]},
  "Nice to Have": { items: [
    "Dutch oven", "Cast iron skillet", "Blender/food processor", "Stand/hand mixer",
    "Slow cooker", "Instant Pot", "Toaster", "Kitchen scale",
  ]},
};

const KitchenEquipmentChecklist = () => {
  const [checked, setChecked] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("kitchenEquip") || "[]")); } catch { return new Set(); }
  });

  const toggle = (item: string) => {
    const next = new Set(checked);
    next.has(item) ? next.delete(item) : next.add(item);
    setChecked(next);
    localStorage.setItem("kitchenEquip", JSON.stringify([...next]));
  };

  const total = Object.values(equipment).flatMap(c => c.items).length;
  const done = checked.size;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{done}/{total} items</p>
          <div className="w-48 h-2 bg-gray-200 rounded-full mt-1">
            <div className="h-2 bg-zinc-600 rounded-full transition-all" style={{ width: `${(done/total)*100}%` }} />
          </div>
        </div>
        <button onClick={() => { setChecked(new Set()); localStorage.removeItem("kitchenEquip"); }} className="text-xs text-red-500">Reset</button>
      </div>

      {Object.entries(equipment).map(([cat, data]) => (
        <div key={cat}>
          <h3 className="font-bold text-sm text-gray-700 mb-2">{cat}</h3>
          <div className="grid sm:grid-cols-2 gap-1">
            {data.items.map(item => (
              <label key={item} className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm ${checked.has(item) ? "text-gray-400 line-through" : "text-gray-700"}`}>
                <input type="checkbox" checked={checked.has(item)} onChange={() => toggle(item)} className="w-4 h-4 rounded" />
                {item}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KitchenEquipmentChecklist;
