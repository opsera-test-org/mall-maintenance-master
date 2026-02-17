import { MaintenanceRequest } from "@/types/maintenance";
import { Badge } from "@/components/ui/badge";
import { MapPin, User } from "lucide-react";

const priorityStyles: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-info/15 text-info border-info/20",
  high: "bg-warning/15 text-warning border-warning/20",
  critical: "bg-destructive/15 text-destructive border-destructive/20",
};

const statusStyles: Record<string, string> = {
  open: "bg-info/10 text-info",
  "in-progress": "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  "in-progress": "In Progress",
  completed: "Completed",
};

interface RequestTableProps {
  requests: MaintenanceRequest[];
}

const RequestTable = ({ requests }: RequestTableProps) => {
  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Request</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Category</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Priority</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">{req.id}</td>
                <td className="py-3.5 px-4">
                  <div>
                    <p className="font-medium text-card-foreground">{req.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {req.location}
                    </p>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">{req.category}</td>
                <td className="py-3.5 px-4">
                  <Badge variant="outline" className={`text-xs capitalize ${priorityStyles[req.priority]}`}>
                    {req.priority}
                  </Badge>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[req.status]}`}>
                    {statusLabels[req.status]}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="h-3.5 w-3.5" /> {req.assignee}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestTable;
