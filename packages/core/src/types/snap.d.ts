import type {
  EIP6963AnnounceProviderEvent,
  EIP6963RequestProviderEvent,
  MetaMaskInpageProvider,
} from "@metamask/providers";

/*
 * Window type extension to support ethereum
 */
declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider & {
      setProvider?: (provider: MetaMaskInpageProvider) => void;
      detected?: MetaMaskInpageProvider[];
      providers?: MetaMaskInpageProvider[];
    };
  }

  export type GetSnapsResponse = Record<string, Snap>;

  export type Snap = {
    permissionName: string;
    id: string;
    version: string;
    initialPermissions: Record<string, unknown>;
  };

  interface WindowEventMap {
    "eip6963:requestProvider": EIP6963RequestProviderEvent;
    "eip6963:announceProvider": EIP6963AnnounceProviderEvent;
  }
}
