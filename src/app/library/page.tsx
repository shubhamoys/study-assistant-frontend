import type { Metadata } from "next";
import { LibraryBrowser } from "@/features/library/library-browser/library-browser";

export const metadata: Metadata = {
  title: "Library — StudyLoop",
};

export default function LibraryPage() {
  return <LibraryBrowser />;
}
