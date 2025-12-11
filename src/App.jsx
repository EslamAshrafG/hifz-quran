import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./Layout";
import { Toaster } from "sonner";
import { AppProvider } from "./AppContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Layout />
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
