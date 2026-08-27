"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { clearCredentials, setUser } from "@/features/auth/auth-slice";
import { ME_QUERY, type MeQueryData } from "@/features/auth/graphql";
import { useAppDispatch } from "@/lib/redux-hooks";
import { useAuth } from "@/features/auth/use-auth";

/**
 * localStorage only stores the access token (see auth-token.ts), not the
 * user's details — after a token is rehydrated into Redux on page load, fetch
 * `me` to populate `user`. If the token turns out to be expired/invalid, log
 * out cleanly instead of leaving a token in state that the API is rejecting.
 */
export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { token, user, hydrated } = useAuth();

  const { data, error } = useQuery<MeQueryData>(ME_QUERY, {
    skip: !hydrated || !token || Boolean(user),
  });

  useEffect(() => {
    if (data?.me) {
      dispatch(setUser(data.me));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(clearCredentials());
    }
  }, [error, dispatch]);

  return children;
}
