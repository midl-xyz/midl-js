import type { Config, ConfigAtom } from "@midl-xyz/midl-js-core";
import { createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtom } from "jotai";

type MidlContextType = {
  readonly config: Config;
  //   readonly state: ConfigAtom;
};

export const MidlContext = createContext<MidlContextType>({
  config: {} as Config,
  //   state: {} as ConfigAtom,
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
  //   const [state] = useAtom(config._internal.configAtom);
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
