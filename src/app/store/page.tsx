import type { Metadata } from "next";
import { StoreBrowser } from "@/features/store/store-browser/store-browser";

export const metadata: Metadata = {
  title: "Store — StudyLoop",
};

export default function StorePage() {
  return <StoreBrowser />;
}
