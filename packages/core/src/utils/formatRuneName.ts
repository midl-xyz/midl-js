export const formatRuneName = (name: string) => {
	const runeName = name.trim().toLocaleUpperCase();

	if (!runeName) {
		throw new Error("Rune name cannot be empty");
	}

	const allowedCharacters = /^[A-Z•]+$/;

	if (!allowedCharacters.test(runeName)) {
		throw new Error("Rune name can only contain A-Z and •");
	}

	return runeName.replace(/•/g, ".");
};
