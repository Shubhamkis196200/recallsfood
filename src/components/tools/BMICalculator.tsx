import { useState } from "react";

const BMICalculator = () => {
  const [weight, setWeight] = useState(170);
  const [height, setHeight] = useState(70);
  const bmi = (weight / (height * height)) * 703;
  const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const color = bmi < 18.5 ? "text-blue-600" : bmi < 25 ? "text-green-600" : bmi < 30 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
          <input type="number" min={50} max={500} value={weight} onChange={e => setWeight(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (inches)</label>
          <input type="number" min={36} max={96} value={height} onChange={e => setHeight(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          <p className="text-xs text-gray-400">{Math.floor(height/12)}'{height%12}"</p>
        </div>
      </div>

      <div className="text-center p-6 rounded-xl border-2 border-gray-200">
        <p className="text-sm text-gray-500">Your BMI</p>
        <p className={`text-5xl font-bold ${color}`}>{bmi.toFixed(1)}</p>
        <p className={`text-lg font-medium ${color} mt-1`}>{category}</p>
      </div>

      <div className="grid grid-cols-4 gap-1 text-xs text-center">
        <div className="bg-blue-100 p-2 rounded-l-lg"><strong>Underweight</strong><br/>&lt;18.5</div>
        <div className="bg-green-100 p-2"><strong>Normal</strong><br/>18.5–24.9</div>
        <div className="bg-yellow-100 p-2"><strong>Overweight</strong><br/>25–29.9</div>
        <div className="bg-red-100 p-2 rounded-r-lg"><strong>Obese</strong><br/>30+</div>
      </div>

      <p className="text-xs text-gray-500">BMI is a screening tool, not a diagnostic measure. It doesn't account for muscle mass, bone density, or overall body composition. Consult your healthcare provider.</p>
    </div>
  );
};

export default BMICalculator;
