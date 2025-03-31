import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Wrapper } from "~/__tests__/wrapper";
import { ConnectButton } from "~/widgets/connect-button/ConnectButton";

describe("widgets | ConnectButton", () => {
	it("should render default button", () => {
		render(<ConnectButton />, { wrapper: Wrapper });

		expect(
			screen.getByRole("button").classList.contains("satoshi-kit--button"),
		).toBeTruthy();
	});

	it("should render custom button", () => {
		render(
			<ConnectButton>
				{({ openDialog }) => (
					<button onClick={openDialog} type="button">
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
