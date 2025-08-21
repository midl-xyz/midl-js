import { AddressPurpose } from "@midl/core";
import { css } from "styled-system/css";
import BitcoinIcon from "./BitcoinIcon";
import RunesIcon from "./RunesIcon";

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
