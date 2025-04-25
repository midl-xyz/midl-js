import type { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		{...props}
		viewBox="0 0 25 25"
	>
		<path fill="#000" d="M0 0h25v25H0z" />
		<path fill="#fff" d="M1 1h23v23H1z" />
		<path fill="#000" d="M3 3h19v19H3z" />
		<path fill="#fff" d="M7 7h11v11H7z" />
	</svg>
);
export default SvgComponent;
