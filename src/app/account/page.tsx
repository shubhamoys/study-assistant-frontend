import type { Metadata } from "next";
import { AccountView } from "@/features/account/account-view/account-view";

export const metadata: Metadata = {
  title: "Account — StudyLoop",
};

export default function AccountPage() {
  return <AccountView />;
}
