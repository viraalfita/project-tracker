"use client";

import { useState } from "react";
import { Comment } from "@/lib/types";
import { AvatarChip } from "@/components/shared/AvatarChip";
import { useAuth } from "@/contexts/AuthContext";
import { canWrite } from "@/lib/permissions";
import { Send } from "lucide-react";

interface CommentsSectionProps {
  initialComments: Comment[];
}

export function CommentsSection({ initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [draft, setDraft] = useState("");
  const { currentUser } = useAuth();
  const editable = canWrite(currentUser);

  function handlePost() {
    if (!draft.trim() || !currentUser) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      taskId: "",
      author: currentUser,
      text: draft.trim(),
      createdAt: "Just now",
    };
    setComments((prev) => [...prev, newComment]);
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handlePost();
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Comments <span className="text-muted-foreground font-normal">({comments.length})</span>
      </h3>

      {/* Comment list */}
      <div className="space-y-4 mb-4">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">No comments yet. Be the first.</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <AvatarChip user={comment.author} size="sm" className="mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input — hidden for read-only roles */}
      {editable && currentUser ? (
        <div className="flex gap-3">
          <AvatarChip user={currentUser} size="sm" className="mt-1.5" />
          <div className="flex-1">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a comment… (⌘+Enter to post)"
              rows={2}
              className="w-full rounded-md border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div className="flex justify-end mt-1.5">
              <button
                onClick={handlePost}
                disabled={!draft.trim()}
                className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                Post
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">
          Comments are read-only for your role.
        </p>
      )}
    </div>
  );
}
