import { useState } from "react";

const questions = [
  { symptom: "Fatigue / Tiredness", deficiencies: ["Iron", "Vitamin D", "B12", "Folate"] },
  { symptom: "Brittle nails / Hair loss", deficiencies: ["Iron", "Biotin", "Zinc"] },
  { symptom: "Muscle cramps / Weakness", deficiencies: ["Magnesium", "Potassium", "Calcium", "Vitamin D"] },
  { symptom: "Poor wound healing", deficiencies: ["Vitamin C", "Zinc", "Protein"] },
  { symptom: "Mood changes / Depression", deficiencies: ["Vitamin D", "B12", "Omega-3", "Folate"] },
  { symptom: "Bone pain / Weakness", deficiencies: ["Vitamin D", "Calcium"] },
  { symptom: "Mouth sores / Cracked lips", deficiencies: ["B2 (Riboflavin)", "B3 (Niacin)", "Iron"] },
  { symptom: "Night blindness / Dry eyes", deficiencies: ["Vitamin A"] },
  { symptom: "Tingling/numbness in hands/feet", deficiencies: ["B12", "B6", "Folate"] },
  { symptom: "Frequent infections", deficiencies: ["Vitamin C", "Vitamin D", "Zinc"] },
  { symptom: "Bleeding gums", deficiencies: ["Vitamin C"] },
  { symptom: "Pale skin", deficiencies: ["Iron", "B12", "Folate"] },
];

const VitaminDeficiencyChecker = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (s: string) => {
    const next = new Set(selected);
    next.has(s) ? next.delete(s) : next.add(s);
    setSelected(next);
  };

  const scores: Record<string, number> = {};
  selected.forEach(s => {
    const q = questions.find(qq => qq.symptom === s);
    q?.deficiencies.forEach(d => { scores[d] = (scores[d] || 0) + 1; });
  });
  const results = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Select all symptoms you're experiencing:</p>
      <div className="grid sm:grid-cols-2 gap-2">
        {questions.map(q => (
          <button key={q.symptom} onClick={() => toggle(q.symptom)}
            className={`p-3 rounded-lg border text-left text-sm transition-all ${selected.has(q.symptom) ? "border-purple-500 bg-purple-50 font-medium" : "border-gray-200 hover:border-gray-300"}`}>
            {q.symptom}
          </button>
        ))}
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold">Possible Deficiencies</h3>
          {results.map(([nutrient, score]) => (
            <div key={nutrient} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{nutrient}</span>
                  <span className="text-gray-400">{score} matching symptoms</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${(score / selected.size) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700">
            ⚠️ This is NOT medical advice. Please consult a healthcare provider for proper diagnosis and blood work.
          </div>
        </div>
      )}
    </div>
  );
};

export default VitaminDeficiencyChecker;
