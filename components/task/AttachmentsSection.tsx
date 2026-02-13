"use client";

import { useToast } from "@/contexts/ToastContext";
import { Attachment } from "@/lib/types";
import { Download, Paperclip, Trash2, Upload } from "lucide-react";
import { useState } from "react";

interface AttachmentsSectionProps {
  taskId: string;
  attachments: Attachment[];
  canEdit: boolean;
}

export function AttachmentsSection({
  attachments,
  canEdit,
}: AttachmentsSectionProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload
    setIsUploading(true);
    setTimeout(() => {
      toast(`File "${file.name}" uploaded successfully`);
      setIsUploading(false);
      // In real app, would call API to upload and update task
    }, 1500);
  }

  function handleDelete(attachment: Attachment) {
    if (confirm(`Delete "${attachment.filename}"?`)) {
      toast(`File "${attachment.filename}" deleted`, "info");
      // In real app, would call API to delete
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Paperclip className="h-4 w-4" />
          Attachments{" "}
          <span className="text-muted-foreground font-normal">
            ({attachments.length})
          </span>
        </h3>
        {canEdit && (
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors">
            <Upload className="h-3.5 w-3.5" />
            Upload
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      {isUploading && (
        <div className="mb-3 rounded-lg border border-border bg-slate-50 p-3 text-center">
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      )}

      {attachments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No attachments yet</p>
      ) : (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between rounded-lg border border-border bg-white p-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {attachment.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)} · Uploaded by{" "}
                    {attachment.uploadedBy.name} · {attachment.uploadedAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={attachment.url}
                  download
                  className="p-1.5 text-muted-foreground hover:text-indigo-600 transition-colors"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </a>
                {canEdit && (
                  <button
                    onClick={() => handleDelete(attachment)}
                    className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
