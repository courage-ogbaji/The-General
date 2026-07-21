import { z } from "zod";

export const commentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Write something before replying.")
    .max(500, "Reply is too long."),
});
