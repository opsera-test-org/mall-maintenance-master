import { AlertTriangle, CheckCircle2, Clock, AlertOctagon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  type: "open" | "inProgress" | "completed" | "overdue";
}

const iconMap = {
  open: Clock,
  inProgress: AlertTriangle,
  completed: CheckCircle2,
  overdue: AlertOctagon,
};

const styleMap = {
  open: "bg-info/10 text-info",
  inProgress: "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
  overdue: "bg-destructive/10 text-destructive",
};

const StatsCard = ({ label, value, type }: StatsCardProps) => {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border/50 flex items-center gap-4">
      <div className={`rounded-lg p-3 ${styleMap[type]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-card-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
