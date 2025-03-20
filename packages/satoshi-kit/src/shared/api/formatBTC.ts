export const formatBTC = (satoshi: number, decimals = 4) => {
	const btc = satoshi / 100000000;
	const btcString = btc.toFixed(decimals);
	const btcNumber = Number.parseFloat(btcString);
	return btcNumber.toString();
};
