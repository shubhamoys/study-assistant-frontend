import type { Metadata } from "next";
import { CheckoutView } from "@/features/checkout/checkout-view/checkout-view";

export const metadata: Metadata = {
  title: "Checkout — StudyLoop",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
