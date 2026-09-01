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
// No `difficulty` — a custom deck never has one (see the Phase 3
// decision-log entry in AGENT_CONTEXT.md). `categoryId` is optional; an
// empty-string select value is normalized to `undefined` before submit.
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
  categoryId: z
    .string()
    .optional()
    .transform((value) => value || undefined),
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

// The .deck.json file shape written by src/lib/deck-export.ts's
// `downloadDeckExport` and read back by its `parseDeckExportFile` — kept
// here so it's validated the same way as everything else user-supplied.
export const deckExportFileSchema = z.object({
  format: z.literal("study-assistant-deck"),
  version: z.literal(1),
  deck: z.object({
    title: z.string().min(1).max(255),
    description: z.string().max(2000).nullable().optional(),
    coverUrl: z.string().max(512).nullable().optional(),
    categoryId: z.string().nullable().optional(),
    difficulty: z
      .enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
      .nullable()
      .optional(),
  }),
  flashcards: z.array(
    z.object({
      front: z.string().min(1).max(5000),
      back: z.string().min(1).max(5000),
      orderIndex: z.number().int().min(0).optional(),
    }),
  ),
});

export type DeckExportFile = z.infer<typeof deckExportFileSchema>;
