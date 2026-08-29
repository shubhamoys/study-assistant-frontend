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
  query Decks($categoryId: ID) {
    decks(categoryId: $categoryId) {
      id
      title
      description
      coverUrl
      difficulty
      isFree
      cardCount
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
      createdAt
      category {
        id
        name
        slug
      }
    }
  }
`;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface DeckSummary {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  difficulty: Difficulty;
  isFree: boolean;
  cardCount: number;
  category: { id: string; name: string; slug: string };
}

export interface DeckDetail extends DeckSummary {
  price: number;
  downloadsCount: number;
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
}

export interface CategoriesQueryData {
  categories: Category[];
}

export interface DecksQueryData {
  decks: DeckSummary[];
}

export interface DecksQueryVars {
  categoryId?: string;
}

export interface DeckQueryData {
  deck: DeckDetail;
}

export interface DeckQueryVars {
  id: string;
}
