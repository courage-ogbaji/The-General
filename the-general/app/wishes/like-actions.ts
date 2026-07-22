"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type LikeActionResult = { error?: string; liked?: boolean };

export async function toggleLikeAction(
  wishId: string,
  like: boolean
): Promise<LikeActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to like a wish." };
  }

  const wish = await prisma.wish.findUnique({
    where: { id: wishId },
    select: { id: true, published: true },
  });
  if (!wish?.published) {
    return { error: "This wish isn't on the wall." };
  }

  if (like) {
    await prisma.like.upsert({
      where: { wishId_userId: { wishId, userId: session.user.id } },
      update: {},
      create: { wishId, userId: session.user.id },
    });
  } else {
    await prisma.like.deleteMany({
      where: { wishId, userId: session.user.id },
    });
  }

  revalidatePath("/wishes");

  return { liked: like };
}
