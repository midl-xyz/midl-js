export const shortenAddress = (address: string, chars = 6) => {
	return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
