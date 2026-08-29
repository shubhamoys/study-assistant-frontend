import type { Metadata } from "next";
import { AccountView } from "@/features/account/account-view";

export const metadata: Metadata = {
  title: "Account — AI Study Assistant",
};

export default function AccountPage() {
  return <AccountView />;
}
