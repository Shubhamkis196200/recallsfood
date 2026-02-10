import { useState, useEffect } from "react";

interface PantryItem { id: number; name: string; quantity: string; expiry: string; category: string }

const PantryInventoryTracker = () => {
  const [items, setItems] = useState<PantryItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("pantryItems") || "[]"); } catch { return []; }
  });
  const [name, setName] = useState("");
  const [qty, setQty] = useState("1");
  const [expiry, setExpiry] = useState("");
  const [cat, setCat] = useState("Pantry");

  useEffect(() => { localStorage.setItem("pantryItems", JSON.stringify(items)); }, [items]);

  const add = () => {
    if (!name.trim()) return;
    setItems([...items, { id: Date.now(), name: name.trim(), quantity: qty, expiry, category: cat }]);
    setName(""); setQty("1"); setExpiry("");
  };

  const remove = (id: number) => setItems(items.filter(i => i.id !== id));

  const daysUntil = (date: string) => {
    if (!date) return null;
    return Math.ceil((new Date(date).getTime() - Date.now()) / (1000*60*60*24));
  };

  const sorted = [...items].sort((a, b) => {
    const da = daysUntil(a.expiry); const db = daysUntil(b.expiry);
    if (da === null) return 1; if (db === null) return -1;
    return da - db;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Item name"
          className="border rounded-lg px-3 py-2 text-sm" onKeyDown={e => e.key === "Enter" && add()} />
        <input type="text" value={qty} onChange={e => setQty(e.target.value)} placeholder="Qty"
          className="border rounded-lg px-3 py-2 text-sm" />
        <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm" />
        <button onClick={add} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Add</button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Your pantry is empty. Add items above!</p>
      ) : (
        <div className="space-y-2">
          {sorted.map(item => {
            const days = daysUntil(item.expiry);
            const expired = days !== null && days < 0;
            const warning = days !== null && days >= 0 && days < 7;
            return (
              <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border ${expired ? "border-red-300 bg-red-50" : warning ? "border-yellow-300 bg-yellow-50" : "border-gray-200"}`}>
                <div>
                  <span className="font-medium text-sm">{item.name}</span>
                  <span className="text-xs text-gray-400 ml-2">×{item.quantity}</span>
                  {days !== null && (
                    <span className={`text-xs ml-2 ${expired ? "text-red-600 font-bold" : warning ? "text-yellow-600" : "text-gray-400"}`}>
                      {expired ? `Expired ${Math.abs(days)}d ago` : `${days}d left`}
                    </span>
                  )}
                </div>
                <button onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-500">✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PantryInventoryTracker;
