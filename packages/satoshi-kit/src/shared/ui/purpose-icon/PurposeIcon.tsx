import { AddressPurpose } from "@midl-xyz/midl-js-core";
import BitcoinIcon from "./BitcoinIcon";
import RunesIcon from "./RunesIcon";
import { css } from "styled-system/css";

type PurposeIconProps = {
	purpose: AddressPurpose;
};

export const PurposeIcon = ({ purpose }: PurposeIconProps) => {
	let Icon = null;

	switch (purpose) {
		case AddressPurpose.Payment: {
			Icon = BitcoinIcon;
			break;
		}

		case AddressPurpose.Ordinals: {
			Icon = RunesIcon;
			break;
		}
	}

	if (!Icon) {
		return null;
	}

	return (
		<Icon
			className={css({
				width: 8,
				height: 8,
			})}
		/>
	);
};
