"use client";

import { createConfig, regtest, snap } from "@midl-xyz/midl-js-core";
import { VStack } from "styled-system/jsx";
import { Button, Card } from "~/shared/ui/components";

const config = createConfig({
  chain: {
    chainId: 11155111,
    rpcUrls: ["https://rpc2.sepolia.org"],
  },
  networks: [regtest],
  connectors: [snap()],
});

export const HomePage = () => {
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
          <Button onClick={onConnect}>Connect to Snap</Button>
        </Card.Body>
      </Card.Root>
    </VStack>
  );
};
