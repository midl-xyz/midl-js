export const formatRuneName = (name: string) => {
	const runeName = name.trim().toLocaleUpperCase();

	if (!runeName) {
		throw new Error("Rune name cannot be empty");
	}

	const allowedCharacters = /^[A-Z]+(•[A-Z]+)*$/;

	if (runeName.replace(/•/g, "").length > 26) {
		throw new Error("Rune name can contain up to 26 letters");
	}

	if (!allowedCharacters.test(runeName)) {
		throw new Error(
			"Rune name can only contain A-Z and • placed between letters",
		);
	}

	return runeName;
};
