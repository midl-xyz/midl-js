import type { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		{...props}
		viewBox="0 0 200 200"
	>
		<g clipPath="url(#a)">
			<circle cx={100} cy={100} r={100} fill="#00F0FF" />
			<path
				fill="#000"
				d="M93.191 80.488h35.021l35.827 35.598a5.942 5.942 0 0 1 .024 8.41l-45.946 46.178H82.04l10.907-10.604 40.045-39.792-39.536-39.793"
			/>
			<path
				fill="#000"
				d="M107.585 120.188H72.564L36.737 84.59a5.942 5.942 0 0 1-.024-8.41L82.659 30h36.076l-10.906 10.604-40.045 39.792 39.536 39.792"
			/>
		</g>
		<defs>
			<clipPath id="a">
				<path fill="#fff" d="M0 0h200v200H0z" />
			</clipPath>
		</defs>
	</svg>
);
export default SvgComponent;
