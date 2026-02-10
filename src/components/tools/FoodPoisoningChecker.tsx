import { useState } from "react";

const questions = [
  { q: "When did symptoms start?", options: ["Within 1-6 hours", "6-24 hours", "1-3 days", "3+ days"] },
  { q: "Main symptoms? (select all)", multi: true, options: ["Nausea/Vomiting", "Diarrhea (watery)", "Diarrhea (bloody)", "Stomach cramps", "Fever", "Headache", "Muscle aches", "Stiff neck"] },
  { q: "What did you eat recently?", multi: true, options: ["Undercooked meat/poultry", "Raw/undercooked eggs", "Unpasteurized dairy", "Raw seafood/shellfish", "Deli meats/hot dogs", "Unwashed produce", "Rice left at room temp", "Canned foods", "Restaurant food"] },
];

const diagnoses = [
  { name: "Staphylococcus aureus", onset: "1-6 hours", symptoms: ["Nausea/Vomiting", "Stomach cramps", "Diarrhea (watery)"], foods: ["Deli meats/hot dogs", "Restaurant food"], severity: "Usually mild, resolves in 1-2 days" },
  { name: "Salmonella", onset: "6-24 hours", symptoms: ["Diarrhea (watery)", "Fever", "Stomach cramps", "Nausea/Vomiting"], foods: ["Undercooked meat/poultry", "Raw/undercooked eggs", "Unwashed produce"], severity: "Moderate — usually resolves in 4-7 days" },
  { name: "E. coli O157:H7", onset: "1-3 days", symptoms: ["Diarrhea (bloody)", "Stomach cramps"], foods: ["Undercooked meat/poultry", "Unwashed produce", "Unpasteurized dairy"], severity: "Serious — seek medical attention if bloody diarrhea" },
  { name: "Listeria", onset: "3+ days", symptoms: ["Fever", "Muscle aches", "Headache", "Stiff neck", "Diarrhea (watery)"], foods: ["Deli meats/hot dogs", "Unpasteurized dairy", "Raw seafood/shellfish"], severity: "Very serious for pregnant women, elderly, immunocompromised" },
  { name: "Norovirus", onset: "6-24 hours", symptoms: ["Nausea/Vomiting", "Diarrhea (watery)", "Stomach cramps"], foods: ["Raw seafood/shellfish", "Restaurant food", "Unwashed produce"], severity: "Usually resolves in 1-3 days" },
  { name: "Bacillus cereus", onset: "1-6 hours", symptoms: ["Nausea/Vomiting", "Diarrhea (watery)"], foods: ["Rice left at room temp"], severity: "Mild, resolves in 24 hours" },
  { name: "Clostridium botulinum", onset: "1-3 days", symptoms: ["Nausea/Vomiting", "Headache", "Muscle aches"], foods: ["Canned foods"], severity: "Medical emergency — seek help immediately" },
];

const FoodPoisoningChecker = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([[], [], []]);
  const [done, setDone] = useState(false);

  const toggle = (option: string) => {
    const curr = [...answers];
    const idx = step;
    if (questions[step].multi) {
      curr[idx] = curr[idx].includes(option) ? curr[idx].filter(o => o !== option) : [...curr[idx], option];
    } else {
      curr[idx] = [option];
    }
    setAnswers(curr);
  };

  const next = () => { if (step < 2) setStep(step + 1); else setDone(true); };
  const reset = () => { setStep(0); setAnswers([[], [], []]); setDone(false); };

  const getResults = () => {
    const [onset, symptoms, foods] = answers;
    return diagnoses
      .map(d => {
        let score = 0;
        if (onset.includes(d.onset)) score += 3;
        score += d.symptoms.filter(s => symptoms.includes(s)).length * 2;
        score += d.foods.filter(f => foods.includes(f)).length * 2;
        return { ...d, score };
      })
      .filter(d => d.score > 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  if (done) {
    const results = getResults();
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Possible Causes</h3>
        {results.length === 0 ? (
          <p className="text-gray-500">Unable to narrow down a cause. Please consult a healthcare provider.</p>
        ) : results.map(r => (
          <div key={r.name} className="p-4 rounded-xl border border-gray-200 bg-white">
            <h4 className="font-bold text-red-600">{r.name}</h4>
            <p className="text-sm text-gray-600 mt-1">Typical onset: {r.onset}</p>
            <p className="text-sm text-gray-600">Severity: {r.severity}</p>
          </div>
        ))}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          <strong>⚠️ This is NOT medical advice.</strong> If you have severe symptoms, bloody diarrhea, high fever, or are in a high-risk group, seek medical attention immediately.
        </div>
        <button onClick={reset} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm">Start Over</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1 mb-4">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-red-500" : "bg-gray-200"}`} />
        ))}
      </div>
      <h3 className="font-bold text-lg">{questions[step].q}</h3>
      <div className="grid sm:grid-cols-2 gap-2">
        {questions[step].options.map(opt => (
          <button key={opt} onClick={() => toggle(opt)}
            className={`p-3 rounded-lg border text-left text-sm transition-all ${answers[step].includes(opt) ? "border-red-500 bg-red-50 text-red-700 font-medium" : "border-gray-200 hover:border-gray-300"}`}>
            {opt}
          </button>
        ))}
      </div>
      <button onClick={next} disabled={answers[step].length === 0}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
        {step < 2 ? "Next" : "Get Results"}
      </button>
    </div>
  );
};

export default FoodPoisoningChecker;
