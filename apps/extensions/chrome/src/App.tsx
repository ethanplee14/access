import React from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "./utils/trpc";
import configs from "../configs.json";
import Resource from "./resource";
import superjson from "superjson";
import { checkLoggedIn } from "./utils/auth";

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      url: configs.ACCESS_URL + "/api/trpc",
    })
  );

  checkLoggedIn().then((loggedIn) => {
    if (!loggedIn) {
      chrome.tabs.create({ url: configs.ACCESS_URL });
    }
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Resource />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
