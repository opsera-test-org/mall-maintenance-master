import { useState } from "react";
import { Building2, Wrench } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import RequestTable from "@/components/RequestTable";
import CreateRequestDialog from "@/components/CreateRequestDialog";
import { mockRequests, mockStats } from "@/data/maintenance";
import { Status } from "@/types/maintenance";

const statusFilters: { label: string; value: Status | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<Status | "all">("all");

  const filteredRequests =
    activeFilter === "all"
      ? mockRequests
      : mockRequests.filter((r) => r.status === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent rounded-lg p-2">
              <Building2 className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight">MallCare</h1>
              <p className="text-xs text-primary-foreground/60">Maintenance Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-primary-foreground/70">
              <Wrench className="h-4 w-4" />
              <span>Operations Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Open" value={mockStats.open} type="open" />
          <StatsCard label="In Progress" value={mockStats.inProgress} type="inProgress" />
          <StatsCard label="Completed" value={mockStats.completed} type="completed" />
          <StatsCard label="Overdue" value={mockStats.overdue} type="overdue" />
        </section>

        {/* Toolbar */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-display font-bold text-foreground">Maintenance Requests</h2>
            <p className="text-sm text-muted-foreground">
              {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-muted rounded-lg p-1 gap-0.5">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeFilter === f.value
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <CreateRequestDialog />
          </div>
        </section>

        {/* Table */}
        <RequestTable requests={filteredRequests} />
      </main>
    </div>
  );
};

export default Index;
