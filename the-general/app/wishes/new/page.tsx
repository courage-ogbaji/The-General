"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { X, ImagePlus, Video as VideoIcon } from "lucide-react";
import { createWishAction, type CreateWishState } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { WishMedia } from "@/lib/validations/wish";

export default function NewWishPage() {
  const [state, formAction, isPending] = useActionState<
    CreateWishState,
    FormData
  >(createWishAction, undefined);
  const [media, setMedia] = useState<WishMedia[]>([]);
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-heading text-3xl mb-1">Leave your wish</h1>
      <p className="text-muted-foreground mb-8">
        Photos, a video, a message — whatever feels right.
      </p>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="media" value={JSON.stringify(media)} />

        <div className="space-y-2">
          <Label>Photos / video (optional)</Label>
          {media.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {media.map((item, index) => (
                <div
                  key={item.url}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
                >
                  {item.type === "IMAGE" ? (
                    <Image
                      src={item.url}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="size-full object-cover"
                      muted
                    />
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setMedia((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {uploadPreset ? (
            media.length < 6 && (
              <CldUploadWidget
                uploadPreset={uploadPreset}
                options={{
                  multiple: true,
                  maxFiles: 6 - media.length,
                  sources: ["local"],
                  clientAllowedFormats: [
                    "png",
                    "jpg",
                    "jpeg",
                    "webp",
                    "mp4",
                    "mov",
                    "webm",
                  ],
                  maxFileSize: 25_000_000,
                }}
                onSuccess={(results) => {
                  const info = results.info;
                  if (info && typeof info === "object" && "secure_url" in info) {
                    setMedia((prev) => [
                      ...prev,
                      {
                        url: info.secure_url ?? "",
                        type: info.resource_type === "video" ? "VIDEO" : "IMAGE",
                      },
                    ]);
                  }
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => open()}
                    className="gap-2"
                  >
                    <ImagePlus className="size-4" />
                    <VideoIcon className="size-4" />
                    Add photos or a video
                  </Button>
                )}
              </CldUploadWidget>
            )
          ) : (
            <p className="text-xs text-muted-foreground">
              Media uploads aren&apos;t configured yet — you can still leave a
              written wish below.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="caption">Your message (optional)</Label>
          <Textarea
            id="caption"
            name="caption"
            maxLength={1000}
            rows={5}
            placeholder="Write your birthday wish..."
          />
        </div>

        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Posting…" : "Post my wish"}
        </Button>
      </form>
    </div>
  );
}
