import { z } from "zod";

// Mirrors study-assistant-backend's CreateReviewInput/UpdateReviewInput
// validation (src/app-modules/reviews/dto/) — keep in sync.
export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Pick a star rating")
    .max(5, "Pick a star rating"),
  comment: z
    .string()
    .max(1000, "Comment must be at most 1000 characters long")
    .optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
