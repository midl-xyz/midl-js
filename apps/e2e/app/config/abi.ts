export const uniswapV2Router02Abi = [
	{
		type: "constructor",
		inputs: [
			{ name: "_factory", internalType: "address", type: "address" },
			{ name: "_WETH", internalType: "address", type: "address" },
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		inputs: [],
		name: "WETH",
		outputs: [{ name: "", internalType: "address", type: "address" }],
		stateMutability: "view",
	},
	{
		type: "function",
		inputs: [
			{ name: "tokenA", internalType: "address", type: "address" },
			{ name: "tokenB", internalType: "address", type: "address" },
			{ name: "amountADesired", internalType: "uint256", type: "uint256" },
			{ name: "amountBDesired", internalType: "uint256", type: "uint256" },
			{ name: "amountAMin", internalType: "uint256", type: "uint256" },
			{ name: "amountBMin", internalType: "uint256", type: "uint256" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "addLiquidity",
		outputs: [
			{ name: "amountA", internalType: "uint256", type: "uint256" },
			{ name: "amountB", internalType: "uint256", type: "uint256" },
			{ name: "liquidity", internalType: "uint256", type: "uint256" },
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		inputs: [
			{ name: "token", internalType: "address", type: "address" },
			{ name: "amountTokenDesired", internalType: "uint256", type: "uint256" },
			{ name: "amountTokenMin", internalType: "uint256", type: "uint256" },
			{ name: "amountETHMin", internalType: "uint256", type: "uint256" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "addLiquidityETH",
		outputs: [
			{ name: "amountToken", internalType: "uint256", type: "uint256" },
			{ name: "amountETH", internalType: "uint256", type: "uint256" },
			{ name: "liquidity", internalType: "uint256", type: "uint256" },
		],
		stateMutability: "payable",
	},
	{
		type: "function",
		inputs: [],
		name: "factory",
		outputs: [{ name: "", internalType: "address", type: "address" }],
		stateMutability: "view",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountOut", internalType: "uint256", type: "uint256" },
			{ name: "reserveIn", internalType: "uint256", type: "uint256" },
			{ name: "reserveOut", internalType: "uint256", type: "uint256" },
		],
		name: "getAmountIn",
		outputs: [{ name: "amountIn", internalType: "uint256", type: "uint256" }],
		stateMutability: "pure",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountIn", internalType: "uint256", type: "uint256" },
			{ name: "reserveIn", internalType: "uint256", type: "uint256" },
			{ name: "reserveOut", internalType: "uint256", type: "uint256" },
		],
		name: "getAmountOut",
		outputs: [{ name: "amountOut", internalType: "uint256", type: "uint256" }],
		stateMutability: "pure",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountOut", internalType: "uint256", type: "uint256" },
			{ name: "path", internalType: "address[]", type: "address[]" },
		],
		name: "getAmountsIn",
		outputs: [
			{ name: "amounts", internalType: "uint256[]", type: "uint256[]" },
		],
		stateMutability: "view",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountIn", internalType: "uint256", type: "uint256" },
			{ name: "path", internalType: "address[]", type: "address[]" },
		],
		name: "getAmountsOut",
		outputs: [
			{ name: "amounts", internalType: "uint256[]", type: "uint256[]" },
		],
		stateMutability: "view",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountA", internalType: "uint256", type: "uint256" },
			{ name: "reserveA", internalType: "uint256", type: "uint256" },
			{ name: "reserveB", internalType: "uint256", type: "uint256" },
		],
		name: "quote",
		outputs: [{ name: "amountB", internalType: "uint256", type: "uint256" }],
		stateMutability: "pure",
	},
	{
		type: "function",
		inputs: [
			{ name: "tokenA", internalType: "address", type: "address" },
			{ name: "tokenB", internalType: "address", type: "address" },
			{ name: "liquidity", internalType: "uint256", type: "uint256" },
			{ name: "amountAMin", internalType: "uint256", type: "uint256" },
			{ name: "amountBMin", internalType: "uint256", type: "uint256" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "removeLiquidity",
		outputs: [
			{ name: "amountA", internalType: "uint256", type: "uint256" },
			{ name: "amountB", internalType: "uint256", type: "uint256" },
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		inputs: [
			{ name: "token", internalType: "address", type: "address" },
			{ name: "liquidity", internalType: "uint256", type: "uint256" },
			{ name: "amountTokenMin", internalType: "uint256", type: "uint256" },
			{ name: "amountETHMin", internalType: "uint256", type: "uint256" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "removeLiquidityETH",
		outputs: [
			{ name: "amountToken", internalType: "uint256", type: "uint256" },
			{ name: "amountETH", internalType: "uint256", type: "uint256" },
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		inputs: [
			{ name: "token", internalType: "address", type: "address" },
			{ name: "liquidity", internalType: "uint256", type: "uint256" },
			{ name: "amountTokenMin", internalType: "uint256", type: "uint256" },
			{ name: "amountETHMin", internalType: "uint256", type: "uint256" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "removeLiquidityETHSupportingFeeOnTransferTokens",
		outputs: [{ name: "amountETH", internalType: "uint256", type: "uint256" }],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		inputs: [
			{ name: "token", internalType: "address", type: "address" },
			{ name: "liquidity", internalType: "uint256", type: "uint256" },
			{ name: "amountTokenMin", internalType: "uint256", type: "uint256" },
			{ name: "amountETHMin", internalType: "uint256", type: "uint256" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
			{ name: "approveMax", internalType: "bool", type: "bool" },
			{ name: "v", internalType: "uint8", type: "uint8" },
			{ name: "r", internalType: "bytes32", type: "bytes32" },
			{ name: "s", internalType: "bytes32", type: "bytes32" },
		],
		name: "removeLiquidityETHWithPermit",
		outputs: [
			{ name: "amountToken", internalType: "uint256", type: "uint256" },
			{ name: "amountETH", internalType: "uint256", type: "uint256" },
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		inputs: [
			{ name: "token", internalType: "address", type: "address" },
			{ name: "liquidity", internalType: "uint256", type: "uint256" },
			{ name: "amountTokenMin", internalType: "uint256", type: "uint256" },
			{ name: "amountETHMin", internalType: "uint256", type: "uint256" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
			{ name: "approveMax", internalType: "bool", type: "bool" },
			{ name: "v", internalType: "uint8", type: "uint8" },
			{ name: "r", internalType: "bytes32", type: "bytes32" },
			{ name: "s", internalType: "bytes32", type: "bytes32" },
		],
		name: "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
		outputs: [{ name: "amountETH", internalType: "uint256", type: "uint256" }],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		inputs: [
			{ name: "tokenA", internalType: "address", type: "address" },
			{ name: "tokenB", internalType: "address", type: "address" },
			{ name: "liquidity", internalType: "uint256", type: "uint256" },
			{ name: "amountAMin", internalType: "uint256", type: "uint256" },
			{ name: "amountBMin", internalType: "uint256", type: "uint256" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
			{ name: "approveMax", internalType: "bool", type: "bool" },
			{ name: "v", internalType: "uint8", type: "uint8" },
			{ name: "r", internalType: "bytes32", type: "bytes32" },
			{ name: "s", internalType: "bytes32", type: "bytes32" },
		],
		name: "removeLiquidityWithPermit",
		outputs: [
			{ name: "amountA", internalType: "uint256", type: "uint256" },
			{ name: "amountB", internalType: "uint256", type: "uint256" },
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountOut", internalType: "uint256", type: "uint256" },
			{ name: "path", internalType: "address[]", type: "address[]" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "swapETHForExactTokens",
		outputs: [
			{ name: "amounts", internalType: "uint256[]", type: "uint256[]" },
		],
		stateMutability: "payable",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountOutMin", internalType: "uint256", type: "uint256" },
			{ name: "path", internalType: "address[]", type: "address[]" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "swapExactETHForTokens",
		outputs: [
			{ name: "amounts", internalType: "uint256[]", type: "uint256[]" },
		],
		stateMutability: "payable",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountOutMin", internalType: "uint256", type: "uint256" },
			{ name: "path", internalType: "address[]", type: "address[]" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "swapExactETHForTokensSupportingFeeOnTransferTokens",
		outputs: [],
		stateMutability: "payable",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountIn", internalType: "uint256", type: "uint256" },
			{ name: "amountOutMin", internalType: "uint256", type: "uint256" },
			{ name: "path", internalType: "address[]", type: "address[]" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "swapExactTokensForETH",
		outputs: [
			{ name: "amounts", internalType: "uint256[]", type: "uint256[]" },
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountIn", internalType: "uint256", type: "uint256" },
			{ name: "amountOutMin", internalType: "uint256", type: "uint256" },
			{ name: "path", internalType: "address[]", type: "address[]" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "swapExactTokensForETHSupportingFeeOnTransferTokens",
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountIn", internalType: "uint256", type: "uint256" },
			{ name: "amountOutMin", internalType: "uint256", type: "uint256" },
			{ name: "path", internalType: "address[]", type: "address[]" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "swapExactTokensForTokens",
		outputs: [
			{ name: "amounts", internalType: "uint256[]", type: "uint256[]" },
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountIn", internalType: "uint256", type: "uint256" },
			{ name: "amountOutMin", internalType: "uint256", type: "uint256" },
			{ name: "path", internalType: "address[]", type: "address[]" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountOut", internalType: "uint256", type: "uint256" },
			{ name: "amountInMax", internalType: "uint256", type: "uint256" },
			{ name: "path", internalType: "address[]", type: "address[]" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "swapTokensForExactETH",
		outputs: [
			{ name: "amounts", internalType: "uint256[]", type: "uint256[]" },
		],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		inputs: [
			{ name: "amountOut", internalType: "uint256", type: "uint256" },
			{ name: "amountInMax", internalType: "uint256", type: "uint256" },
			{ name: "path", internalType: "address[]", type: "address[]" },
			{ name: "to", internalType: "address", type: "address" },
			{ name: "deadline", internalType: "uint256", type: "uint256" },
		],
		name: "swapTokensForExactTokens",
		outputs: [
			{ name: "amounts", internalType: "uint256[]", type: "uint256[]" },
		],
		stateMutability: "nonpayable",
	},
	{ type: "receive", stateMutability: "payable" },
] as const;

export const executorAbi = [
	{
		inputs: [],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [],
		name: "AlreadyAcknowledged",
		type: "error",
	},
	{
		inputs: [],
		name: "AlreadyCommitted",
		type: "error",
	},
	{
		inputs: [],
		name: "AlreadyKnown",
		type: "error",
	},
	{
		inputs: [],
		name: "AlreadyRefunded",
		type: "error",
	},
	{
		inputs: [],
		name: "ExceedsMaxAssets",
		type: "error",
	},
	{
		inputs: [],
		name: "FailedTransfer",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidTxsNumber",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "btcBalance",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "btcFee",
				type: "uint256",
			},
		],
		name: "NotEnoughBalance",
		type: "error",
	},
	{
		inputs: [],
		name: "NotPending",
		type: "error",
	},
	{
		inputs: [],
		name: "TooEarly",
		type: "error",
	},
	{
		inputs: [],
		name: "UnsupportedAsset",
		type: "error",
	},
	{
		inputs: [],
		name: "WrongAccess",
		type: "error",
	},
	{
		inputs: [],
		name: "WrongLength",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "asset",
				type: "address",
			},
		],
		name: "ZeroRunesBalance",
		type: "error",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "txHash",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "btcAmount",
				type: "uint256",
			},
		],
		name: "Acknowledged",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "contract IERC20Extended",
				name: "cMidlAddress",
				type: "address",
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "btcAddress",
				type: "bytes32",
			},
		],
		name: "AddedAsset",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "blockNum",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "lastCommittedBlock",
				type: "uint256",
			},
		],
		name: "CommitedBlocksToBTC",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "txHash",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "sentTxsBatchHash",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "receiver",
				type: "bytes32",
			},
		],
		name: "CommittedSentTx",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "txHash",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address",
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "receiver",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "receiverBTC",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "btcAmount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes32[]",
				name: "assets",
				type: "bytes32[]",
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]",
			},
		],
		name: "Completed",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "txHash",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "btcAmount",
				type: "uint256",
			},
		],
		name: "RefundedCompleteTx",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "contract IERC20Extended",
				name: "cMidlAddress",
				type: "address",
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "btcAddress",
				type: "bytes32",
			},
		],
		name: "RemovedAsset",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "lastFeeUpdatedIndex",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "feeRate",
				type: "uint256",
			},
		],
		name: "UpdatedBTCFeeRate",
		type: "event",
	},
	{
		inputs: [],
		name: "COMPLETE_TX_COST",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "GAS_PRICE",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "MAX_ASSETS",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "MAX_MIDL_TXS",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "RUNES_MAGIC_VALUE",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "SCALE_BTC",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "bytes32",
						name: "txHash",
						type: "bytes32",
					},
					{
						internalType: "address",
						name: "from",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "btcAmount",
						type: "uint256",
					},
					{
						internalType: "bytes32[]",
						name: "midlTxs",
						type: "bytes32[]",
					},
					{
						internalType: "bytes32[]",
						name: "assets",
						type: "bytes32[]",
					},
					{
						internalType: "uint256[]",
						name: "amounts",
						type: "uint256[]",
					},
					{
						internalType: "bytes32[]",
						name: "metadata",
						type: "bytes32[]",
					},
					{
						internalType: "bytes",
						name: "btcTx",
						type: "bytes",
					},
				],
				internalType: "struct Executor.AcknowledgeTxData",
				name: "txData",
				type: "tuple",
			},
		],
		name: "acknowledgeTx",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "cMidlAddress",
				type: "address",
			},
			{
				internalType: "bytes32",
				name: "btcAddress",
				type: "bytes32",
			},
			{
				internalType: "enum Executor.AssetType",
				name: "assetType",
				type: "uint8",
			},
		],
		name: "addAsset",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "btcCMidlAddresses",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "btcCMidlSynthAddresses",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "btcFeeRate",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "btcMidlTxs",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "btcMidlTxsList",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "btcMidlTxsListSize",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "btcTxSentHash",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "btcTxs",
		outputs: [
			{
				internalType: "bytes",
				name: "",
				type: "bytes",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "cMidlBtcAddresses",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "cMidlBtcSynthAddresses",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "blockNum",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "lastCommittedBlock",
				type: "uint256",
			},
		],
		name: "commitBlocksToBTC",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "txHash",
				type: "bytes32",
			},
			{
				internalType: "bytes32",
				name: "btcTxSent",
				type: "bytes32",
			},
		],
		name: "commitSentTx",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "txHash",
				type: "bytes32",
			},
			{
				internalType: "bytes32",
				name: "receiver",
				type: "bytes32",
			},
			{
				internalType: "bytes32",
				name: "receiverBTC",
				type: "bytes32",
			},
			{
				internalType: "address[]",
				name: "assets",
				type: "address[]",
			},
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]",
			},
		],
		name: "completeTx",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "completeTxRefunded",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "_runeId",
				type: "bytes32",
			},
		],
		name: "getAssetAddressByRuneId",
		outputs: [
			{
				internalType: "address",
				name: "assetAddress",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_assetAddress",
				type: "address",
			},
		],
		name: "getRuneIdByAssetAddress",
		outputs: [
			{
				internalType: "bytes32",
				name: "runesId",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "lastAssetRequest",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "lastCommittedMidlBlock",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "lastFeeUpdate",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "pendingBTCTxReceiver",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "valueForQuorum",
				type: "bytes32",
			},
		],
		name: "reachedQuorum",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "txHash",
				type: "bytes32",
			},
			{
				internalType: "uint256",
				name: "btcAmount",
				type: "uint256",
			},
			{
				internalType: "bytes32[]",
				name: "assets",
				type: "bytes32[]",
			},
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]",
			},
		],
		name: "refundCompleteTx",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "cMidlAddress",
				type: "address",
			},
			{
				internalType: "bytes32",
				name: "btcAddress",
				type: "bytes32",
			},
			{
				internalType: "enum Executor.AssetType",
				name: "assetType",
				type: "uint8",
			},
		],
		name: "removeAsset",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "sentTxsBatches",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "contract ISynthReservoir",
				name: "_synthReservoir",
				type: "address",
			},
		],
		name: "setReservoir",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "synthReservoir",
		outputs: [
			{
				internalType: "contract ISynthReservoir",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "txsOrigins",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "feeRate",
				type: "uint256",
			},
		],
		name: "updateFeeRate",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "validators",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "validatorsNum",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "valueQuorum",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "valueQuorumVoted",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
] as const;
