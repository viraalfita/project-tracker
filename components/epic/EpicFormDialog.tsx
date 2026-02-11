"use client";

import { UserSelect } from "@/components/shared/UserSelect";
import { useAuth } from "@/contexts/AuthContext";
import { useDataStore } from "@/contexts/DataStore";
import { useToast } from "@/contexts/ToastContext";
import { USERS } from "@/lib/mock";
import { Epic, EpicStatus, User } from "@/lib/types";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const EPIC_STATUSES: EpicStatus[] = [
  "Not Started",
  "In Progress",
  "Done",
  "On Hold",
];

interface EpicFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** When set, the dialog is in edit mode. */
  epic?: Epic;
}

export function EpicFormDialog({ open, onClose, epic }: EpicFormDialogProps) {
  const { createEpic, updateEpic } = useDataStore();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const isEdit = !!epic;
  const [title, setTitle] = useState(epic?.title ?? "");
  const [description, setDescription] = useState(epic?.description ?? "");
  const [status, setStatus] = useState<EpicStatus>(
    epic?.status ?? "Not Started",
  );
  const [owner, setOwner] = useState<User | null>(epic?.owner ?? currentUser);

  // Sync form when epic prop changes (switching between edit targets)
  useEffect(() => {
    if (open) {
      setTitle(epic?.title ?? "");
      setDescription(epic?.description ?? "");
      setStatus(epic?.status ?? "Not Started");
      setOwner(epic?.owner ?? currentUser);
    }
  }, [open, epic, currentUser]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !owner) return;

    if (isEdit && epic) {
      updateEpic(epic.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        ownerId: owner.id,
      });
      toast(`Epic "${title.trim()}" updated.`);
    } else {
      createEpic({
        title: title.trim(),
        description: description.trim(),
        ownerId: owner.id,
        status,
        memberIds: [owner.id],
      });
      toast(`Epic "${title.trim()}" created.`);
    }
    onClose();
  }

  // Only Admins can assign epics
  const canAssign = currentUser?.role === "Admin";

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-foreground">
              {isEdit ? "Edit Epic" : "New Epic"}
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 hover:bg-accent transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Authentication Overhaul"
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this epic about?"
                rows={3}
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Owner <span className="text-red-500">*</span>
              </label>
              <UserSelect
                users={USERS}
                value={owner}
                onChange={setOwner}
                placeholder="Select owner..."
                disabled={!canAssign}
                allowUnassigned={false}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EpicStatus)}
                className="w-full rounded-md border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {EPIC_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !owner}
                className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isEdit ? "Save Changes" : "Create Epic"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
