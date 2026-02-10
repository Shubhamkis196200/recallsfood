import { useState, useEffect, useCallback } from "react";

const HandwashingTimer = () => {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(20);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) {
      if (seconds <= 0) { setRunning(false); setDone(true); }
      return;
    }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, seconds]);

  const start = useCallback(() => { setSeconds(20); setDone(false); setRunning(true); }, []);
  const pct = ((20 - seconds) / 20) * 100;

  const steps = [
    "Wet hands with clean running water",
    "Apply soap — cover all surfaces",
    "Rub palms together",
    "Scrub between fingers",
    "Clean under fingernails",
    "Scrub backs of hands",
    "Rinse thoroughly",
  ];

  const currentStep = Math.min(Math.floor((20 - seconds) / 3), steps.length - 1);

  return (
    <div className="space-y-6 text-center">
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle cx="50" cy="50" r="45" fill="none" stroke={done ? "#22c55e" : seconds <= 5 ? "#ef4444" : "#3b82f6"}
            strokeWidth="8" strokeLinecap="round" strokeDasharray={`${pct * 2.827} 282.7`}
            className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold">{done ? "✅" : seconds}</span>
          {!done && running && <span className="text-xs text-gray-500 mt-1">seconds</span>}
          {done && <span className="text-sm text-green-600 font-medium mt-1">Clean!</span>}
        </div>
      </div>

      {running && !done && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-medium text-blue-700">🧼 {steps[currentStep]}</p>
        </div>
      )}

      <button onClick={start}
        className={`px-8 py-3 rounded-xl font-bold text-lg ${done ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white transition-colors`}>
        {running ? "Restart" : done ? "Wash Again" : "Start Timer 🧼"}
      </button>

      <div className="text-left bg-gray-50 rounded-xl p-4 mt-4">
        <h3 className="font-bold text-sm mb-2">Proper Handwashing Steps (CDC)</h3>
        <ol className="space-y-1 text-sm text-gray-600">
          {steps.map((s, i) => (
            <li key={i} className={running && i === currentStep ? "font-bold text-blue-700" : ""}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default HandwashingTimer;
