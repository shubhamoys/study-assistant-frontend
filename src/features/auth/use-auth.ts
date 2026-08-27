import { useAppSelector } from "@/lib/redux-hooks";

export function useAuth() {
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  return { token, user, hydrated, isAuthenticated: Boolean(token) };
}
