import { Box, Flex, Stack } from "styled-system/jsx";
import { Text } from "~/shared/ui/text";
import Graphics1 from "./assets/Graphics1";
import Graphics2 from "./assets/Graphics2";

export const About = () => {
	return (
		<Stack background="bg.emphasized" borderRadius="md" p={6}>
			<Text
				textStyle="md"
				as="h3"
				fontWeight="bold"
				color="text.onEmphasized.default"
				padding="4"
				textAlign={"center"}
			>
				What is SatoshiKit?
			</Text>

			<Stack px={8}>
				<Flex gap={2}>
					<Box>
						<Graphics1 width={32} height={32} />
					</Box>
					<Stack gap={1}>
						<Text textStyle="md" color="text.onEmphasized.default">
							Standardized Connection Tooling
						</Text>
						<Text textStyle="sm" color="text.onEmphasized.muted">
							Connect your Bitcoin Wallet to dApps with SatoshiKit. Let us know
							if your favorite wallet is missing
						</Text>
					</Stack>
				</Flex>

				<Flex gap={2}>
					<Box>
						<Graphics2 width={32} height={32} />
					</Box>
					<Stack gap={1}>
						<Text textStyle="md" color="text.onEmphasized.default">
							A Native Way to Log In
						</Text>
						<Text textStyle="sm" color="text.onEmphasized.muted">
							Instead of creating new accounts and passwords or switching to
							Non-BTC Wallet, just connect with a native one. Open source and
							free to use. Contributions are welcome
						</Text>
					</Stack>
				</Flex>
			</Stack>
		</Stack>
	);
};
