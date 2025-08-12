import { vi } from "vitest";

vi.mock("boring-avatars", () => ({
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	default: (props: any) => <div data-testid="avatar-mock" {...props} />,
}));
