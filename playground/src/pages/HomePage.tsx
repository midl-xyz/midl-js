import { AddressPurpose, broadcastTransaction } from "@midl-xyz/midl-js-core";
import {
  useEVMAddress,
  useSerializeTransaction,
} from "@midl-xyz/midl-js-executor";
import {
  useAccounts,
  useConnect,
  useDisconnect,
  useEdictRune,
  useEtchRune,
  useMidlContext,
  useSignMessage,
  useTransferBTC,
  useUTXOs,
} from "@midl-xyz/midl-js-react";
import { css } from "styled-system/css";
import { HStack, VStack } from "styled-system/jsx";
import {
  encodeFunctionData,
  erc20Abi,
  hashBitcoinMessage,
  keccak256,
  parseEther,
  parseTransaction,
  recoverAddress,
  recoverTransactionAddress,
  serializeTransaction,
  toHex,
} from "viem";
// @ts-ignore
import { useWalletClient } from "wagmi";
import { Button, Card, Text } from "~/shared/ui/components";

const tokenAddress = "0x3e80F8053eeF548C7062684A68177105e82439AA";

export const HomePage = () => {
  const { connect } = useConnect({
    purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
  });

  const { accounts, error } = useAccounts();
  const { disconnect } = useDisconnect();
  const evmAddress = useEVMAddress();
  const { transferBTCAsync } = useTransferBTC();
  const { data: walletClient } = useWalletClient();

  console.log("evmAddress", evmAddress);

  console.log("walletClient", walletClient);

  const { config } = useMidlContext();
  const { signMessage, signMessageAsync, data } = useSignMessage();

  const { mutate, data: etchRuneResult, error: etchRuneError } = useEtchRune();
  const {
    edictRune,
    data: edictRuneResult,
    isPending,
    error: edictRuneError,
  } = useEdictRune();

  const { utxos } = useUTXOs(accounts?.[0]?.address);

  const onConnect = (id?: string) => {
    connect({ id });
  };

  const onDisconnect = () => {
    disconnect();
  };

  const onSignMessage = () => {
    signMessage({ message: "Hello, Midl!" });
  };

  const onEtchRune = () => {
    mutate();
  };

  const onBroadcast = () => {
    broadcastTransaction(config, etchRuneResult as unknown as string);
  };

  const serializedTx = useSerializeTransaction();

  const waitFor = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  const prepareEVMTransaction = async () => {
    const btcTx = await transferBTCAsync({
      transfers: [
        {
          receiver: "tb1qsjcsryftgwyh3e0z0mvc6vdjx9pl8cx8dxrdxm",
          amount: 30_000,
        },
      ],
      publish: true,
      feeRate: 1,
    });

    console.log("btcTx", btcTx);

    await waitFor(10_000);

    const serialized = await serializedTx({
      to: tokenAddress,
      chainId: 777,
      type: "btc",
      gasPrice: parseEther("1", "gwei"),
      gas: BigInt(100_000),
      btcTxHash: `0x${btcTx.txId}`,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: ["0x8B0d615D18D50fF2E05953F35eA2951cb4c1B49c", BigInt(1)],
      }),
    });

    const messageToSign = keccak256(serialized);

    const tx = parseTransaction(serialized);
    const data = await signMessageAsync({
      message: messageToSign,
    });

    const signatureBuffer = Buffer.from(data.signature, "base64");

    console.log(data);

    let recoveryId = BigInt(signatureBuffer[0]) - BigInt(8);

    if (recoveryId < BigInt(27)) {
      recoveryId += BigInt(4);
    }

    recoveryId = BigInt(27);

    const r = signatureBuffer.slice(1, 33);
    const s = signatureBuffer.slice(33, 65);

    console.log("r,s,v", r, s, recoveryId);

    const signedTx = serializeTransaction(
      {
        ...tx,
      },
      {
        r: toHex(r),
        s: toHex(s),
        v: recoveryId,
      }
    );

    console.log("hashed", hashBitcoinMessage(messageToSign));

    const address = await recoverAddress({
      hash: hashBitcoinMessage(messageToSign),
      signature: {
        r: toHex(r),
        s: toHex(s),
        v: recoveryId,
      },
    });

    const address2 = await recoverTransactionAddress({
      serializedTransaction: signedTx,
    });

    console.log("recoverTransactionAddress", address, address2);

    console.log("parsed", parseTransaction(signedTx));

    const tx2 = await walletClient?.sendRawTransaction({
      serializedTransaction: signedTx,
    });
    console.log(tx2);
  };

  if (edictRuneError) {
    console.error(edictRuneError);
  }

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
                  loading={isPending}
                  onClick={() =>
                    edictRune({
                      transfers: [
                        {
                          receiver:
                            "tb1p0zj8kldnyt75sjpx7vzk2f7lgewnnr7znwez4p5s0mewg5kxefhstevkt0",
                          amount: 10000,
                        },
                        {
                          runeId: "2873407:1535",
                          receiver:
                            "tb1p0zj8kldnyt75sjpx7vzk2f7lgewnnr7znwez4p5s0mewg5kxefhstevkt0",
                          amount: BigInt(1),
                        },
                        {
                          runeId: "2900622:601",
                          receiver:
                            "tb1p0zj8kldnyt75sjpx7vzk2f7lgewnnr7znwez4p5s0mewg5kxefhstevkt0",
                          amount: BigInt(1),
                        },
                      ],
                      publish: true,
                    })
                  }
                >
                  Edict Rune
                </Button>

                <Button onClick={onBroadcast}>Broadcast</Button>

                <Button onClick={onSignMessage}>Sign message</Button>

                <Button onClick={prepareEVMTransaction}>
                  Prepare EVM Transaction
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
