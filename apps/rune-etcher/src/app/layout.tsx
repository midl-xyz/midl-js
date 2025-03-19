import { Header } from "@/components/header/Header";
import { MainMenu } from "@/components/main-menu";
import { Toaster } from "@/components/ui/toaster";
import { Web3Provider } from "@/components/web3-provider/Web3Provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Bitcoin Rune Etcher",
	description: "Etch runes on the Bitcoin blockchain",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} dark:bg-neutral-900 bg-zinc-50`}
			>
				<Web3Provider>
					<Header />
					<div className="flex flex-col items-center pt-[12vh] gap-8">
						<div className="flex flex-col space-y-0 items-start">
							<h1 className="text-3xl font-bold text-primary">
								Bitcoin Rune Etcher
							</h1>
							<p className="text-lg">Etch runes on the Bitcoin blockchain</p>
						</div>

						<MainMenu />
						{children}
					</div>
					<Toaster />
				</Web3Provider>
			</body>
		</html>
	);
}
