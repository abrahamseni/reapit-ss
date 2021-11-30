import * as React from "react";
import Router from "./router";
import ErrorBoundary from "../components/hocs/error-boundary";
import { MediaStateProvider, NavStateProvider } from "@reapit/elements";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import "@reapit/elements/dist/index.css";

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={new QueryClient()}>
        <NavStateProvider>
          <MediaStateProvider>
            <Router />
          </MediaStateProvider>
        </NavStateProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
