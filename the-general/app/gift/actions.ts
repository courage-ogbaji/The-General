"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { giftInfoSchema } from "@/lib/validations/gift";
import { sanitizePlainText } from "@/lib/sanitize";

export type GiftInfoState = { error?: string; success?: boolean } | undefined;

export async function updateGiftInfoAction(
  _prevState: GiftInfoState,
  formData: FormData
): Promise<GiftInfoState> {
  const session = await auth();
  if (session?.user.role !== "CELEBRANT") {
    return { error: "Not authorized." };
  }

  let cryptoWallets: unknown;
  try {
    cryptoWallets = JSON.parse(
      (formData.get("cryptoWallets") as string | null) ?? "[]"
    );
  } catch {
    return { error: "Something went wrong with the wallet list." };
  }

  const parsed = giftInfoSchema.safeParse({
    bankAccountName: formData.get("bankAccountName") || undefined,
    bankAccountNumber: formData.get("bankAccountNumber") || undefined,
    bankName: formData.get("bankName") || undefined,
    deliveryAddress: formData.get("deliveryAddress") || undefined,
    note: formData.get("note") || undefined,
    cryptoWallets,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const data = {
    bankAccountName: parsed.data.bankAccountName
      ? sanitizePlainText(parsed.data.bankAccountName)
      : null,
    bankAccountNumber: parsed.data.bankAccountNumber
      ? sanitizePlainText(parsed.data.bankAccountNumber)
      : null,
    bankName: parsed.data.bankName ? sanitizePlainText(parsed.data.bankName) : null,
    deliveryAddress: parsed.data.deliveryAddress
      ? sanitizePlainText(parsed.data.deliveryAddress)
      : null,
    note: parsed.data.note ? sanitizePlainText(parsed.data.note) : null,
    cryptoWallets: parsed.data.cryptoWallets.map((w) => ({
      label: sanitizePlainText(w.label),
      address: w.address.trim(),
    })),
  };

  const existing = await prisma.giftInfo.findFirst();
  if (existing) {
    await prisma.giftInfo.update({ where: { id: existing.id }, data });
  } else {
    await prisma.giftInfo.create({ data });
  }

  revalidatePath("/gift");
  return { success: true };
}
