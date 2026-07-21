"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import { deleteWishAction } from "./actions";
import { Button } from "@/components/ui/button";
import { WishComments, type CommentWithAuthor } from "@/components/wish-comments";
import type { Wish } from "@/lib/generated/prisma/client";

type WishWithComments = Wish & { comments: CommentWithAuthor[] };
type CurrentUser = { id: string; role: "WISHER" | "CELEBRANT" };

export function WishList({
  wishes,
  currentUser,
}: {
  wishes: WishWithComments[];
  currentUser: CurrentUser;
}) {
  if (wishes.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        You haven&apos;t posted a wish yet.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {wishes.map((wish) => (
        <WishRow key={wish.id} wish={wish} currentUser={currentUser} />
      ))}
    </ul>
  );
}

function WishRow({
  wish,
  currentUser,
}: {
  wish: WishWithComments;
  currentUser: CurrentUser;
}) {
  const [isPending, startTransition] = useTransition();
  const thumbnail = wish.mediaUrls[0];

  return (
    <li className="space-y-3 rounded-lg border border-border/60 bg-card p-3">
      <div className="flex items-start gap-3">
        {thumbnail && (
          <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              src={thumbnail}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {wish.favorite && (
            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-jewel-rose/10 px-2 py-0.5 text-xs font-medium text-jewel-rose">
              <Heart className="size-3 fill-jewel-rose text-jewel-rose" />
              She loved this
            </span>
          )}
          {wish.caption && (
            <p className="line-clamp-2 text-sm text-foreground">{wish.caption}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(wish.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={isPending}
          aria-label="Delete wish"
          onClick={() => startTransition(() => deleteWishAction(wish.id))}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <WishComments
        wishId={wish.id}
        initialComments={wish.comments}
        currentUser={currentUser}
      />
    </li>
  );
}
