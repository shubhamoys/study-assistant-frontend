import { gql } from "@apollo/client";
import type { DeckSummary } from "../store/graphql";

const ORDER_FIELDS = `
  id
  status
  subtotalAmount
  discountAmount
  totalAmount
  couponCode
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
  mutation Checkout($couponCode: String) {
    checkout(couponCode: $couponCode) {
      orderId
      requiresPayment
      razorpayOrderId
      razorpayKeyId
      amount
      currency
    }
  }
`;

export const VERIFY_PAYMENT_MUTATION = gql`
  mutation VerifyPayment($input: VerifyPaymentInput!) {
    verifyPayment(input: $input) {
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

export const MY_ORDERS_QUERY = gql`
  query MyOrders {
    myOrders {
      ${ORDER_FIELDS}
    }
  }
`;

export const PREVIEW_COUPON_QUERY = gql`
  query PreviewCoupon($code: String!) {
    previewCoupon(code: $code) {
      code
      subtotalAmount
      discountAmount
      totalAmount
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
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  couponCode: string | null;
  currency: string;
  createdAt: string;
  items: OrderItem[];
}

export interface CheckoutSession {
  orderId: string;
  requiresPayment: boolean;
  razorpayOrderId: string | null;
  razorpayKeyId: string | null;
  amount: number;
  currency: string;
}

export interface CheckoutMutationData {
  checkout: CheckoutSession;
}

export interface CheckoutMutationVars {
  couponCode?: string;
}

export interface VerifyPaymentInput {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentMutationData {
  verifyPayment: Order;
}

export interface VerifyPaymentMutationVars {
  input: VerifyPaymentInput;
}

export interface OrderQueryData {
  order: Order;
}

export interface OrderQueryVars {
  id: string;
}

export interface MyOrdersQueryData {
  myOrders: Order[];
}

export interface CouponPreview {
  code: string;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
}

export interface PreviewCouponQueryData {
  previewCoupon: CouponPreview;
}

export interface PreviewCouponQueryVars {
  code: string;
}
