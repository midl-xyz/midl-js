import { createContext } from "react";

export const MidlContext = createContext();

export const MidlProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <MidlContext.Provider value={{}}>{children}</MidlContext.Provider>;
};
