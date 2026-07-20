"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { wishSchema } from "@/lib/validations/wish";
import { sanitizePlainText } from "@/lib/sanitize";

export type CreateWishState = { error: string } | undefined;

export async function createWishAction(
  _prevState: CreateWishState,
  formData: FormData
): Promise<CreateWishState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in." };
  }

  let media: unknown;
  try {
    media = JSON.parse((formData.get("media") as string | null) ?? "[]");
  } catch {
    return { error: "Something went wrong with your uploads. Try again." };
  }

  const parsed = wishSchema.safeParse({
    caption: formData.get("caption") || undefined,
    media,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  for (const item of parsed.data.media) {
    const url = new URL(item.url);
    if (url.hostname !== "res.cloudinary.com") {
      return { error: "Invalid media URL." };
    }
  }

  const hasImage = parsed.data.media.some((m) => m.type === "IMAGE");
  const hasVideo = parsed.data.media.some((m) => m.type === "VIDEO");
  const type =
    parsed.data.media.length === 0
      ? "TEXT"
      : hasImage && hasVideo
        ? "MIXED"
        : hasImage
          ? "IMAGE"
          : "VIDEO";

  await prisma.wish.create({
    data: {
      authorId: session.user.id,
      type,
      mediaUrls: parsed.data.media.map((m) => m.url),
      caption: parsed.data.caption ? sanitizePlainText(parsed.data.caption) : null,
    },
  });

  revalidatePath("/wishes");
  revalidatePath("/profile");
  redirect("/wishes");
}
