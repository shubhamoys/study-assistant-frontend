import type { Metadata } from "next";
import { OrderConfirmation } from "@/features/orders/order-confirmation/order-confirmation";

export const metadata: Metadata = {
  title: "Order — StudyLoop",
};

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  return <OrderConfirmation orderId={orderId} />;
}
