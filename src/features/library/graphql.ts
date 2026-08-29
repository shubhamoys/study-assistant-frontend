import { gql } from "@apollo/client";
import type { DeckSummary } from "../store/graphql";

export const MY_LIBRARY_QUERY = gql`
  query MyLibrary {
    myLibrary {
      id
      lastStudiedAt
      createdAt
      deck {
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
  }
`;

export const ADD_DECK_TO_LIBRARY_MUTATION = gql`
  mutation AddDeckToLibrary($deckId: ID!) {
    addDeckToLibrary(deckId: $deckId) {
      id
      deck {
        id
      }
    }
  }
`;

export const REMOVE_DECK_FROM_LIBRARY_MUTATION = gql`
  mutation RemoveDeckFromLibrary($deckId: ID!) {
    removeDeckFromLibrary(deckId: $deckId)
  }
`;

export interface LibraryEntry {
  id: string;
  lastStudiedAt: string | null;
  createdAt: string;
  deck: DeckSummary;
}

export interface MyLibraryQueryData {
  myLibrary: LibraryEntry[];
}

export interface AddDeckToLibraryData {
  addDeckToLibrary: { id: string; deck: { id: string } };
}

export interface AddDeckToLibraryVars {
  deckId: string;
}

export interface RemoveDeckFromLibraryData {
  removeDeckFromLibrary: boolean;
}

export interface RemoveDeckFromLibraryVars {
  deckId: string;
}
