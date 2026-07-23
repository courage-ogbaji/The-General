import { z } from "zod";

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  bio: z.string().trim().max(280, "Bio is too long").optional().or(z.literal("")),
  location: z.string().trim().max(100, "Location is too long").optional().or(z.literal("")),
  phone: z.string().trim().max(30, "Phone number is too long").optional().or(z.literal("")),
  profilePhotoUrl: z.url().optional().or(z.literal("")),
});
