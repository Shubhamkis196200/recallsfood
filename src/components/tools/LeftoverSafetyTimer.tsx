import { useState, useEffect } from "react";

interface Leftover { id: number; name: string; storedAt: number; maxDays: number }

const LeftoverSafetyTimer = () => {
  const [items, setItems] = useState<Leftover[]>(() => {
    try { return JSON.parse(localStorage.getItem("leftoverTimers") || "[]"); } catch { return []; }
  });
  const [name, setName] = useState("");
  const [maxDays, setMaxDays] = useState(4);
  const [now, setNow] = useState(Date.now());

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(t); }, []);
  useEffect(() => { localStorage.setItem("leftoverTimers", JSON.stringify(items)); }, [items]);

  const add = () => {
    if (!name.trim()) return;
    setItems([...items, { id: Date.now(), name: name.trim(), storedAt: Date.now(), maxDays }]);
    setName("");
  };

  const remove = (id: number) => setItems(items.filter(i => i.id !== id));

  const hoursLeft = (item: Leftover) => {
    const elapsed = (now - item.storedAt) / (1000 * 60 * 60);
    return item.maxDays * 24 - elapsed;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Leftover name (e.g., Chicken soup)"
          className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500" onKeyDown={e => e.key === "Enter" && add()} />
        <select value={maxDays} onChange={e => setMaxDays(+e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2">
          <option value={2}>2 days max</option>
          <option value={3}>3 days max</option>
          <option value={4}>4 days max</option>
          <option value={5}>5 days max</option>
          <option value={7}>7 days max</option>
        </select>
        <button onClick={add} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium">Add</button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No leftovers being tracked. Add one above!</p>
      ) : (
        <div className="space-y-3">
          {items.map(item => {
            const hrs = hoursLeft(item);
            const expired = hrs <= 0;
            const warning = hrs > 0 && hrs < 24;
            return (
              <div key={item.id} className={`p-4 rounded-xl border-2 flex items-center justify-between ${expired ? "border-red-300 bg-red-50" : warning ? "border-yellow-300 bg-yellow-50" : "border-green-200 bg-green-50"}`}>
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-500">Stored: {new Date(item.storedAt).toLocaleString()}</p>
                  <p className={`text-sm font-medium mt-1 ${expired ? "text-red-600" : warning ? "text-yellow-700" : "text-green-600"}`}>
                    {expired ? "⚠️ DISCARD — Past safe time!" : `✅ ${Math.floor(hrs)}h ${Math.round((hrs % 1) * 60)}m remaining`}
                  </p>
                </div>
                <button onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-500 text-lg">✕</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeftoverSafetyTimer;
