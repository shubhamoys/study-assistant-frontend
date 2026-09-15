import { useAppSelector } from "@/lib/redux-hooks";

export function useAuth() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  return {
    accessToken,
    user,
    hydrated,
    isAuthenticated: Boolean(accessToken),
  };
}
