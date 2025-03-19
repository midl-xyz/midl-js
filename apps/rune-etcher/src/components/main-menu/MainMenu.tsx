"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const MainMenu = () => {
	const pathname = usePathname();

	const links = [
		{ href: "/", text: "Etch Runes" },
		{ href: "/runes", text: "View Runes" },
	];

	console.log(pathname);

	return (
		<div className="flex flex-row space-x-4 font-bold">
			{links.map(({ href, text }) => (
				<Link
					key={href}
					href={href}
					className={`text-md ${pathname === href ? "font-bold" : "font-medium"}`}
				>
					{text}
				</Link>
			))}
		</div>
	);
};
