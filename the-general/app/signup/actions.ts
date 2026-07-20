"use server";

import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { signupSchema } from "@/lib/validations/auth";
import { sanitizePlainText } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";

export type SignupState = { error: string } | undefined;

export async function signupAction(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
    bio: formData.get("bio") || undefined,
    profilePhotoUrl: formData.get("profilePhotoUrl") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "unknown";
  const { success } = rateLimit(`signup:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!success) {
    return { error: "Too many attempts. Try again in a minute." };
  }

  const { email, password, bio, profilePhotoUrl } = parsed.data;
  const displayName = sanitizePlainText(parsed.data.displayName);
  const sanitizedBio = bio ? sanitizePlainText(bio) : undefined;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      hashedPassword,
      displayName,
      bio: sanitizedBio,
      profilePhotoUrl: profilePhotoUrl || undefined,
      role: "WISHER",
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/profile",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created — please log in." };
    }
    throw error;
  }
}
