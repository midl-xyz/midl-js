import { HStack, VStack } from "styled-system/jsx";
import { Button, Card, Text } from "~/shared/ui/components";
import {
  useConnect,
  useAccount,
  useDisconnect,
  useUnsafeSignMessage,
  useMidlContext,
} from "@midl-xyz/midl-js-react";
import { css } from "styled-system/css";
import { AddressPurpose } from "@midl-xyz/midl-js-core";

export const HomePage = () => {
  const { mutateAsync } = useConnect({
    purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
  });
  const { data: account } = useAccount();
  const { mutateAsync: disconnect } = useDisconnect();
  const {
    mutateAsync: unsafeSignMessage,
    data,
    isPending,
  } = useUnsafeSignMessage();
  const { config } = useMidlContext();

  const onConnect = (id?: string) => {
    mutateAsync({ id });
  };

  const onDisconnect = () => {
    disconnect();
  };

  const onSignMessage = () => {
    unsafeSignMessage("Hello, Midl!");
  };

  return (
    <VStack height="100%" alignItems="center" justifyContent="center">
      <Card.Root width="xl">
        <Card.Header>
          <Card.Title>Midl.JS Playground</Card.Title>
        </Card.Header>
        <Card.Body>
          {account ? (
            <Card.Description>
              Connected to Snap with address: {account[0].address}
            </Card.Description>
          ) : (
            <Card.Description>Not connected to Snap</Card.Description>
          )}

          {data && (
            <VStack gap={4} mt={8}>
              <Text>Signed result:</Text>
              <code
                className={css({
                  bg: "bg.subtle",
                  p: 4,
                  borderRadius: "md",
                  color: "fg.subtle",
                  whiteSpace: "pre-wrap",
                  maxWidth: "100%",
                  wordBreak: "break-all",
                  fontSize: "xs",
                })}
              >
                {JSON.stringify(data, null, 4)}
              </code>
            </VStack>
          )}
        </Card.Body>
        <Card.Footer>
          <HStack flexWrap="wrap">
            {account && (
              <Button onClick={onSignMessage} loading={isPending}>
                Sign message
              </Button>
            )}

            {!account &&
              config.connectors.map(it => (
                <Button key={it.id} onClick={() => onConnect(it.id)}>
                  Connect {it.name}
                </Button>
              ))}

            {account && <Button onClick={onDisconnect}>Disconnect</Button>}
          </HStack>
        </Card.Footer>
      </Card.Root>
    </VStack>
  );
};
