import { EpicCard } from "@/components/dashboard/EpicCard";
import { Epic } from "@/lib/types";

interface ProjectEpicsTabProps {
  epics: Epic[];
}

export function ProjectEpicsTab({ epics }: ProjectEpicsTabProps) {
  if (epics.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No epics in this project yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {epics.map((epic) => (
        <EpicCard key={epic.id} epic={epic} />
      ))}
    </div>
  );
}
