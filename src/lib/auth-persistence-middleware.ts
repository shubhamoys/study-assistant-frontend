import type { Middleware } from "@reduxjs/toolkit";
import {
  clearCredentials,
  setCredentials,
} from "@/features/auth/auth-slice";
import { setAccessToken } from "./auth-token";

/**
 * Keeps localStorage in sync with the auth slice. Lives in middleware rather
 * than the reducer so reducers stay pure — this is the one place that talks
 * to localStorage on write.
 */
export const authPersistenceMiddleware: Middleware =
  () => (next) => (action) => {
    const result = next(action);

    if (setCredentials.match(action)) {
      setAccessToken(action.payload.token);
    } else if (clearCredentials.match(action)) {
      setAccessToken(null);
    }

    return result;
  };
