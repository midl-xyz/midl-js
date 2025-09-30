import type { Account } from "@midl/core";
import {
	fireEvent,
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Wrapper, testConnector } from "~/__tests__/wrapper";
import { createAuthenticationAdapter } from "~/features/auth";
import { ConnectDialog } from "~/widgets/connect-dialog/ConnectDialog";

describe("widgets | ConnectDialog", () => {
	const onClose = vi.fn();

	it("should render available wallets", () => {
		render(<ConnectDialog open={true} onClose={onClose} />, {
			wrapper: Wrapper,
		});

		expect(screen.getByText("KeyPair")).toBeDefined();
	});

	it.skip("should render pending", async () => {
		// TODO: fix spyOn for connect method
		const spy = vi
			.spyOn(testConnector, "connect")
			.mockImplementation(async () => {
				return await new Promise<Account[]>((resolve) =>
					setTimeout(() => {
						resolve([]);
					}, 1000),
				);
			});

		render(<ConnectDialog open={true} onClose={onClose} />, {
			wrapper: Wrapper,
		});

		fireEvent(
			screen.getByText("KeyPair"),
			new MouseEvent("click", {
				bubbles: true,
				cancelable: true,
			}),
		);

		await waitForElementToBeRemoved(() => screen.queryByText("KeyPair"));

		expect(screen.getByText("Waiting for wallet connection...")).toBeDefined();

		spy.mockRestore();
	});

	it("should render success", async () => {
		render(<ConnectDialog open={true} onClose={onClose} />, {
			wrapper: Wrapper,
		});

		fireEvent(
			screen.getByText("KeyPair"),
			new MouseEvent("click", {
				bubbles: true,
				cancelable: true,
			}),
		);

		await waitFor(() => {
			expect(onClose).toBeCalled();
		});
	});

	it("should sign in", async () => {
		const signOut = vi.fn();
		const verify = vi.fn().mockResolvedValue(true);
		const createMessage = vi.fn().mockResolvedValue({
			message: "message",
		});

		const authAdapter = createAuthenticationAdapter({
			signOut,
			verify,
			createMessage,
		});

		render(<ConnectDialog open={true} onClose={onClose} />, {
			wrapper: (props) => <Wrapper {...props} adapter={authAdapter} />,
		});

		fireEvent(
			screen.getByText("KeyPair"),
			new MouseEvent("click", {
				bubbles: true,
				cancelable: true,
			}),
		);

		await waitForElementToBeRemoved(() => screen.queryByText("KeyPair"));

		expect(verify).toBeCalledTimes(1);

		await waitFor(() => {
			expect(onClose).toBeCalled();
		});
	});
});
