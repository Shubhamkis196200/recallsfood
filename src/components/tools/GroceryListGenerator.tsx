import { useState } from "react";

const categories = ["Produce", "Dairy & Eggs", "Meat & Seafood", "Bakery", "Frozen", "Pantry", "Beverages", "Snacks", "Other"];

interface Item { id: number; name: string; category: string; checked: boolean }

const GroceryListGenerator = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [cat, setCat] = useState("Produce");

  const add = () => {
    if (!name.trim()) return;
    setItems([...items, { id: Date.now(), name: name.trim(), category: cat, checked: false }]);
    setName("");
  };

  const toggle = (id: number) => setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const remove = (id: number) => setItems(items.filter(i => i.id !== id));
  const clearChecked = () => setItems(items.filter(i => !i.checked));

  const grouped = categories.map(c => ({ cat: c, items: items.filter(i => i.category === c) })).filter(g => g.items.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Item name"
          className="flex-1 min-w-[150px] border rounded-lg px-3 py-2 text-sm" onKeyDown={e => e.key === "Enter" && add()} />
        <select value={cat} onChange={e => setCat(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={add} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Add</button>
      </div>

      {items.length > 0 && (
        <div className="flex justify-between text-xs text-gray-400">
          <span>{items.filter(i => i.checked).length}/{items.length} items checked</span>
          <button onClick={clearChecked} className="text-red-500 hover:text-red-700">Remove checked</button>
        </div>
      )}

      {grouped.map(g => (
        <div key={g.cat}>
          <h3 className="font-bold text-sm text-gray-700 mb-2">{g.cat}</h3>
          <div className="space-y-1">
            {g.items.map(item => (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                <input type="checkbox" checked={item.checked} onChange={() => toggle(item.id)} className="w-4 h-4 rounded" />
                <span className={`flex-1 text-sm ${item.checked ? "line-through text-gray-400" : ""}`}>{item.name}</span>
                <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-red-500 text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {items.length === 0 && <p className="text-sm text-gray-400 text-center py-8">Your grocery list is empty. Add items above!</p>}
    </div>
  );
};

export default GroceryListGenerator;
