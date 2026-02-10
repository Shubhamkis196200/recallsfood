import { Severity } from "@/data/recalls";

const severityConfig: Record<Severity, { label: string; color: string; bg: string }> = {
  critical: { label: "Critical", color: "text-white", bg: "bg-red-600" },
  warning: { label: "Warning", color: "text-white", bg: "bg-orange-500" },
  watch: { label: "Watch", color: "text-gray-900", bg: "bg-yellow-400" },
  resolved: { label: "Resolved", color: "text-white", bg: "bg-green-600" },
};

export const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const config = severityConfig[severity];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${config.bg} ${config.color}`}>
      {severity === "critical" && "⚠ "}{config.label}
    </span>
  );
};
