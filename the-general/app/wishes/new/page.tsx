"use client";

import { createWishAction } from "./actions";
import { WishForm } from "@/components/wish-form";

export default function NewWishPage() {
  return (
    <WishForm
      action={createWishAction}
      submitLabel="Post my wish"
      pendingLabel="Posting…"
      title="Leave your wish"
      description="Photos, a video, a message — whatever feels right."
    />
  );
}
