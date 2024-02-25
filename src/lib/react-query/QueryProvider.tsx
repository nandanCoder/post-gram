import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClint = new QueryClient();

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClint}>{children}</QueryClientProvider>
  );
};
