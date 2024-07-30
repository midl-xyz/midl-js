import { createConfig, regtest, snap } from "@midl-xyz/midl-js-core";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { VStack } from "styled-system/jsx";
import { Button, Card } from "~/shared/ui/components";

const config = createConfig({
  chain: {
    chainId: 11155111,
    rpcUrls: ["https://rpc2.sepolia.org"],
  },
  networks: [regtest],
  persist: true,
  connectors: [snap()],
});

export const HomePage = () => {
  const [address, setAddress] = useState<string | undefined>();

  useEffect(() => {
    const [snapConnector] = config.connectors;

    try {
      const publicKey = snapConnector.getAccount();
      console.log(publicKey);
      setAddress(publicKey.address);
    } catch (error) {
      console.log(error);
    }

    return config.subscribe(newState => {
      setAddress(newState?.publicKey);
    });
  });

  const onConnect = async () => {
    const [snapConnector] = config.connectors;
    await snapConnector.connect();
  };

  return (
    <VStack height="100%" alignItems="center" justifyContent="center">
      <Card.Root width="xl">
        <Card.Header>
          <Card.Title>Midl.JS Playground</Card.Title>
        </Card.Header>
        <Card.Body>
          {address ? (
            <Card.Description>
              Connected to Snap with address: {address}
            </Card.Description>
          ) : (
            <Card.Description>Not connected to Snap</Card.Description>
          )}

          <Button onClick={onConnect}>Connect to Snap</Button>
        </Card.Body>
      </Card.Root>
    </VStack>
  );
};
