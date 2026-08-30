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
  title: string;
  description: string | null;
  coverUrl: string | null;
  difficulty: Difficulty;
  isFree: boolean;
  cardCount: number;
  ratingAverage: number;
  ratingCount: number;
  category: { id: string; name: string; slug: string };
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
