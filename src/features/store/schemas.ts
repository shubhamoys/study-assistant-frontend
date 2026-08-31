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

// Mirrors CreateDeckInput/UpdateDeckInput
// (src/app-modules/store/dto/create-deck.input.ts, update-deck.input.ts).
export const deckSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(255, "Title must be at most 255 characters long"),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters long")
    .optional(),
  coverUrl: z.string().optional(),
  categoryId: z.string().min(1, "Choose a category"),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
    message: "Choose a difficulty",
  }),
});

export type DeckFormValues = z.infer<typeof deckSchema>;

// Mirrors CreateFlashcardInput/UpdateFlashcardInput.
export const flashcardSchema = z.object({
  front: z
    .string()
    .min(1, "Front cannot be empty")
    .max(5000, "Front must be at most 5000 characters long"),
  back: z
    .string()
    .min(1, "Back cannot be empty")
    .max(5000, "Back must be at most 5000 characters long"),
});

export type FlashcardFormValues = z.infer<typeof flashcardSchema>;
