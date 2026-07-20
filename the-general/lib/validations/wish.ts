import { z } from "zod";

export const wishMediaSchema = z.object({
  url: z.url(),
  type: z.enum(["IMAGE", "VIDEO"]),
});

export const wishSchema = z
  .object({
    caption: z.string().trim().max(1000, "Message is too long").optional(),
    media: z.array(wishMediaSchema).max(6, "Up to 6 photos/videos per wish"),
  })
  .refine((data) => Boolean(data.caption) || data.media.length > 0, {
    message: "Add a photo/video or write a message.",
  });

export type WishMedia = z.infer<typeof wishMediaSchema>;
