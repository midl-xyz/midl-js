"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { AddressPurpose } from "@midl-xyz/midl-js-core";
import {
  useAccounts,
  useConnect,
  useDisconnect,
  useMidlContext,
  useSwitchNetwork,
} from "@midl-xyz/midl-js-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const shorten = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export const Header = () => {
  const { paymentAccount, ordinalsAccount } = useAccounts();
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();
  const { config } = useMidlContext();
  const { toast } = useToast();

  const { connect } = useConnect({
    purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
    mutation: {
      onSuccess: () => {
        setIsConnectDialogOpen(false);
      },
      onError: error => {
        console.error(error);
        toast({
          title: "Error",
          description: error.message,
          color: "error",
        });
      },
    },
  });

  return (
    <>
      <div className="flex justify-end p-4 px-8 gap-4">
        <Select
          defaultValue={config.network?.id}
          onValueChange={it => {
            const network = config.networks.find(network => network.id === it);
            if (!network) {
              return;
            }

            switchNetwork(network);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Network" />
          </SelectTrigger>
          <SelectContent>
            {config.networks.map(network => (
              <SelectItem key={network.id} value={network.id}>
                {network.id.toLocaleUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {paymentAccount || ordinalsAccount ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                {shorten(
                  (paymentAccount?.address || ordinalsAccount?.address) ?? ""
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {paymentAccount && (
                <DropdownMenuItem>
                  Payment: {shorten(paymentAccount.address)}
                </DropdownMenuItem>
              )}
              {ordinalsAccount && (
                <DropdownMenuItem>
                  Ordinals: {shorten(ordinalsAccount.address)}
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => {
                  disconnect();
                }}
              >
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => setIsConnectDialogOpen(true)}>
            Connect Wallet
          </Button>
        )}
      </div>
      <Dialog
        open={isConnectDialogOpen}
        onOpenChange={v => setIsConnectDialogOpen(v)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect your wallet</DialogTitle>
            <DialogDescription>
              <p className="text-sm text-muted-foreground mt-4">
                Connect your wallet to access your funds and manage your
                account.
              </p>

              <div className="flex justify-between flex-col space-y-2  mt-4">
                {config.connectors.map(connector => (
                  <Button
                    className="w-full"
                    size="lg"
                    key={connector.id}
                    onClick={() => connect({ id: connector.id })}
                  >
                    {connector.name}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-8">
                By connecting your wallet, you agree to the{" "}
                <a href="#test" className="text-blue-500">
                  terms of service
                </a>{" "}
                and{" "}
                <a href="#test" className="text-blue-500">
                  privacy policy
                </a>
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
