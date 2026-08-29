import type { Metadata } from "next";
import { StoreBrowser } from "@/features/store/store-browser";

export const metadata: Metadata = {
  title: "Store — AI Study Assistant",
};

export default function StorePage() {
  return <StoreBrowser />;
}
