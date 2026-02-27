import type { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: this is intentional
	<svg
		viewBox="0 0 1200 1200"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<g clipPath="url(#clip0_1_11)">
			<mask
				id="mask0_1_11"
				style={{
					maskType: "luminance",
				}}
				maskUnits="userSpaceOnUse"
				x={0}
				y={0}
				width={1200}
				height={1200}
			>
				<path d="M0 0H1200V1200H0V0Z" fill="white" />
			</mask>
			<g mask="url(#mask0_1_11)">
				<mask
					id="mask1_1_11"
					style={{
						maskType: "luminance",
					}}
					maskUnits="userSpaceOnUse"
					x={0}
					y={0}
					width={1200}
					height={1200}
				>
					<path d="M1200 0H0V1200H1200V0Z" fill="white" />
				</mask>
				<g mask="url(#mask1_1_11)">
					<path
						d="M942.408 0H257.592C115.328 0 0 115.328 0 257.592V942.408C0 1084.67 115.328 1200 257.592 1200H942.408C1084.67 1200 1200 1084.67 1200 942.408V257.592C1200 115.328 1084.67 0 942.408 0Z"
						fill="#AB9FF2"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M517.219 779.814C470.102 852.012 391.148 943.378 286.09 943.378C236.426 943.378 188.672 922.933 188.672 834.122C188.672 607.943 497.48 257.813 784.004 257.813C947.004 257.813 1011.95 370.902 1011.95 499.326C1011.95 664.168 904.98 852.651 798.648 852.651C764.902 852.651 748.347 834.122 748.347 804.732C748.347 797.065 749.621 788.759 752.168 779.814C715.875 841.789 645.836 899.292 580.254 899.292C532.5 899.292 508.305 869.263 508.305 827.094C508.305 811.76 511.488 795.787 517.219 779.814ZM904.363 494.869C904.363 532.291 882.284 551.002 857.586 551.002C832.514 551.002 810.809 532.291 810.809 494.869C810.809 457.448 832.514 438.737 857.586 438.737C882.284 438.737 904.363 457.448 904.363 494.869ZM764.031 494.871C764.031 532.293 741.952 551.004 717.254 551.004C692.182 551.004 670.477 532.293 670.477 494.871C670.477 457.449 692.182 438.739 717.254 438.739C741.952 438.739 764.031 457.449 764.031 494.871Z"
						fill="#FFFDF8"
					/>
				</g>
			</g>
		</g>
		<defs>
			<clipPath id="clip0_1_11">
				<rect width={1200} height={1200} fill="white" />
			</clipPath>
		</defs>
	</svg>
);
export default SvgComponent;
