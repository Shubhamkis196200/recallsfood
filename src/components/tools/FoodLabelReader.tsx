import { useState } from "react";

const labelTerms: Record<string, { meaning: string; tip: string }> = {
  "Best By / Best Before": { meaning: "Suggests when the product will be at its best quality/flavor.", tip: "NOT a safety date. Food is usually safe well past this date if properly stored." },
  "Use By": { meaning: "The last date recommended for peak quality. Set by the manufacturer.", tip: "For most products, this is about quality, not safety. Exception: infant formula — the only product where 'use by' is federally regulated." },
  "Sell By": { meaning: "Tells the store how long to display the product for sale.", tip: "NOT an expiration date. Food is typically safe for days to weeks past this date." },
  "Freeze By": { meaning: "Date by which you should freeze the product to maintain quality.", tip: "Freeze before this date for best results. Food frozen after may still be safe but quality may decline." },
  "Organic": { meaning: "Made with at least 95% organic ingredients, certified by USDA.", tip: "Organic doesn't mean pesticide-free — it means no synthetic pesticides." },
  "Natural / All Natural": { meaning: "No artificial ingredients or added color; minimally processed.", tip: "Loosely regulated term. Doesn't mean organic, non-GMO, or hormone-free." },
  "No Added Sugar": { meaning: "No sugar or sweetener added during processing.", tip: "May still contain natural sugars. Check total sugar on nutrition label." },
  "Low Sodium": { meaning: "140mg or less sodium per serving.", tip: "Compare with 'reduced sodium' which just means 25% less than the original version." },
  "Trans Fat Free": { meaning: "Less than 0.5g trans fat per serving.", tip: "Can still contain small amounts! Check ingredients for 'partially hydrogenated' oils." },
  "Serving Size": { meaning: "Standardized amount used for nutrition info. NOT a recommended amount.", tip: "Always check servings per container. A single bottle might be 2.5 servings!" },
  "% Daily Value": { meaning: "How much a nutrient contributes to a 2,000-calorie daily diet.", tip: "5% DV or less = low. 20% DV or more = high." },
};

const FoodLabelReader = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Click on any label term to learn what it really means:</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {Object.entries(labelTerms).map(([term, info]) => (
          <button key={term} onClick={() => setSelected(selected === term ? null : term)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${selected === term ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
            <h3 className="font-bold text-sm">{term}</h3>
            {selected === term && (
              <div className="mt-3 space-y-2">
                <p className="text-sm text-gray-700"><strong>Means:</strong> {info.meaning}</p>
                <p className="text-sm text-indigo-700">💡 {info.tip}</p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FoodLabelReader;
