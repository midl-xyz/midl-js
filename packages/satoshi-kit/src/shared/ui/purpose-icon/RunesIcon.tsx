import type { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
	<svg
		viewBox="0 0 25 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<title>{"Runes Symbol"}</title>
		<rect x={5.5} y={5} width={14} height={14} fill="white" />
		<rect
			x={1.46}
			y={0.96}
			width={22.08}
			height={22.08}
			stroke="white"
			strokeWidth={1.92}
		/>
	</svg>
);
export default SvgComponent;
