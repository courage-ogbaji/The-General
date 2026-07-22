"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validations/comment";
import { sanitizePlainText } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";

export type CommentActionResult = {
  error?: string;
  comment?: {
    id: string;
    body: string;
    createdAt: string;
    author: {
      id: string;
      displayName: string;
      profilePhotoUrl: string | null;
    };
  };
};

function revalidateWishSurfaces() {
  revalidatePath("/wishes");
  revalidatePath("/profile");
  revalidatePath("/dashboard", "layout");
}

export async function createCommentAction(
  wishId: string,
  body: string
): Promise<CommentActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to reply." };
  }

  const parsed = commentSchema.safeParse({ body });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid reply." };
  }

  const { success } = rateLimit(`comment:${session.user.id}`, {
    limit: 20,
    windowMs: 60_000,
  });
  if (!success) {
    return { error: "Slow down a little — try again in a minute." };
  }

  const wish = await prisma.wish.findUnique({
    where: { id: wishId },
    select: { id: true, authorId: true, published: true },
  });
  if (!wish) {
    return { error: "This wish no longer exists." };
  }

  const canComment =
    wish.published ||
    wish.authorId === session.user.id ||
    session.user.role === "CELEBRANT";
  if (!canComment) {
    return { error: "This wish isn't on the wall yet." };
  }

  const comment = await prisma.comment.create({
    data: {
      wishId,
      authorId: session.user.id,
      body: sanitizePlainText(parsed.data.body),
    },
    include: {
      author: {
        select: { id: true, displayName: true, profilePhotoUrl: true },
      },
    },
  });

  revalidateWishSurfaces();

  return {
    comment: {
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt.toISOString(),
      author: comment.author,
    },
  };
}

export async function deleteCommentAction(
  commentId: string
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in." };
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true },
  });
  if (!comment) {
    return {};
  }

  const isOwner = comment.authorId === session.user.id;
  const isCelebrant = session.user.role === "CELEBRANT";
  if (!isOwner && !isCelebrant) {
    return { error: "Not authorized." };
  }

  await prisma.comment.delete({ where: { id: commentId } });

  revalidateWishSurfaces();

  return {};
}
