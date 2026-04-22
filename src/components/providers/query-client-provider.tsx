"use client";

import * as React from "react";
import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from "@tanstack/react-query";

type AppQueryClientProviderProps = {
  children: React.ReactNode;
  config?: QueryClientConfig;
};

function makeQueryClient(config?: QueryClientConfig) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
    ...config,
  });
}

export function AppQueryClientProvider({
  children,
  config,
}: AppQueryClientProviderProps) {
  const [queryClient] = React.useState(() => makeQueryClient(config));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
