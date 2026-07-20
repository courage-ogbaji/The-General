import { z } from "zod";

export const cryptoWalletSchema = z.object({
  label: z.string().trim().min(1).max(60),
  address: z.string().trim().min(1).max(200),
});

export const giftInfoSchema = z.object({
  bankAccountName: z.string().trim().max(120).optional().or(z.literal("")),
  bankAccountNumber: z.string().trim().max(60).optional().or(z.literal("")),
  bankName: z.string().trim().max(120).optional().or(z.literal("")),
  deliveryAddress: z.string().trim().max(500).optional().or(z.literal("")),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  cryptoWallets: z.array(cryptoWalletSchema).max(10),
});

export type CryptoWallet = z.infer<typeof cryptoWalletSchema>;
