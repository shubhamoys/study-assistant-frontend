import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./use-auth";

/** Sends an already-logged-in visitor away from /login or /register. */
export function useRedirectIfAuthenticated(to = "/") {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuth();

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace(to);
    }
  }, [hydrated, isAuthenticated, router, to]);
}
