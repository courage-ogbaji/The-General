"use client";

import { updateWishAction } from "./actions";
import { WishForm } from "@/components/wish-form";
import type { WishMedia } from "@/lib/validations/wish";

export function EditWishForm({
  wishId,
  initialCaption,
  initialMedia,
}: {
  wishId: string;
  initialCaption: string;
  initialMedia: WishMedia[];
}) {
  return (
    <WishForm
      action={updateWishAction.bind(null, wishId)}
      initialCaption={initialCaption}
      initialMedia={initialMedia}
      submitLabel="Save changes"
      pendingLabel="Saving…"
      title="Edit your wish"
      description="Update your photos, video, or message."
    />
  );
}
