import { AvatarChip } from "@/components/shared/AvatarChip";
import { USERS } from "@/lib/mock";

interface ProjectMembersTabProps {
  memberIds: string[];
}

export function ProjectMembersTab({ memberIds }: ProjectMembersTabProps) {
  const members = USERS.filter((u) => memberIds.includes(u.id));

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div
          key={member.id}
          className="rounded-lg border border-border bg-white p-4 flex items-center justify-between"
        >
          <AvatarChip user={member} size="md" showName />
          <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-slate-100">
            {member.role}
          </span>
        </div>
      ))}
    </div>
  );
}
