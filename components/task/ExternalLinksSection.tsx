"use client";

import { useToast } from "@/contexts/ToastContext";
import { ExternalLink as ExternalLinkType } from "@/lib/types";
import { ExternalLink, Link as LinkIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ExternalLinksSectionProps {
  taskId: string;
  links: ExternalLinkType[];
  canEdit: boolean;
}

export function ExternalLinksSection({
  links,
  canEdit,
}: ExternalLinksSectionProps) {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");

  function handleAdd() {
    if (!url.trim() || !label.trim()) {
      toast("URL and label are required", "error");
      return;
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      toast("Please enter a valid URL", "error");
      return;
    }

    toast(`Link "${label}" added`);
    setIsAdding(false);
    setUrl("");
    setLabel("");
    // In real app, would call API to add link
  }

  function handleDelete(link: ExternalLinkType) {
    if (confirm(`Delete link "${link.label}"?`)) {
      toast(`Link "${link.label}" deleted`, "info");
      // In real app, would call API to delete
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <LinkIcon className="h-4 w-4" />
          External Links{" "}
          <span className="text-muted-foreground font-normal">
            ({links.length})
          </span>
        </h3>
        {canEdit && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Link
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-3 rounded-lg border border-border bg-white p-3 space-y-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-md border border-border bg-white px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Link label"
            className="w-full rounded-md border border-border bg-white px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setUrl("");
                setLabel("");
              }}
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {links.length === 0 ? (
        <p className="text-sm text-muted-foreground">No external links yet</p>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between rounded-lg border border-border bg-white p-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 truncate"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                  <p className="text-xs text-muted-foreground truncate">
                    {link.url} · Added by {link.addedBy.name} · {link.addedAt}
                  </p>
                </div>
              </div>
              {canEdit && (
                <button
                  onClick={() => handleDelete(link)}
                  className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors shrink-0"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
