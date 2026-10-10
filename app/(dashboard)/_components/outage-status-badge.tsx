import { AlertTriangle, CheckCircle2, Clock3, Wrench } from "lucide-react";

const STATUS_STYLES: Record<
  string,
  {
    bg: string;
    text: string;
    dot: string;
    Icon: React.ElementType;
    label: string;
  }
> = {
  REPORTED: {
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    Icon: AlertTriangle,
    label: "Reported",
  },
  INVESTIGATING: {
    bg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
    Icon: Wrench,
    label: "Investigating",
  },
  IN_PROGRESS: {
    bg: "bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-400",
    dot: "bg-violet-500",
    Icon: Clock3,
    label: "In progress",
  },
  RESOLVED: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    Icon: CheckCircle2,
    label: "Resolved",
  },
};

type OutageStatusBadgeProps = {
  status: string;
  size?: "sm" | "md";
};

export function OutageStatusBadge({
  status,
  size = "md",
}: OutageStatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    Icon: AlertTriangle,
    label: status.replaceAll("_", " "),
  };

  const sizeClass =
    size === "sm"
      ? "px-2 py-0.5 text-[10px]"
      : "px-2.5 py-1 text-xs";

  const IconSize = size === "sm" ? "size-2.5" : "size-3";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wider ${style.bg} ${style.text} ${sizeClass}`}
    >
      <span className={`${IconSize} rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
