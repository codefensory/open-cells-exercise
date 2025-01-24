import { QueryCache, QueryClient } from '@tanstack/query-core';

export const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  defaultOptions: {
    queries: {
      staleTime: 5000,
    },
  },
});
