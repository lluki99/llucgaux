import { QueryClient } from '@tanstack/react-query';

// Shared React Query client instance for the app shell.
export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});