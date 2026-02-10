import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import { getToolBySlug, getToolById, tools } from "@/data/tools";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { lazy, Suspense } from "react";

// Lazy load all tool components
const toolComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  "food-expiration-date-calculator": lazy(() => import("@/components/tools/FoodExpirationCalculator")),
  "fridge-temperature-guide": lazy(() => import("@/components/tools/FridgeTemperatureGuide")),
  "cooking-temperature-chart": lazy(() => import("@/components/tools/CookingTemperatureChart")),
  "food-storage-time-guide": lazy(() => import("@/components/tools/FoodStorageTimeGuide")),
  "cross-contamination-risk-checker": lazy(() => import("@/components/tools/CrossContaminationChecker")),
  "allergen-identifier": lazy(() => import("@/components/tools/AllergenIdentifier")),
  "food-recall-search": lazy(() => import("@/components/tools/FoodRecallSearch")),
  "defrost-time-calculator": lazy(() => import("@/components/tools/DefrostTimeCalculator")),
  "leftover-safety-timer": lazy(() => import("@/components/tools/LeftoverSafetyTimer")),
  "food-poisoning-symptom-checker": lazy(() => import("@/components/tools/FoodPoisoningChecker")),
  "safe-canning-calculator": lazy(() => import("@/components/tools/SafeCanningCalculator")),
  "freezer-burn-identifier": lazy(() => import("@/components/tools/FreezerBurnIdentifier")),
  "food-label-reader": lazy(() => import("@/components/tools/FoodLabelReader")),
  "handwashing-timer": lazy(() => import("@/components/tools/HandwashingTimer")),
  "kitchen-sanitization-checklist": lazy(() => import("@/components/tools/KitchenSanitizationChecklist")),
  "unit-converter": lazy(() => import("@/components/tools/UnitConverter")),
  "recipe-scaler": lazy(() => import("@/components/tools/RecipeScaler")),
  "serving-size-calculator": lazy(() => import("@/components/tools/ServingSizeCalculator")),
  "oven-temperature-converter": lazy(() => import("@/components/tools/OvenTemperatureConverter")),
  "cooking-timer": lazy(() => import("@/components/tools/CookingTimer")),
  "meat-doneness-guide": lazy(() => import("@/components/tools/MeatDonenessGuide")),
  "substitution-finder": lazy(() => import("@/components/tools/SubstitutionFinder")),
  "baking-altitude-adjuster": lazy(() => import("@/components/tools/BakingAltitudeAdjuster")),
  "pan-size-converter": lazy(() => import("@/components/tools/PanSizeConverter")),
  "smoke-point-chart": lazy(() => import("@/components/tools/SmokePointChart")),
  "spice-heat-scale": lazy(() => import("@/components/tools/SpiceHeatScale")),
  "bread-proofing-calculator": lazy(() => import("@/components/tools/BreadProofingCalculator")),
  "pasta-cooking-calculator": lazy(() => import("@/components/tools/PastaCookingCalculator")),
  "rice-water-ratio-calculator": lazy(() => import("@/components/tools/RiceWaterRatioCalculator")),
  "egg-freshness-tester": lazy(() => import("@/components/tools/EggFreshnessTester")),
  "calorie-calculator": lazy(() => import("@/components/tools/CalorieCalculator")),
  "bmi-calculator": lazy(() => import("@/components/tools/BMICalculator")),
  "water-intake-calculator": lazy(() => import("@/components/tools/WaterIntakeCalculator")),
  "macro-calculator": lazy(() => import("@/components/tools/MacroCalculator")),
  "meal-prep-cost-calculator": lazy(() => import("@/components/tools/MealPrepCostCalculator")),
  "caffeine-calculator": lazy(() => import("@/components/tools/CaffeineCalculator")),
  "sugar-intake-tracker": lazy(() => import("@/components/tools/SugarIntakeTracker")),
  "sodium-calculator": lazy(() => import("@/components/tools/SodiumCalculator")),
  "fiber-intake-calculator": lazy(() => import("@/components/tools/FiberIntakeCalculator")),
  "vitamin-deficiency-checker": lazy(() => import("@/components/tools/VitaminDeficiencyChecker")),
  "grocery-list-generator": lazy(() => import("@/components/tools/GroceryListGenerator")),
  "pantry-inventory-tracker": lazy(() => import("@/components/tools/PantryInventoryTracker")),
  "meal-planner": lazy(() => import("@/components/tools/MealPlanner")),
  "food-budget-calculator": lazy(() => import("@/components/tools/FoodBudgetCalculator")),
  "restaurant-health-score-lookup": lazy(() => import("@/components/tools/RestaurantHealthScoreGuide")),
  "seasonal-produce-calendar": lazy(() => import("@/components/tools/SeasonalProduceCalendar")),
  "food-waste-reducer": lazy(() => import("@/components/tools/FoodWasteReducer")),
  "kitchen-equipment-checklist": lazy(() => import("@/components/tools/KitchenEquipmentChecklist")),
  "party-food-calculator": lazy(() => import("@/components/tools/PartyFoodCalculator")),
  "bbq-planner": lazy(() => import("@/components/tools/BBQPlanner")),
};

const ToolPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = slug ? getToolBySlug(slug) : undefined;

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-gray-500 mb-6">The tool you're looking for doesn't exist.</p>
          <Link to="/tools" className="text-red-600 hover:underline">Browse all tools →</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const ToolComponent = slug ? toolComponents[slug] : undefined;
  const relatedTools = tool.relatedTools.map(id => getToolById(id)).filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO
        title={`${tool.name} — Free Online Tool | RecallsFood.com`}
        description={tool.description}
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: tool.name },
          ]} />
        </div>

        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className={`text-4xl w-16 h-16 ${tool.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                {tool.icon}
              </span>
              <div>
                <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">{tool.category}</span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{tool.name}</h1>
              </div>
            </div>
            <p className="text-lg text-gray-600 mb-8">{tool.description}</p>

            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 mb-12">
              {ToolComponent ? (
                <Suspense fallback={<div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div></div>}>
                  <ToolComponent />
                </Suspense>
              ) : (
                <p className="text-gray-500 text-center py-8">This tool is coming soon!</p>
              )}
            </div>

            {relatedTools.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Related Tools</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedTools.map(rt => rt && (
                    <Link
                      key={rt.id}
                      to={`/tools/${rt.slug}`}
                      className="p-4 rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-md transition-all bg-white group"
                    >
                      <span className="text-2xl">{rt.icon}</span>
                      <h3 className="font-semibold text-sm mt-2 group-hover:text-red-600 transition-colors">{rt.name}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ToolPage;
