import type { Metadata } from "next";
import { LibraryBrowser } from "@/features/library/library-browser";

export const metadata: Metadata = {
  title: "Library — AI Study Assistant",
};

export default function LibraryPage() {
  return <LibraryBrowser />;
}
