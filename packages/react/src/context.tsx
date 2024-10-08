import type { Config } from "@midl-xyz/midl-js-core";
import { createContext, useContext, useState } from "react";

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface MidlContextState {}

export interface MidlContextType {
  readonly config: Config;
  readonly state: MidlContextState;
  setState: (state: MidlContextState) => void;
}

export const MidlContext = createContext<MidlContextType>({
  config: {} as Config,
  state: {},
  setState: () => {},
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
  const [state, setState] = useState<MidlContextState>({});

  return (
    <MidlContext.Provider
      value={{
        config,
        state,
        setState,
      }}
    >
      {children}
    </MidlContext.Provider>
  );
};
