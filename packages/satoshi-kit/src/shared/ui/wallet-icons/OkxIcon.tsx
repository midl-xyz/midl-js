import type { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
		fill="none"
		{...props}
	>
		<rect width={512} height={512} fill="#A4FF42" rx={120} />
		<rect width={100} height={100} x={106} y={106} fill="#000" rx={8} />
		<rect width={100} height={100} x={306} y={106} fill="#000" rx={8} />
		<rect width={100} height={100} x={206} y={206} fill="#000" rx={8} />
		<rect width={100} height={100} x={106} y={306} fill="#000" rx={8} />
		<rect width={100} height={100} x={306} y={306} fill="#000" rx={8} />
	</svg>
);
export default SvgComponent;
