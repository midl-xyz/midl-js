import Avatar from "boring-avatars";
import { type Token, token } from "styled-system/tokens";

type IdentIconProps = {
	hash: string;
	size?: number | string;
	className?: string;
};

export const IdentIcon = ({ hash, size = 6, className }: IdentIconProps) => {
	return (
		<Avatar
			name={hash}
			colors={["#5b1d99", "#0074b4", "#00b34c", "#ffd41f", "#fc6e3d"]}
			variant="marble"
			style={{
				width: token.var(`sizes.${size}` as Token) ?? size,
				height: token.var(`sizes.${size}` as Token) ?? size,
			}}
		/>
	);
};
