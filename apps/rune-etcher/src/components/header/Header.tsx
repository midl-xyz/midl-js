"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useConfig,
	useHydrated,
	useSwitchNetwork,
} from "@midl-xyz/midl-js-react";
import { ConnectButton } from "@midl-xyz/satoshi-kit";
import { useEffect } from "react";
import { useController, useForm } from "react-hook-form";

const shorten = (address: string) =>
	`${address.slice(0, 6)}...${address.slice(-4)}`;

export const Header = () => {
	const hydrated = useHydrated();

	return (
		<>
			<div className="flex justify-end p-4 px-8 gap-4">
				{hydrated && <HeaderNetworkSwitch />}

				<ConnectButton hideBalance />
			</div>
		</>
	);
};

const HeaderNetworkSwitch = () => {
	const { switchNetwork } = useSwitchNetwork();
	const { network, networks } = useConfig();
	const { watch, control } = useForm<{ network: string }>();

	const selectedNetwork = watch("network");
	const { field } = useController({
		name: "network",
		control,
		defaultValue: network?.id ?? "",
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (selectedNetwork) {
			const network = networks.find(
				(network) => network.id === selectedNetwork,
			);
			if (!network) {
				return;
			}

			switchNetwork(network);
		}
	}, [selectedNetwork]);

	return (
		<form>
			<Select
				{...field}
				onValueChange={(value) => {
					field.onChange(value);
				}}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Network" />
				</SelectTrigger>
				<SelectContent>
					{networks.map((network) => (
						<SelectItem key={network.id} value={network.id}>
							{network.id.toLocaleUpperCase()}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</form>
	);
};
