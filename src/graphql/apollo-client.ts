import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { Observable } from "rxjs";
import { GRAPHQL_URL } from "@/lib/graphql-endpoint";
import { getAccessToken } from "@/lib/auth-token";
import { refreshAccessToken } from "@/lib/token-refresh";

const httpLink = new HttpLink({ uri: GRAPHQL_URL });

// Attach the Bearer access token (if any) to every request.
const authLink = new SetContextLink((prevContext) => {
  const token = getAccessToken();
  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

// login/register can legitimately fail with UNAUTHENTICATED (wrong
// password) — that's not an expired-session case, so never route those
// through the refresh-and-retry flow below.
const OPERATIONS_EXEMPT_FROM_REFRESH = new Set(["Login", "Register"]);

/**
 * On a 401 from an expired access token, silently refresh (see
 * token-refresh.ts) and retry the operation once with the new token — most
 * users should never see a session hiccup just because 15 minutes passed
 * mid-session. `isRetry` on the operation context stops this from looping if
 * the retried request is *also* rejected (refresh token itself expired) or
 * that the retried operation is a Login/Register.
 */
const errorLink = new ErrorLink(({ error, operation, forward }) => {
  const isUnauthenticated =
    CombinedGraphQLErrors.is(error) &&
    error.errors.some((e) => e.extensions?.code === "UNAUTHENTICATED");

  if (
    isUnauthenticated &&
    !operation.getContext().isRetry &&
    !OPERATIONS_EXEMPT_FROM_REFRESH.has(operation.operationName ?? "")
  ) {
    return new Observable((observer) => {
      refreshAccessToken()
        .then((newAccessToken) => {
          if (!newAccessToken) {
            observer.error(error);
            return;
          }
          operation.setContext((prevContext: Record<string, unknown>) => ({
            ...prevContext,
            isRetry: true,
            headers: {
              ...(prevContext.headers as Record<string, string> | undefined),
              authorization: `Bearer ${newAccessToken}`,
            },
          }));
          forward(operation).subscribe(observer);
        })
        .catch(() => observer.error(error));
    });
  }

  // Expected business errors (invalid credentials, validation, conflicts)
  // arrive as CombinedGraphQLErrors and are already surfaced to the user by
  // whichever component's mutation/query `error` handled them — logging
  // those here too just makes Next's dev overlay flag routine, handled
  // errors as "Issues". Only log what the UI didn't already account for.
  if (
    process.env.NODE_ENV !== "production" &&
    !CombinedGraphQLErrors.is(error)
  ) {
    console.error("[GraphQL network/protocol error]", error);
  }
});

export function makeApolloClient() {
  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });
}
