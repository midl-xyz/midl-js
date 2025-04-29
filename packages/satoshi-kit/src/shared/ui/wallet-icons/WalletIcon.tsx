import { css, cx } from "styled-system/css";
import LeatherIcon from "./LeatherIcon";
import UnisatIcon from "./UnisatIcon";
import XverseIcon from "./XverseIcon";
import BitgetIcon from "./BitgetIcon";
import PhantomIcon from "./PhantomIcon";

type WalletIconProps = {
	size: number;
	className?: string;
	style?: React.CSSProperties;
	connectorId: string;
};

export const WalletIcon = ({
	size,
	className,
	style,
	connectorId,
}: WalletIconProps) => {
	let Icon = null;

	switch (connectorId) {
		case "leather":
			Icon = LeatherIcon;
			break;
		case "unisat":
			Icon = UnisatIcon;
			break;

		case "sats-connect-XverseProviders.BitcoinProvider":
			Icon = XverseIcon;
			break;

		case "bitkeep.unisat":
			Icon = BitgetIcon;
			break;

		case "phantom":
			Icon = PhantomIcon;
			break;

		default:
			if (process.env.NODE_ENV === "development") {
				console.warn(`Unknown connectorId: ${connectorId}`);
			}
			Icon = null;
	}

	if (!Icon) {
		return null;
	}

	return (
		<Icon
			className={cx(
				css({
					width: size,
					height: size,
					borderRadius: "md",
				}),
				className,
			)}
			style={style}
		/>
	);
};
