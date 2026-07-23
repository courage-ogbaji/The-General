"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations/profile";
import { sanitizePlainText } from "@/lib/sanitize";

export type ProfileState = { error?: string; success?: boolean } | undefined;

export async function updateProfileAction(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in." };
  }

  const parsed = profileSchema.safeParse({
    displayName: formData.get("displayName"),
    bio: formData.get("bio") || undefined,
    location: formData.get("location") || undefined,
    phone: formData.get("phone") || undefined,
    profilePhotoUrl: formData.get("profilePhotoUrl") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const displayName = sanitizePlainText(parsed.data.displayName);
  const bio = parsed.data.bio ? sanitizePlainText(parsed.data.bio) : null;
  const location = parsed.data.location
    ? sanitizePlainText(parsed.data.location)
    : null;
  const phone = parsed.data.phone ? sanitizePlainText(parsed.data.phone) : null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      displayName,
      bio,
      location,
      phone,
      ...(parsed.data.profilePhotoUrl
        ? { profilePhotoUrl: parsed.data.profilePhotoUrl }
        : {}),
    },
  });

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function deleteWishAction(wishId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("You must be logged in.");
  }

  await prisma.wish.deleteMany({
    where: { id: wishId, authorId: session.user.id },
  });

  revalidatePath("/profile");
  revalidatePath("/wishes");
}
