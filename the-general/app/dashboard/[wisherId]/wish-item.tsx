"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Eye, EyeOff, Heart, Megaphone, PlayCircle } from "lucide-react";
import {
  toggleSeenAction,
  toggleFavoriteAction,
  togglePublishAction,
} from "./actions";
import { Button } from "@/components/ui/button";
import { WishComments, type CommentWithAuthor } from "@/components/wish-comments";
import type { Wish } from "@/lib/generated/prisma/client";

type WishWithComments = Wish & { comments: CommentWithAuthor[] };

export function WishItem({
  wish,
  currentUser,
}: {
  wish: WishWithComments;
  currentUser: { id: string; role: "WISHER" | "CELEBRANT" } | null;
}) {
  const [isPending, startTransition] = useTransition();
  const seen = Boolean(wish.seenAt);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      {wish.mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-0.5 bg-muted">
          {wish.mediaUrls.slice(0, 4).map((url, i) => {
            const isVideo = /\.(mp4|mov|webm)$/i.test(url);
            return (
              <div key={i} className="relative aspect-square">
                {isVideo ? (
                  <>
                    <video src={url} className="size-full object-cover" muted />
                    <PlayCircle className="absolute inset-0 m-auto size-6 text-white drop-shadow" />
                  </>
                ) : (
                  <Image
                    src={url}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="space-y-3 p-4">
        {wish.published && (
          <span className="inline-flex items-center gap-1 rounded-full bg-jewel-teal/10 px-2 py-0.5 text-xs font-medium text-jewel-teal">
            <Megaphone className="size-3" />
            On the wall
          </span>
        )}
        {wish.caption && <p className="text-sm text-foreground">{wish.caption}</p>}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {new Date(wish.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={isPending}
              aria-label={seen ? "Mark as unseen" : "Mark as seen"}
              onClick={() =>
                startTransition(() => toggleSeenAction(wish.id, !seen))
              }
            >
              {seen ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={isPending}
              aria-label={wish.favorite ? "Unfavorite" : "Favorite"}
              onClick={() =>
                startTransition(() =>
                  toggleFavoriteAction(wish.id, !wish.favorite)
                )
              }
            >
              <Heart
                className={`size-4 ${wish.favorite ? "fill-primary text-primary" : ""}`}
              />
            </Button>
            <Button
              type="button"
              variant={wish.published ? "secondary" : "outline"}
              size="sm"
              disabled={isPending}
              onClick={() =>
                startTransition(() =>
                  togglePublishAction(wish.id, !wish.published)
                )
              }
            >
              <Megaphone className="size-3.5" />
              {wish.published ? "Remove from wall" : "Publish"}
            </Button>
          </div>
        </div>

        <WishComments
          wishId={wish.id}
          initialComments={wish.comments}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
