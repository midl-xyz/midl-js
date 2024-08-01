import type { Config } from "@midl-xyz/midl-js-core";
import { createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type MidlContextType = {
  readonly config: Config;
};

export const MidlContext = createContext<MidlContextType>({
  config: {} as Config,
});

export const useMidlContext = () => {
  return useContext(MidlContext);
};

export const MidlProvider = ({
  config,
  children,
}: Readonly<{
  config: Config;
  children: React.ReactNode;
}>) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MidlContext.Provider
        value={{
          config,
          //   state,
        }}
      >
        {children}
      </MidlContext.Provider>
    </QueryClientProvider>
  );
};
