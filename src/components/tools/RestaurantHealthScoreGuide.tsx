const grades = [
  { grade: "A", range: "90-100", color: "bg-green-500", meaning: "Excellent. Minor or no violations. Low risk.", tip: "Great choice! This restaurant maintains high standards." },
  { grade: "B", range: "80-89", color: "bg-yellow-500", meaning: "Good. Some violations, generally addressed quickly.", tip: "Acceptable. Check if recent re-inspection improved the score." },
  { grade: "C", range: "70-79", color: "bg-orange-500", meaning: "Needs improvement. Multiple violations found.", tip: "Caution. Consider checking recent inspection reports." },
  { grade: "Below C", range: "Below 70", color: "bg-red-500", meaning: "Poor. Critical violations present. May require closure.", tip: "Avoid if possible. Critical violations can pose serious health risks." },
];

const inspectors = [
  "Proper food temperatures (cold ≤41°F, hot ≥135°F)",
  "Employee handwashing compliance",
  "No cross-contamination risks",
  "Pest control (no evidence of rodents or insects)",
  "Clean food prep surfaces and equipment",
  "Proper food storage and labeling",
  "Valid food handler permits",
  "Restroom cleanliness and supplies",
  "Waste disposal and garbage management",
  "Chemical storage (separated from food)",
];

const RestaurantHealthScoreGuide = () => (
  <div className="space-y-6">
    <p className="text-sm text-gray-600">Restaurant health inspection scores vary by jurisdiction, but most use an A-C letter grade or 0-100 point system.</p>

    <div className="space-y-3">
      {grades.map(g => (
        <div key={g.grade} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200">
          <div className={`${g.color} text-white font-bold text-2xl w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
            {g.grade}
          </div>
          <div>
            <p className="font-bold text-gray-900">Score: {g.range}</p>
            <p className="text-sm text-gray-600">{g.meaning}</p>
            <p className="text-xs text-gray-400 mt-1">💡 {g.tip}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
      <h3 className="font-bold mb-3">🔍 What Inspectors Look For</h3>
      <ul className="space-y-2">
        {inspectors.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-blue-500 mt-0.5">•</span> {item}
          </li>
        ))}
      </ul>
    </div>

    <div className="text-xs text-gray-500">
      <strong>How to check scores:</strong> Most cities and counties publish inspection results online. Search "[your city] restaurant health inspection scores" to find your local database.
    </div>
  </div>
);

export default RestaurantHealthScoreGuide;
