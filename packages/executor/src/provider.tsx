import { mock } from 'wagmi/connectors';
import { useEffect } from 'react';
import { useConnect } from 'wagmi';
import { useEVMAddress } from '~/hooks';

export const WagmiMidlProvider = () => {
  const evmAddress = useEVMAddress();
  const { connect } = useConnect();

  useEffect(() => {
    connect({ connector: mock({ accounts: [evmAddress] }) });
  }, [evmAddress, connect]);

  return null;
};
