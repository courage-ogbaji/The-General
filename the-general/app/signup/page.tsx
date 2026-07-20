"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import { signupAction, type SignupState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<SignupState, FormData>(
    signupAction,
    undefined
  );
  const [photoUrl, setPhotoUrl] = useState("");
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-heading text-3xl mb-2">Join the celebration</h1>
      <p className="text-muted-foreground mb-8">
        Create an account to leave your wish.
      </p>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Your name</Label>
          <Input
            id="displayName"
            name="displayName"
            required
            maxLength={60}
            placeholder="How she knows you"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Relationship to her (optional)</Label>
          <Textarea
            id="bio"
            name="bio"
            maxLength={280}
            placeholder="College roommate, cousin, coworker..."
          />
        </div>
        {uploadPreset && (
          <div className="space-y-2">
            <Label>Profile photo (optional)</Label>
            <input type="hidden" name="profilePhotoUrl" value={photoUrl} />
            <CldUploadWidget
              uploadPreset={uploadPreset}
              options={{
                maxFiles: 1,
                sources: ["local"],
                resourceType: "image",
                clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                maxFileSize: 5_000_000,
              }}
              onSuccess={(results) => {
                const info = results.info;
                if (info && typeof info === "object" && "secure_url" in info) {
                  setPhotoUrl(info.secure_url ?? "");
                }
              }}
            >
              {({ open }) => (
                <Button type="button" variant="outline" onClick={() => open()}>
                  {photoUrl ? "Photo added ✓" : "Upload a photo"}
                </Button>
              )}
            </CldUploadWidget>
          </div>
        )}
        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating account…" : "Sign up"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
