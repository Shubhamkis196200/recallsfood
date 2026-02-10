import { Pathogen } from "@/data/recalls";

const pathogenColors: Record<string, string> = {
  Salmonella: "bg-red-100 text-red-800 border-red-200",
  Listeria: "bg-purple-100 text-purple-800 border-purple-200",
  "E. coli": "bg-orange-100 text-orange-800 border-orange-200",
  Allergen: "bg-blue-100 text-blue-800 border-blue-200",
  "Foreign Material": "bg-gray-100 text-gray-800 border-gray-200",
  Aflatoxin: "bg-amber-100 text-amber-800 border-amber-200",
};

export const PathogenTag = ({ pathogen }: { pathogen: Pathogen }) => {
  const color = pathogenColors[pathogen] || "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${color}`}>
      {pathogen}
    </span>
  );
};
