"use client";

import Image from "next/image";
import { Heart, Megaphone } from "lucide-react";
import { deleteWishAction } from "./actions";
import { WishComments, type CommentWithAuthor } from "@/components/wish-comments";
import { WishKebabMenu } from "@/components/wish-kebab-menu";
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
    <ul className="space-y-4">
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
  const thumbnail = wish.mediaUrls[0];

  return (
    <li className="space-y-3 rounded-2xl border border-border/60 bg-card p-4">
      <div className="flex items-start gap-4">
        {thumbnail && (
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image
              src={thumbnail}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            {wish.favorite && (
              <span className="inline-flex items-center gap-1 rounded-full bg-jewel-rose/10 px-2 py-0.5 text-xs font-medium text-jewel-rose">
                <Heart className="size-3 fill-jewel-rose text-jewel-rose" />
                She loved this
              </span>
            )}
            <span
              className={
                wish.published
                  ? "inline-flex items-center gap-1 rounded-full bg-jewel-teal/10 px-2 py-0.5 text-xs font-medium text-jewel-teal"
                  : "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
              }
            >
              <Megaphone className="size-3" />
              {wish.published ? "On the wall" : "Only she can see this"}
            </span>
          </div>
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
        <WishKebabMenu
          wishId={wish.id}
          onDelete={() => deleteWishAction(wish.id)}
        />
      </div>

      <WishComments
        wishId={wish.id}
        initialComments={wish.comments}
        currentUser={currentUser}
      />
    </li>
  );
}
