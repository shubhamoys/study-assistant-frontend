import type { Metadata } from "next";
import { CartView } from "@/features/cart/cart-view/cart-view";

export const metadata: Metadata = {
  title: "Cart — StudyLoop",
};

export default function CartPage() {
  return <CartView />;
}
