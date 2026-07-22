"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireCelebrant() {
  const session = await auth();
  if (session?.user.role !== "CELEBRANT") {
    throw new Error("Not authorized.");
  }
}

export async function toggleSeenAction(wishId: string, seen: boolean) {
  await requireCelebrant();
  await prisma.wish.update({
    where: { id: wishId },
    data: { seenAt: seen ? new Date() : null },
  });
  revalidatePath("/dashboard");
}

export async function toggleFavoriteAction(wishId: string, favorite: boolean) {
  await requireCelebrant();
  await prisma.wish.update({
    where: { id: wishId },
    data: { favorite },
  });
  revalidatePath("/dashboard");
}

export async function togglePublishAction(wishId: string, published: boolean) {
  await requireCelebrant();
  await prisma.wish.update({
    where: { id: wishId },
    data: { published },
  });
  revalidatePath("/dashboard");
  revalidatePath("/wishes");
  revalidatePath("/profile");
}
