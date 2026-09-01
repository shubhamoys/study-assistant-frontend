import {
  deckExportFileSchema,
  type DeckExportFile,
} from "@/features/store/schemas";
import type { DeckSummary, Flashcard, ImportDeckInput } from "@/features/store/graphql";

const DECK_EXPORT_FORMAT = "study-assistant-deck" as const;
const DECK_EXPORT_VERSION = 1 as const;

function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "deck";
}

/**
 * `coverUrl` and any image embedded in the markdown content are stored as
 * relative `/uploads/...` paths on THIS backend — they resolve correctly for
 * anyone importing on the same instance, but would 404 on a different
 * deployment. Acceptable for now (same category of limitation as orphaned
 * attachments — see progress.md); not worth bundling images as base64 for
 * an MVP export feature.
 */
export function buildDeckExport(
  deck: Pick<DeckSummary, "title" | "description" | "coverUrl" | "difficulty" | "category">,
  flashcards: Pick<Flashcard, "front" | "back" | "orderIndex">[],
): DeckExportFile {
  return {
    format: DECK_EXPORT_FORMAT,
    version: DECK_EXPORT_VERSION,
    deck: {
      title: deck.title,
      description: deck.description,
      coverUrl: deck.coverUrl,
      categoryId: deck.category?.id ?? null,
      difficulty: deck.difficulty,
    },
    flashcards: flashcards
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((card) => ({
        front: card.front,
        back: card.back,
        orderIndex: card.orderIndex,
      })),
  };
}

/** Builds the export file and triggers a browser download of it — no server round-trip, the client already has everything it needs. */
export function downloadDeckExport(
  deck: Pick<DeckSummary, "title" | "description" | "coverUrl" | "difficulty" | "category">,
  flashcards: Pick<Flashcard, "front" | "back" | "orderIndex">[],
): void {
  const file = buildDeckExport(deck, flashcards);
  const blob = new Blob([JSON.stringify(file, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(deck.title)}.deck.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export type ParseDeckExportResult =
  | { ok: true; input: ImportDeckInput }
  | { ok: false; error: string };

/** Reads and validates a `.deck.json` file, returning a ready-to-send `importDeck` input. */
export async function parseDeckExportFile(
  file: File,
): Promise<ParseDeckExportResult> {
  let raw: unknown;
  try {
    raw = JSON.parse(await file.text());
  } catch {
    return { ok: false, error: "That file isn't valid JSON." };
  }

  const result = deckExportFileSchema.safeParse(raw);
  if (!result.success) {
    return {
      ok: false,
      error: "That file isn't a Study Assistant deck export.",
    };
  }

  const { deck, flashcards } = result.data;
  return {
    ok: true,
    input: {
      title: deck.title,
      description: deck.description ?? undefined,
      coverUrl: deck.coverUrl ?? undefined,
      categoryId: deck.categoryId ?? undefined,
      difficulty: deck.difficulty ?? undefined,
      flashcards: flashcards.map((card) => ({
        front: card.front,
        back: card.back,
        orderIndex: card.orderIndex,
      })),
    },
  };
}
