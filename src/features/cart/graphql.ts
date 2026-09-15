import { gql } from "@apollo/client";
import type { DeckSummary } from "../store/graphql";

export const MY_CART_QUERY = gql`
  query MyCart {
    myCart {
      id
      createdAt
      deck {
        id
        title
        description
        coverUrl
        difficulty
        isFree
        price
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
  }
`;

export const ADD_DECK_TO_CART_MUTATION = gql`
  mutation AddDeckToCart($deckId: ID!) {
    addDeckToCart(deckId: $deckId) {
      id
      deck {
        id
      }
    }
  }
`;

export const REMOVE_DECK_FROM_CART_MUTATION = gql`
  mutation RemoveDeckFromCart($deckId: ID!) {
    removeDeckFromCart(deckId: $deckId)
  }
`;

export interface CartItem {
  id: string;
  createdAt: string;
  deck: DeckSummary;
}

export interface MyCartQueryData {
  myCart: CartItem[];
}

export interface AddDeckToCartData {
  addDeckToCart: { id: string; deck: { id: string } };
}

export interface AddDeckToCartVars {
  deckId: string;
}

export interface RemoveDeckFromCartData {
  removeDeckFromCart: boolean;
}

export interface RemoveDeckFromCartVars {
  deckId: string;
}
