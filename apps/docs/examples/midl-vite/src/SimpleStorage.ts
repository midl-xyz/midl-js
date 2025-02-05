export const SimpleStorage = {
	address: "0x015bceEFA137a662aFC0347Cb6fc204192960094",
	abi: [
		{
			inputs: [
				{
					internalType: "string",
					name: "initialMessage",
					type: "string",
				},
			],
			stateMutability: "nonpayable",
			type: "constructor",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: "string",
					name: "newMessage",
					type: "string",
				},
			],
			name: "MessageUpdated",
			type: "event",
		},
		{
			inputs: [],
			name: "getMessage",
			outputs: [
				{
					internalType: "string",
					name: "",
					type: "string",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "string",
					name: "newMessage",
					type: "string",
				},
			],
			name: "setMessage",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
	],
};
