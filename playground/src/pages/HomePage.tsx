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
  useTransferBTC,
} from "@midl-xyz/midl-js-react";
import {
  useEVMAddress,
  useSerializeTransaction,
} from "@midl-xyz/midl-js-executor";
import { css } from "styled-system/css";
import { AddressPurpose, broadcastTransaction } from "@midl-xyz/midl-js-core";
import {
  encodeFunctionData,
  erc20Abi,
  keccak256,
  parseTransaction,
  recoverAddress,
  toHex,
  signatureToCompactSignature,
  signatureToHex,
  compactSignatureToSignature,
  recoverTransactionAddress,
  recoverPublicKey,
  serializeSignature,
  hashBitcoinMessage,
  serializeTransaction,
  fromRlp,
  zeroAddress,
} from "viem";
import { Psbt, networks } from "bitcoinjs-lib";
import { prepareTransactionRequest } from "viem/actions";
import {
  usePrepareTransactionRequest,
  useWalletClient,
  useConnect as useWagmiConnect,
  useConfig,
} from "wagmi";
import { SigningKey } from "ethers";
import * as bm from "bitcoinjs-message";
import { useEffect } from "react";
import { mock } from "wagmi/connectors";

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
  const { connect: wagmiConnect, error: wagmiError } = useWagmiConnect();

  console.log("error", wagmiError);

  useEffect(() => {
    console.log(
      "rlp",
      fromRlp(
        "0x07f8878203090101839896809458d81a529b26a93f0ca25d224403dac44d07f7b780b844095ea7b30000000000000000000000008b0d615d18d50ff2e05953f35ea2951cb4c1b49c0000000000000000000000000000000000000000000000000000000000000001a0e0fb38d9e3d7230cd9ff3981201edff45cbb97a69234d3b467730119710b4c45c0",
        "hex"
      )
    );
    wagmiConnect({
      connector: mock({
        accounts: [evmAddress],
      }),
    });
  }, []);

  console.log("walletClient", walletClient);
  const wagmiConfi = useConfig();

  console.log("wagmiConfig", wagmiConfi.getClient());

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
    });

    await waitFor(10_000);

    const serialized = await serializedTx({
      to: tokenAddress,
      btcTxHash: `0x${btcTx.txId}`,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: ["0x8B0d615D18D50fF2E05953F35eA2951cb4c1B49c", BigInt(1)],
      }),
    });

    const tx = parseTransaction(serialized);
    const data = await signMessageAsync({
      message: keccak256(serialized),
    });

    const signatureBuffer = Buffer.from(data.signature, "base64");
    const recoveryId = BigInt(signatureBuffer[0]) - BigInt(8);
    const r = signatureBuffer.slice(1, 33);
    const s = signatureBuffer.slice(33, 65);

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

    console.log("signedTx", signedTx);
    console.log("serial ized", {
      r: toHex(r),
      s: toHex(s),
      v: recoveryId,
    });

    console.log(hashBitcoinMessage(keccak256(serialized)));

    const address = await recoverAddress({
      hash: hashBitcoinMessage(keccak256(serialized)),
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

    const tx2 = await walletClient?.sendRawTransaction({
      serializedTransaction: signedTx,
    });
    console.log(tx2);
  };

  console.log(evmAddress);

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
                            "tb1p22w0r4lwjfw7frr66ghvrqweaznh2sx4cjw20lke0wldjq0up32stlzlp4",
                          amount: 10000,
                        },
                        {
                          runeId: "2873407:1535",
                          receiver:
                            "tb1p22w0r4lwjfw7frr66ghvrqweaznh2sx4cjw20lke0wldjq0up32stlzlp4",
                          amount: BigInt(1),
                        },
                      ],
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
