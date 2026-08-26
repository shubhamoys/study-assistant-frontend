"use client";

import { ApolloProvider } from "./apollo-provider";
import { ReduxProvider } from "./redux-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ReduxProvider>
        <ApolloProvider>{children}</ApolloProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
