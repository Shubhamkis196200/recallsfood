import { Link } from "react-router-dom";
import { RecallAlert } from "@/data/recalls";
import { SeverityBadge } from "./SeverityBadge";
import { PathogenTag } from "./PathogenTag";

export const RecallCard = ({ recall }: { recall: RecallAlert }) => {
  const severityBorder: Record<string, string> = {
    critical: "border-l-red-600",
    warning: "border-l-orange-500",
    watch: "border-l-yellow-400",
    resolved: "border-l-green-600",
  };

  return (
    <Link to={`/recalls/${recall.slug}`} className="block group">
      <article className={`bg-white border border-gray-200 border-l-4 ${severityBorder[recall.severity]} rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200`}>
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 sm:h-36 h-48 flex-shrink-0">
            <img
              src={recall.image}
              alt={recall.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-4 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <SeverityBadge severity={recall.severity} />
              <PathogenTag pathogen={recall.pathogen} />
              <span className="text-xs text-gray-500">Class {recall.recallClass}</span>
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2 text-lg leading-tight mb-1">
              {recall.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{recall.excerpt}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span>{new Date(recall.dateIssued).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              <span>•</span>
              <span>{recall.brand}</span>
              <span>•</span>
              <div className="flex gap-1">
                {recall.stores.slice(0, 3).map((store) => (
                  <span key={store} className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{store}</span>
                ))}
                {recall.stores.length > 3 && <span className="text-gray-400">+{recall.stores.length - 3}</span>}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};
