"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleLikeAction } from "@/app/wishes/like-actions";
import { cn } from "@/lib/utils";

export function WishLikeButton({
  wishId,
  initialLiked,
  initialCount,
  disabled,
}: {
  wishId: string;
  initialLiked: boolean;
  initialCount: number;
  disabled?: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));

    startTransition(async () => {
      const result = await toggleLikeAction(wishId, next);
      if (result.error) {
        setLiked(!next);
        setCount((c) => c + (next ? -1 : 1));
      }
    });
  }

  if (disabled) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Heart className="size-3.5" />
        {count > 0 ? count : "Log in to like"}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this wish" : "Like this wish"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium transition-colors",
        liked
          ? "text-jewel-rose"
          : "text-muted-foreground hover:text-jewel-rose"
      )}
    >
      <Heart className={cn("size-3.5 transition-transform", liked && "fill-jewel-rose scale-110")} />
      {count > 0 ? count : "Like"}
    </button>
  );
}
