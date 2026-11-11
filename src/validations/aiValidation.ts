import { z } from "zod";

export const bookDescriptionSchema = z.object({
  body: z.object({
    title: z.string({ error: "Book title is required" }).trim().min(1, "Book title is required").max(200, "Book title is too long"),
    author: z.string().trim().max(200, "Author name is too long").optional(),
  }),
});

export type BookDescriptionInput = z.infer<typeof bookDescriptionSchema>["body"];
