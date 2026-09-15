import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./use-auth";

/**
 * Guards a page that requires a signed-in user. Redirects to `/login` (with
 * `reason=auth-required` + `redirect=<current path>` so LoginForm can show a
 * message and send the user back afterward) once rehydration has settled and
 * there's still no token — never before `hydrated` is true, or a page would
 * flash a redirect for a user who's actually logged in but hasn't rehydrated
 * yet on first paint.
 *
 * Returns `isReady` — callers should render nothing (or a loading state)
 * until it's true, so protected content never flashes before the redirect.
 */
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hydrated } = useAuth();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      const params = new URLSearchParams({
        reason: "auth-required",
        redirect: pathname,
      });
      router.replace(`/login?${params.toString()}`);
    }
  }, [hydrated, isAuthenticated, router, pathname]);

  return { isReady: hydrated && isAuthenticated };
}
