import type { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 600 600">
		<g fill="none" fillRule="evenodd">
			<path fill="#171717" d="M0 0h600v600H0z" />
			<path
				fill="#FFF"
				fillRule="nonzero"
				d="M440 435.4v-51c0-2-.8-3.9-2.2-5.3L220 162.2a7.6 7.6 0 0 0-5.4-2.2h-51.1c-2.5 0-4.6 2-4.6 4.6v47.3c0 2 .8 4 2.2 5.4l78.2 77.8a4.6 4.6 0 0 1 0 6.5l-79 78.7c-1 .9-1.4 2-1.4 3.2v52c0 2.4 2 4.5 4.6 4.5H249c2.6 0 4.6-2 4.6-4.6V405c0-1.2.5-2.4 1.4-3.3l42.4-42.2a4.6 4.6 0 0 1 6.4 0l78.7 78.4a7.6 7.6 0 0 0 5.4 2.2h47.5c2.5 0 4.6-2 4.6-4.6Z"
			/>
			<path
				fill="#EE7A30"
				fillRule="nonzero"
				d="M325.6 227.2h42.8c2.6 0 4.6 2.1 4.6 4.6v42.6c0 4 5 6.1 8 3.2l58.7-58.5c.8-.8 1.3-2 1.3-3.2v-51.2c0-2.6-2-4.6-4.6-4.6L384 160c-1.2 0-2.4.5-3.3 1.3l-58.4 58.1a4.6 4.6 0 0 0 3.2 7.8Z"
			/>
		</g>
	</svg>
);
export default SvgComponent;
