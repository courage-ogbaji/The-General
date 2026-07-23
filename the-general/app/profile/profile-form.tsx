"use client";

import { useActionState, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { updateProfileAction, type ProfileState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileForm({
  displayName,
  bio,
  location,
  phone,
  profilePhotoUrl,
}: {
  displayName: string;
  bio: string;
  location: string;
  phone: string;
  profilePhotoUrl: string | null;
}) {
  const [state, formAction, isPending] = useActionState<ProfileState, FormData>(
    updateProfileAction,
    undefined
  );
  const [photoUrl, setPhotoUrl] = useState(profilePhotoUrl ?? "");
  const [name, setName] = useState(displayName);
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src={photoUrl || undefined} alt={name} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        {uploadPreset && (
          <div>
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
                <Button type="button" variant="outline" size="sm" onClick={() => open()}>
                  Change photo
                </Button>
              )}
            </CldUploadWidget>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Your name</Label>
        <Input
          id="displayName"
          name="displayName"
          required
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">About you (optional)</Label>
        <Textarea
          id="bio"
          name="bio"
          maxLength={280}
          defaultValue={bio}
          placeholder="How you know her, or anything you'd like her to see..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location (optional)</Label>
          <Input
            id="location"
            name="location"
            maxLength={100}
            defaultValue={location}
            placeholder="Lagos, Nigeria"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number (optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            maxLength={30}
            defaultValue={phone}
            placeholder="+234 800 000 0000"
          />
        </div>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-primary">Profile updated.</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
