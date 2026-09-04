import { gql } from "@apollo/client";
import type { DeckSummary } from "../store/graphql";

const ORDER_FIELDS = `
  id
  status
  totalAmount
  currency
  createdAt
  items {
    id
    price
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
`;

export const CHECKOUT_MUTATION = gql`
  mutation Checkout {
    checkout {
      ${ORDER_FIELDS}
    }
  }
`;

export const ORDER_QUERY = gql`
  query Order($id: ID!) {
    order(id: $id) {
      ${ORDER_FIELDS}
    }
  }
`;

export type OrderStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface OrderItem {
  id: string;
  price: number;
  deck: DeckSummary;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  createdAt: string;
  items: OrderItem[];
}

export interface CheckoutMutationData {
  checkout: Order;
}

export interface OrderQueryData {
  order: Order;
}

export interface OrderQueryVars {
  id: string;
}
