import { useState, useEffect, useCallback } from "react";

interface Timer { id: number; name: string; totalSecs: number; remaining: number; running: boolean }

const CookingTimer = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [name, setName] = useState("");
  const [mins, setMins] = useState(10);

  const add = () => {
    setTimers([...timers, { id: Date.now(), name: name || `Timer ${timers.length + 1}`, totalSecs: mins * 60, remaining: mins * 60, running: false }]);
    setName("");
  };

  const toggle = useCallback((id: number) => {
    setTimers(t => t.map(x => x.id === id ? { ...x, running: !x.running } : x));
  }, []);

  const remove = (id: number) => setTimers(t => t.filter(x => x.id !== id));
  const reset = (id: number) => setTimers(t => t.map(x => x.id === id ? { ...x, remaining: x.totalSecs, running: false } : x));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => prev.map(t => {
        if (!t.running || t.remaining <= 0) return t;
        const next = t.remaining - 1;
        if (next <= 0) {
          try { new Audio("data:audio/wav;base64,UklGRl9vT19teleWQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==").play(); } catch {}
        }
        return { ...t, remaining: Math.max(0, next) };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const pct = (t: Timer) => ((t.totalSecs - t.remaining) / t.totalSecs) * 100;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Timer name"
          className="flex-1 min-w-[150px] border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <input type="number" min={1} max={600} value={mins} onChange={e => setMins(+e.target.value)}
          className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <span className="self-center text-sm text-gray-500">min</span>
        <button onClick={add} className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 text-sm font-medium">Add Timer</button>
      </div>

      {timers.length === 0 && <p className="text-sm text-gray-400 text-center py-8">Add a timer above to get started</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        {timers.map(t => (
          <div key={t.id} className={`p-4 rounded-xl border-2 ${t.remaining === 0 ? "border-red-300 bg-red-50 animate-pulse" : t.running ? "border-violet-300 bg-violet-50" : "border-gray-200 bg-white"}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-sm">{t.name}</h3>
              <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
              <div className={`h-2 rounded-full transition-all ${t.remaining === 0 ? "bg-red-500" : "bg-violet-500"}`} style={{ width: `${pct(t)}%` }} />
            </div>
            <p className={`text-3xl font-mono font-bold text-center ${t.remaining === 0 ? "text-red-600" : ""}`}>
              {t.remaining === 0 ? "⏰ DONE!" : fmt(t.remaining)}
            </p>
            <div className="flex gap-2 mt-3 justify-center">
              <button onClick={() => toggle(t.id)} className={`px-3 py-1 rounded text-xs font-medium ${t.running ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                {t.running ? "Pause" : "Start"}
              </button>
              <button onClick={() => reset(t.id)} className="px-3 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">Reset</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CookingTimer;
