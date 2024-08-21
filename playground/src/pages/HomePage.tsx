import { HStack, VStack } from "styled-system/jsx";
import { Button, Card, Text } from "~/shared/ui/components";
import {
  useConnect,
  useAccounts,
  useDisconnect,
  useMidlContext,
  useSignMessage,
  useUTXOs,
  useEdictRune,
  useEtchRune,
} from "@midl-xyz/midl-js-react";
import { css } from "styled-system/css";
import { AddressPurpose, broadcastTransaction } from "@midl-xyz/midl-js-core";

export const HomePage = () => {
  const { mutateAsync } = useConnect({
    purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
  });
  const { data: accounts, error } = useAccounts();
  const { mutateAsync: disconnect } = useDisconnect();

  const { config } = useMidlContext();
  const { mutateAsync: signMessage, data, isPending } = useSignMessage();

  const { mutateAsync: etchRune, data: etchRuneResult } = useEtchRune();
  const { mutateAsync: edictRune, data: edictRuneResult } = useEdictRune();

  const { data: utxos } = useUTXOs(accounts?.[0]?.address);

  const onConnect = (id?: string) => {
    mutateAsync({ id });
  };

  const onDisconnect = () => {
    disconnect();
  };

  const onSignMessage = () => {
    signMessage({ message: "Hello, Midl!" });
  };

  const onEtchRune = () => {
    etchRune();
  };

  const onBroadcast = () => {
    broadcastTransaction(config, etchRuneResult as unknown as string);
  };

  console.log("edictRuneResult", edictRuneResult);

  return (
    <VStack height="100%" alignItems="center" justifyContent="center">
      <Card.Root width="xl">
        <Card.Header>
          <Card.Title>Midl.JS Playground</Card.Title>
        </Card.Header>
        <Card.Body>
          {accounts ? (
            <Card.Description>
              Connected to Snap: {accounts.map(it => it.address).join(", ")}
            </Card.Description>
          ) : (
            <Card.Description>Not connected to Snap</Card.Description>
          )}

          {(data || etchRuneResult) && (
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
                {JSON.stringify(etchRuneResult, null, 4)}
              </code>
            </VStack>
          )}

          {error && (
            <Text color="red" mt={4}>
              {error.message}
            </Text>
          )}
        </Card.Body>
        <Card.Footer>
          <HStack flexWrap="wrap">
            {accounts && (
              <>
                <code className={css({ fontSize: "xs" })}>
                  UTXOs: {utxos?.length || 0}
                </code>
                <Button onClick={onEtchRune}>Etch Rune</Button>

                <Button
                  onClick={() =>
                    edictRune({
                      runeId: "2873407:1535",
                      receiver:
                        "tb1p22w0r4lwjfw7frr66ghvrqweaznh2sx4cjw20lke0wldjq0up32stlzlp4",
                      amount: 1,
                    })
                  }
                >
                  Edict Rune
                </Button>

                <Button onClick={onBroadcast}>Broadcast</Button>

                <Button onClick={onSignMessage} loading={isPending}>
                  Sign message
                </Button>
              </>
            )}

            {!accounts &&
              config.connectors.map(it => (
                <Button key={it.id} onClick={() => onConnect(it.id)}>
                  Connect {it.name}
                </Button>
              ))}

            {accounts && <Button onClick={onDisconnect}>Disconnect</Button>}
          </HStack>
        </Card.Footer>
      </Card.Root>
    </VStack>
  );
};
