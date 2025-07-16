"use client";

import { useState } from "react";

export const DarkModeToggle = () => {
	const [darkMode, setDarkMode] = useState(
		document.documentElement.classList.contains("dark"),
	);

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
		document.documentElement.classList.toggle("dark", !darkMode);
	};
	return (
		<button type="button" onClick={toggleDarkMode}>
			{darkMode ? "Light Mode" : "Dark Mode"}
		</button>
	);
};
