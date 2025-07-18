import type { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		fill="none"
		viewBox="0 0 32 33"
		{...props}
	>
		<g clipPath="url(#a)">
			<path
				fill="#47BAC5"
				d="M15.26 21.832c0-1.611.862-3.098 2.258-3.922 1.483-.878 2.908-1.85 4.195-2.992.95-.842 2.811-2.756 2.963-4.026.245-2.061-2.055-1.977-3.496-1.768-4.351.631-10.924 4.368-13.74 7.72-.743.883-2.243 2.995-.878 3.924 1.538 1.047 4.895-.123 6.528-.67l-1.148.928c-1.975 1.477-6.741 3.627-9.034 2.175-2.069-1.31-.105-4.598.966-5.986 3.93-5.094 13.865-10.952 20.44-10.708 2.12.08 4.285.833 5.587 2.556 3.184 4.213-1.275 10.484-4.227 13.633a36.381 36.381 0 0 1-2.807 2.681c-2.975 2.56-7.606.463-7.606-3.443v-.102Z"
			/>
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" d="M2 6.5h29v20H2z" />
			</clipPath>
		</defs>
	</svg>
);
export default SvgComponent;
