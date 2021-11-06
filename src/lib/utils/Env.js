import NextEnv from "@next/env";
import baseDir from "../../../dirname.js"; // HACK TO AVOID READING import.meta.url

/**
 * Load the .env files
 * (useful for tests and scripts that are not executed inside the Next application)
 */
export const loadEnv = () => {
	console.log(
		`Loading environment variables for '${process.env.NODE_ENV}' from ${baseDir}`
	);
	// How can we know for sure the project root outside next..
	NextEnv.loadEnvConfig(baseDir);
};
