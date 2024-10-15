import { useMidlContext } from "@midl-xyz/midl-js-react";
import { useAccount } from "wagmi";

export const useIncrementNonce = () => {
  const { state, setState } = useMidlContext();
  const { address } = useAccount();

  return () => {
    if (!address) {
      return;
    }

    const nonce = state.wallet?.[address]?.nonce ?? 0;

    setState({
      ...state,
      wallet: {
        ...state.wallet,
        [address]: {
          nonce: nonce + 1,
          transactions: state.wallet?.[address]?.transactions ?? [],
        },
      },
    });
  };
};
