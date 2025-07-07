import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute: Data is fresh for 1 min
      cacheTime: 1000 * 60 * 5, // 5 minutes: Cache persists for 5 mins
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Prevent refetch on tab focus (optional)
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});

export default queryClient;