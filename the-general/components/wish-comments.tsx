"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { createCommentAction, deleteCommentAction } from "@/app/wishes/comment-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type CommentWithAuthor = {
  id: string;
  body: string;
  createdAt: string | Date;
  author: {
    id: string;
    displayName: string;
    profilePhotoUrl: string | null;
  };
};

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function WishComments({
  wishId,
  initialComments,
  currentUser,
}: {
  wishId: string;
  initialComments: CommentWithAuthor[];
  currentUser: { id: string; role: "WISHER" | "CELEBRANT" } | null;
}) {
  const [comments, setComments] = useState(initialComments);
  const [showAll, setShowAll] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const visibleComments = showAll ? comments : comments.slice(-2);
  const hiddenCount = comments.length - visibleComments.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setError(null);
    const body = draft;
    startTransition(async () => {
      const result = await createCommentAction(wishId, body);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.comment) {
        setComments((prev) => [...prev, result.comment!]);
        setDraft("");
      }
    });
  }

  function handleDelete(commentId: string) {
    startTransition(async () => {
      const result = await deleteCommentAction(commentId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    });
  }

  return (
    <div className="space-y-2 border-t border-border/60 pt-3">
      {comments.length > 0 && (
        <div className="space-y-2">
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <MessageCircle className="size-3.5" />
              View {hiddenCount} earlier {hiddenCount === 1 ? "reply" : "replies"}
            </button>
          )}
          {visibleComments.map((comment) => {
            const canDelete =
              currentUser &&
              (currentUser.id === comment.author.id ||
                currentUser.role === "CELEBRANT");
            return (
              <div key={comment.id} className="group flex items-start gap-2">
                <Avatar className="size-5 shrink-0">
                  <AvatarImage
                    src={comment.author.profilePhotoUrl ?? undefined}
                    alt={comment.author.displayName}
                  />
                  <AvatarFallback className="text-[9px]">
                    {initialsFor(comment.author.displayName)}
                  </AvatarFallback>
                </Avatar>
                <p className="min-w-0 flex-1 text-xs leading-relaxed text-foreground">
                  <span className="font-medium">{comment.author.displayName}</span>{" "}
                  <span className="text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                  <br />
                  {comment.body}
                </p>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    disabled={isPending}
                    aria-label="Delete reply"
                    className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {currentUser ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a reply…"
            maxLength={500}
            disabled={isPending}
            className="h-8 text-xs"
          />
          <Button
            type="submit"
            size="icon-sm"
            variant="ghost"
            disabled={isPending || !draft.trim()}
            aria-label="Send reply"
          >
            <Send className="size-3.5" />
          </Button>
        </form>
      ) : (
        <Link
          href="/login"
          className="text-xs font-medium text-primary hover:underline"
        >
          Log in to reply
        </Link>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
