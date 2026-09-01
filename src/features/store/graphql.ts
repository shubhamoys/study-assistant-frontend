import { gql } from "@apollo/client";

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
      slug
      description
    }
  }
`;

export const DECKS_QUERY = gql`
  query Decks(
    $categoryId: ID
    $search: String
    $difficulty: Difficulty
    $sort: DeckSortOrder
  ) {
    decks(
      categoryId: $categoryId
      search: $search
      difficulty: $difficulty
      sort: $sort
    ) {
      id
      authorId
      title
      description
      coverUrl
      difficulty
      isFree
      cardCount
      ratingAverage
      ratingCount
      category {
        id
        name
        slug
      }
    }
  }
`;

export const DECK_QUERY = gql`
  query Deck($id: ID!) {
    deck(id: $id) {
      id
      authorId
      title
      description
      coverUrl
      difficulty
      isFree
      price
      cardCount
      downloadsCount
      ratingAverage
      ratingCount
      authorDisplayName
      estimatedStudyMinutes
      createdAt
      category {
        id
        name
        slug
      }
    }
  }
`;

export const MY_DECKS_QUERY = gql`
  query MyDecks {
    myDecks {
      id
      authorId
      title
      description
      coverUrl
      difficulty
      isFree
      cardCount
      ratingAverage
      ratingCount
      category {
        id
        name
        slug
      }
    }
  }
`;

export const DECK_FLASHCARDS_QUERY = gql`
  query DeckFlashcards($deckId: ID!) {
    deckFlashcards(deckId: $deckId) {
      id
      front
      back
      orderIndex
      createdAt
    }
  }
`;

export const CREATE_DECK_MUTATION = gql`
  mutation CreateDeck($input: CreateDeckInput!) {
    createDeck(input: $input) {
      id
      authorId
      title
    }
  }
`;

export const IMPORT_DECK_MUTATION = gql`
  mutation ImportDeck($input: ImportDeckInput!) {
    importDeck(input: $input) {
      id
      authorId
      title
    }
  }
`;

export const UPDATE_DECK_MUTATION = gql`
  mutation UpdateDeck($id: ID!, $input: UpdateDeckInput!) {
    updateDeck(id: $id, input: $input) {
      id
      title
      description
      coverUrl
      difficulty
      category {
        id
        name
        slug
      }
    }
  }
`;

export const DELETE_DECK_MUTATION = gql`
  mutation DeleteDeck($id: ID!) {
    deleteDeck(id: $id)
  }
`;

export const CREATE_FLASHCARD_MUTATION = gql`
  mutation CreateFlashcard($input: CreateFlashcardInput!) {
    createFlashcard(input: $input) {
      id
      front
      back
      orderIndex
      createdAt
    }
  }
`;

export const UPDATE_FLASHCARD_MUTATION = gql`
  mutation UpdateFlashcard($id: ID!, $input: UpdateFlashcardInput!) {
    updateFlashcard(id: $id, input: $input) {
      id
      front
      back
      orderIndex
      createdAt
    }
  }
`;

export const DELETE_FLASHCARD_MUTATION = gql`
  mutation DeleteFlashcard($id: ID!) {
    deleteFlashcard(id: $id)
  }
`;

export const DECK_REVIEWS_QUERY = gql`
  query DeckReviews($deckId: ID!) {
    deckReviews(deckId: $deckId) {
      id
      userId
      authorDisplayName
      authorAvatarUrl
      rating
      comment
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_REVIEW_MUTATION = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      userId
      authorDisplayName
      authorAvatarUrl
      rating
      comment
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_REVIEW_MUTATION = gql`
  mutation UpdateReview($id: ID!, $input: UpdateReviewInput!) {
    updateReview(id: $id, input: $input) {
      id
      userId
      authorDisplayName
      authorAvatarUrl
      rating
      comment
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_REVIEW_MUTATION = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type DeckSortOrder = "NEWEST" | "RATING" | "DOWNLOADS" | "TITLE";

export interface DeckSummary {
  id: string;
  authorId: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  difficulty: Difficulty | null;
  isFree: boolean;
  cardCount: number;
  ratingAverage: number;
  ratingCount: number;
  category: { id: string; name: string; slug: string } | null;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  orderIndex: number;
  createdAt: string;
}

export interface DeckDetail extends DeckSummary {
  price: number;
  downloadsCount: number;
  authorDisplayName: string;
  estimatedStudyMinutes: number;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  authorDisplayName: string;
  authorAvatarUrl: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesQueryData {
  categories: Category[];
}

export interface DecksQueryData {
  decks: DeckSummary[];
}

export interface DecksQueryVars {
  categoryId?: string;
  search?: string;
  difficulty?: Difficulty;
  sort?: DeckSortOrder;
}

export interface DeckQueryData {
  deck: DeckDetail;
}

export interface DeckQueryVars {
  id: string;
}

export interface DeckReviewsQueryData {
  deckReviews: Review[];
}

export interface DeckReviewsQueryVars {
  deckId: string;
}

export interface CreateReviewMutationData {
  createReview: Review;
}

export interface CreateReviewMutationVars {
  input: { deckId: string; rating: number; comment?: string };
}

export interface UpdateReviewMutationData {
  updateReview: Review;
}

export interface UpdateReviewMutationVars {
  id: string;
  input: { rating?: number; comment?: string };
}

export interface DeleteReviewMutationData {
  deleteReview: boolean;
}

export interface DeleteReviewMutationVars {
  id: string;
}

export interface MyDecksQueryData {
  myDecks: DeckSummary[];
}

export interface DeckFlashcardsQueryData {
  deckFlashcards: Flashcard[];
}

export interface DeckFlashcardsQueryVars {
  deckId: string;
}

export interface DeckInput {
  title: string;
  description?: string;
  coverUrl?: string;
  categoryId?: string;
}

export interface CreateDeckMutationData {
  createDeck: { id: string; authorId: string; title: string };
}

export interface CreateDeckMutationVars {
  input: DeckInput;
}

export interface UpdateDeckMutationData {
  updateDeck: {
    id: string;
    title: string;
    description: string | null;
    coverUrl: string | null;
    difficulty: Difficulty | null;
    category: { id: string; name: string; slug: string } | null;
  };
}

export interface UpdateDeckMutationVars {
  id: string;
  input: Partial<DeckInput>;
}

export interface ImportDeckInput extends DeckInput {
  difficulty?: Difficulty;
  flashcards: { front: string; back: string; orderIndex?: number }[];
}

export interface ImportDeckMutationData {
  importDeck: { id: string; authorId: string; title: string };
}

export interface ImportDeckMutationVars {
  input: ImportDeckInput;
}

export interface DeleteDeckMutationData {
  deleteDeck: boolean;
}

export interface DeleteDeckMutationVars {
  id: string;
}

export interface FlashcardInput {
  front: string;
  back: string;
  orderIndex?: number;
}

export interface CreateFlashcardMutationData {
  createFlashcard: Flashcard;
}

export interface CreateFlashcardMutationVars {
  input: FlashcardInput & { deckId: string };
}

export interface UpdateFlashcardMutationData {
  updateFlashcard: Flashcard;
}

export interface UpdateFlashcardMutationVars {
  id: string;
  input: Partial<FlashcardInput>;
}

export interface DeleteFlashcardMutationData {
  deleteFlashcard: boolean;
}

export interface DeleteFlashcardMutationVars {
  id: string;
}
