import type { TransactionIntention } from "@midl/executor";
import { describe, expect, it } from "vitest";
import { createStore } from "./createStore";

describe("createStore", () => {
	it("creates a zustand store with correct initial state", () => {
		const store = createStore();

		const state = store.getState();

		expect(state).toHaveProperty("intentions");
		expect(state.intentions).toEqual([]);
	});

	it("returns a store with intentions array", () => {
		const store = createStore();

		expect(Array.isArray(store.getState().intentions)).toBe(true);
	});

	it("creates independent store instances", () => {
		const store1 = createStore();
		const store2 = createStore();

		expect(store1).not.toBe(store2);
		expect(store1.getState()).not.toBe(store2.getState());
	});

	it("allows modifying intentions through setState", () => {
		const store = createStore();

		const mockIntention: TransactionIntention = {
			type: "CALL",
			to: "0x1234567890abcdef",
			data: "0x",
			value: 0n,
		} as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		expect(store.getState().intentions).toHaveLength(1);
		expect(store.getState().intentions[0]).toEqual(mockIntention);
	});

	it("can be subscribed to for state changes", () => {
		const store = createStore();
		let callCount = 0;

		const unsubscribe = store.subscribe(() => {
			callCount++;
		});

		const mockIntention: TransactionIntention = {
			type: "CALL",
			to: "0xabcdef",
			data: "0x123",
			value: 100n,
		} as TransactionIntention;

		store.setState({ intentions: [mockIntention] });

		expect(callCount).toBe(1);

		unsubscribe();
	});

	it("initializes with empty intentions on each call", () => {
		const store1 = createStore();
		const store2 = createStore();

		store1.setState({
			intentions: [
				{
					type: "CALL",
					to: "0x123",
					data: "0x",
					value: 0n,
				} as TransactionIntention,
			],
		});

		// store2 should still be empty
		expect(store2.getState().intentions).toEqual([]);
		expect(store1.getState().intentions).toHaveLength(1);
	});

	it("can handle multiple intentions", () => {
		const store = createStore();

		const intentions: TransactionIntention[] = [
			{
				type: "CALL",
				to: "0x1111111111111111",
				data: "0xabc",
				value: 100n,
			} as TransactionIntention,
			{
				type: "CALL",
				to: "0x2222222222222222",
				data: "0xdef",
				value: 200n,
			} as TransactionIntention,
		];

		store.setState({ intentions });

		expect(store.getState().intentions).toHaveLength(2);
		expect(store.getState().intentions).toEqual(intentions);
	});

	it("returns a store with standard zustand methods", () => {
		const store = createStore();

		expect(typeof store.getState).toBe("function");
		expect(typeof store.setState).toBe("function");
		expect(typeof store.subscribe).toBe("function");
	});
});
