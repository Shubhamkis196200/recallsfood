import { useState } from "react";

const CalorieCalculator = () => {
  const [gender, setGender] = useState<"male"|"female">("male");
  const [age, setAge] = useState(30);
  const [weight, setWeight] = useState(170);
  const [height, setHeight] = useState(70);
  const [activity, setActivity] = useState(1.55);

  // Mifflin-St Jeor
  const weightKg = weight * 0.453592;
  const heightCm = height * 2.54;
  const bmr = gender === "male"
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const tdee = Math.round(bmr * activity);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value as any)} className="w-full border rounded-lg px-3 py-2">
            <option value="male">Male</option><option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input type="number" min={15} max={100} value={age} onChange={e => setAge(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
          <input type="number" min={80} max={500} value={weight} onChange={e => setWeight(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (inches)</label>
          <input type="number" min={48} max={96} value={height} onChange={e => setHeight(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
        <select value={activity} onChange={e => setActivity(+e.target.value)} className="w-full border rounded-lg px-3 py-2">
          <option value={1.2}>Sedentary (office job, little exercise)</option>
          <option value={1.375}>Lightly Active (1-3 days/week)</option>
          <option value={1.55}>Moderately Active (3-5 days/week)</option>
          <option value={1.725}>Very Active (6-7 days/week)</option>
          <option value={1.9}>Extremely Active (physical job + exercise)</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50 text-center">
          <p className="text-xs text-gray-500">🔻 Lose Weight</p>
          <p className="text-2xl font-bold text-red-600">{tdee - 500}</p>
          <p className="text-xs text-gray-400">cal/day (-500)</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50 text-center">
          <p className="text-xs text-gray-500">⚖️ Maintain</p>
          <p className="text-2xl font-bold text-green-600">{tdee}</p>
          <p className="text-xs text-gray-400">cal/day (TDEE)</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50 text-center">
          <p className="text-xs text-gray-500">🔺 Gain Weight</p>
          <p className="text-2xl font-bold text-blue-600">{tdee + 500}</p>
          <p className="text-xs text-gray-400">cal/day (+500)</p>
        </div>
      </div>

      <p className="text-xs text-gray-500">BMR: {Math.round(bmr)} cal/day • Using Mifflin-St Jeor equation</p>
    </div>
  );
};

export default CalorieCalculator;
