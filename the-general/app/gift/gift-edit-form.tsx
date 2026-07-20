"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateGiftInfoAction, type GiftInfoState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CryptoWallet } from "@/lib/validations/gift";

type Fields = {
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  deliveryAddress: string;
  note: string;
  cryptoWallets: CryptoWallet[];
};

export function GiftEditForm({ initial }: { initial: Fields }) {
  const [state, formAction, isPending] = useActionState<GiftInfoState, FormData>(
    async (prevState, formData) => {
      const result = await updateGiftInfoAction(prevState, formData);
      if (result?.success) toast.success("Gift details updated");
      return result;
    },
    undefined
  );

  const [bankAccountName, setBankAccountName] = useState(initial.bankAccountName);
  const [bankAccountNumber, setBankAccountNumber] = useState(
    initial.bankAccountNumber
  );
  const [bankName, setBankName] = useState(initial.bankName);
  const [wallets, setWallets] = useState<CryptoWallet[]>(initial.cryptoWallets);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bankAccountName">Account name</Label>
          <Input
            id="bankAccountName"
            name="bankAccountName"
            value={bankAccountName}
            onChange={(e) => setBankAccountName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bankName">Bank</Label>
          <Input
            id="bankName"
            name="bankName"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="bankAccountNumber">Account number</Label>
          <Input
            id="bankAccountNumber"
            name="bankAccountNumber"
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Crypto wallets</Label>
        <input type="hidden" name="cryptoWallets" value={JSON.stringify(wallets)} />
        <div className="space-y-2">
          {wallets.map((wallet, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Label (e.g. Bitcoin)"
                value={wallet.label}
                onChange={(e) =>
                  setWallets((prev) =>
                    prev.map((w, i) =>
                      i === index ? { ...w, label: e.target.value } : w
                    )
                  )
                }
                className="w-32 shrink-0"
              />
              <Input
                placeholder="Wallet address"
                value={wallet.address}
                onChange={(e) =>
                  setWallets((prev) =>
                    prev.map((w, i) =>
                      i === index ? { ...w, address: e.target.value } : w
                    )
                  )
                }
                className="font-mono text-xs"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove wallet"
                onClick={() => setWallets((prev) => prev.filter((_, i) => i !== index))}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setWallets((prev) => [...prev, { label: "", address: "" }])}
        >
          <Plus className="size-3.5" />
          Add wallet
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deliveryAddress">Delivery address</Label>
        <Textarea
          id="deliveryAddress"
          name="deliveryAddress"
          defaultValue={initial.deliveryAddress}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note to wishers (optional)</Label>
        <Textarea id="note" name="note" defaultValue={initial.note} rows={2} />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save gift details"}
      </Button>
    </form>
  );
}
