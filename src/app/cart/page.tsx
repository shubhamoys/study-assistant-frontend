import type { Metadata } from "next";
import { CartView } from "@/features/cart/cart-view/cart-view";

export const metadata: Metadata = {
  title: "Cart — AI Study Assistant",
};

export default function CartPage() {
  return <CartView />;
}
