import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { getAccessToken } from "@/lib/auth-token";

const httpLink = new HttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql",
});

// Phase 1 auth: attach the Bearer token (if any) to every request.
const authLink = new SetContextLink((prevContext) => {
  const token = getAccessToken();
  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const errorLink = new ErrorLink(({ error }) => {
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
