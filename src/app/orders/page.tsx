import type { Metadata } from "next";
import { OrdersList } from "@/features/orders/orders-list/orders-list";

export const metadata: Metadata = {
  title: "Purchase history — AI Study Assistant",
};

export default function OrdersPage() {
  return <OrdersList />;
}
