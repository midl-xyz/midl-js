import { vi } from "vitest";

vi.mock("boring-avatars", () => ({
	// biome-ignore lint/suspicious/noExplicitAny: mock
	default: (props: any) => <div data-testid="avatar-mock" {...props} />,
}));
