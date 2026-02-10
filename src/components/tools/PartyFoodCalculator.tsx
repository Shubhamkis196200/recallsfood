import { useState } from "react";

const PartyFoodCalculator = () => {
  const [guests, setGuests] = useState(20);
  const [duration, setDuration] = useState<"short"|"medium"|"long">("medium");
  const [type, setType] = useState<"appetizers"|"dinner"|"bbq">("dinner");

  const durFactor = duration === "short" ? 0.8 : duration === "long" ? 1.3 : 1;

  const calc = (base: number) => Math.ceil(base * guests * durFactor);
  const calcLbs = (perPerson: number) => Math.ceil(perPerson * guests * durFactor * 10) / 10;

  const items = type === "appetizers" ? [
    { name: "Appetizer varieties", amount: `${Math.max(4, Math.ceil(guests / 5))} types` },
    { name: "Appetizer pieces total", amount: `${calc(8)} pieces` },
    { name: "Dips", amount: `${Math.ceil(guests / 8)} cups` },
    { name: "Chips/crackers", amount: `${calcLbs(0.25)} lbs` },
    { name: "Cheese", amount: `${calcLbs(0.15)} lbs` },
    { name: "Vegetables", amount: `${calcLbs(0.15)} lbs` },
    { name: "Drinks", amount: `${calc(3)} servings` },
    { name: "Ice", amount: `${calcLbs(1.5)} lbs` },
    { name: "Napkins", amount: `${calc(3)}` },
  ] : type === "bbq" ? [
    { name: "Meat (total)", amount: `${calcLbs(0.5)} lbs` },
    { name: "Hamburger patties", amount: `${calc(1.5)} patties` },
    { name: "Hot dogs", amount: `${calc(1.5)} dogs` },
    { name: "Buns", amount: `${calc(3)} buns` },
    { name: "Coleslaw/salad", amount: `${calcLbs(0.3)} lbs` },
    { name: "Baked beans", amount: `${calcLbs(0.25)} lbs` },
    { name: "Corn on the cob", amount: `${calc(1)} ears` },
    { name: "Condiments", amount: `${Math.ceil(guests / 10)} bottles each` },
    { name: "Drinks", amount: `${calc(3)} servings` },
    { name: "Ice", amount: `${calcLbs(1.5)} lbs` },
  ] : [
    { name: "Main dish (meat)", amount: `${calcLbs(0.5)} lbs` },
    { name: "Side dish 1", amount: `${calcLbs(0.25)} lbs` },
    { name: "Side dish 2", amount: `${calcLbs(0.25)} lbs` },
    { name: "Salad", amount: `${calcLbs(0.15)} lbs` },
    { name: "Bread/rolls", amount: `${calc(1.5)} pieces` },
    { name: "Dessert", amount: `${calc(1)} servings` },
    { name: "Drinks", amount: `${calc(2.5)} servings` },
    { name: "Ice", amount: `${calcLbs(1.5)} lbs` },
    { name: "Plates", amount: `${calc(1.5)}` },
    { name: "Napkins", amount: `${calc(3)}` },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
          <input type="number" min={2} max={200} value={guests} onChange={e => setGuests(+e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Party Type</label>
          <select value={type} onChange={e => setType(e.target.value as any)} className="w-full border rounded-lg px-3 py-2">
            <option value="appetizers">Appetizers/Cocktail</option>
            <option value="dinner">Sit-Down Dinner</option>
            <option value="bbq">BBQ/Cookout</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <select value={duration} onChange={e => setDuration(e.target.value as any)} className="w-full border rounded-lg px-3 py-2">
            <option value="short">1-2 hours</option>
            <option value="medium">3-4 hours</option>
            <option value="long">5+ hours</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {items.map(i => (
          <div key={i.name} className="flex justify-between p-3 rounded-lg border border-gray-200 bg-white">
            <span className="text-sm text-gray-700">{i.name}</span>
            <span className="font-bold text-pink-600 text-sm">{i.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartyFoodCalculator;
