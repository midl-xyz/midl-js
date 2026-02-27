import type { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: this is intentional
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		{...props}
	>
		<path
			fill="currentColor"
			fillRule="evenodd"
			d="M11.25 2.5a.75.75 0 0 1 .75-.75 10.22 10.22 0 0 1 7.248 3.002A10.22 10.22 0 0 1 22.25 12a.75.75 0 0 1-1.5 0 8.72 8.72 0 0 0-2.563-6.187A8.72 8.72 0 0 0 12 3.25a.75.75 0 0 1-.75-.75ZM2.5 11.25a.75.75 0 0 1 .75.75 8.72 8.72 0 0 0 2.563 6.187A8.72 8.72 0 0 0 12 20.75a.75.75 0 0 1 0 1.5 10.22 10.22 0 0 1-7.248-3.002A10.22 10.22 0 0 1 1.75 12a.75.75 0 0 1 .75-.75Z"
			clipRule="evenodd"
		/>
	</svg>
);
export default SvgComponent;
