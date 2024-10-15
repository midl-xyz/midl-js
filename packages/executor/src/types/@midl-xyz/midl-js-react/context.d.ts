import "@midl-xyz/midl-js-react";

declare module "@midl-xyz/midl-js-react" {
  type State = {
    readonly wallet?: {
      [key: string]: { nonce: number; transactions: string[] };
    };
  };

  export interface MidlContextState extends State {}
}
