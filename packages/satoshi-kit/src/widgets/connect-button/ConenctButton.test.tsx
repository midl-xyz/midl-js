import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Wrapper } from "~/__tests__/wrapper";
import { ConnectButton } from "~/widgets/connect-button/ConnectButton";

describe("satoshi-kit | widgets | ConnectButton", () => {
	it("renders default button", () => {
		render(<ConnectButton />, { wrapper: Wrapper });

		expect(
			screen.getByRole("button").classList.contains("satoshi-kit--button"),
		).toBeTruthy();
	});

	it("renders custom button", () => {
		render(
			<ConnectButton>
				{({ openConnectDialog }) => (
					<button onClick={openConnectDialog} type="button">
						Custom Button
					</button>
				)}
			</ConnectButton>,
			{ wrapper: Wrapper },
		);

		expect(
			screen.getByRole("button").classList.contains("satoshi-kit--button"),
		).toBeFalsy();

		expect(screen.getByText("Custom Button")).toBeDefined();
	});
});
