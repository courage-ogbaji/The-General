import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Landmark, MapPin, Wallet, StickyNote } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CopyButton } from "@/components/copy-button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { GiftEditForm } from "./gift-edit-form";
import type { CryptoWallet } from "@/lib/validations/gift";

export const metadata: Metadata = {
  title: "Gift",
  robots: { index: false, follow: false },
};

export default async function GiftPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/gift");
  }

  const giftInfo = await prisma.giftInfo.findFirst();
  const cryptoWallets = (giftInfo?.cryptoWallets as CryptoWallet[] | null) ?? [];
  const isCelebrant = session.user.role === "CELEBRANT";

  const hasBank =
    giftInfo?.bankAccountName || giftInfo?.bankAccountNumber || giftInfo?.bankName;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <ScrollReveal className="mb-10 text-center">
        <p className="mb-2 text-sm font-medium text-primary">
          Just between us wishers
        </p>
        <h1 className="font-heading text-4xl">Want to send a gift?</h1>
        <p className="mt-4 text-muted-foreground">
          No pressure at all — but if you&apos;d like to, here&apos;s how.
        </p>
      </ScrollReveal>

      <div className="space-y-4">
        {hasBank && (
          <ScrollReveal className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Landmark className="size-4" />
              <h2 className="font-heading text-lg">Bank transfer</h2>
            </div>
            <dl className="space-y-2 text-sm">
              {giftInfo?.bankAccountName && (
                <Row label="Account name" value={giftInfo.bankAccountName} />
              )}
              {giftInfo?.bankName && <Row label="Bank" value={giftInfo.bankName} />}
              {giftInfo?.bankAccountNumber && (
                <Row label="Account number" value={giftInfo.bankAccountNumber} />
              )}
            </dl>
          </ScrollReveal>
        )}

        {cryptoWallets.length > 0 && (
          <ScrollReveal className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Wallet className="size-4" />
              <h2 className="font-heading text-lg">Crypto</h2>
            </div>
            <dl className="space-y-2 text-sm">
              {cryptoWallets.map((wallet, i) => (
                <Row key={i} label={wallet.label} value={wallet.address} mono />
              ))}
            </dl>
          </ScrollReveal>
        )}

        {giftInfo?.deliveryAddress && (
          <ScrollReveal className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <MapPin className="size-4" />
              <h2 className="font-heading text-lg">Ship something instead</h2>
            </div>
            <Row label="Delivery address" value={giftInfo.deliveryAddress} />
          </ScrollReveal>
        )}

        {giftInfo?.note && (
          <ScrollReveal className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <StickyNote className="size-4" />
              <h2 className="font-heading text-lg">A note from her</h2>
            </div>
            <p className="text-sm text-muted-foreground">{giftInfo.note}</p>
          </ScrollReveal>
        )}

        {!hasBank && cryptoWallets.length === 0 && !giftInfo?.deliveryAddress && (
          <p className="text-center text-sm text-muted-foreground">
            Gift details haven&apos;t been added yet — check back soon.
          </p>
        )}
      </div>

      {isCelebrant && (
        <div className="mt-12 border-t border-border/60 pt-8">
          <h2 className="font-heading mb-4 text-xl">Edit gift details</h2>
          <GiftEditForm
            initial={{
              bankAccountName: giftInfo?.bankAccountName ?? "",
              bankAccountNumber: giftInfo?.bankAccountNumber ?? "",
              bankName: giftInfo?.bankName ?? "",
              deliveryAddress: giftInfo?.deliveryAddress ?? "",
              note: giftInfo?.note ?? "",
              cryptoWallets,
            }}
          />
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className={`truncate text-foreground ${mono ? "font-mono text-xs" : ""}`}>
          {value}
        </dd>
      </div>
      <CopyButton value={value} label={label} />
    </div>
  );
}
