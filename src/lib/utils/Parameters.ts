import { NextApiRequest } from "next";

/**
 * That's how query parameters are already pre-parsed in Next.js
 */
export type QueryParameter = string | string[] | undefined;

/**
 * Parse a parameter into an integer value if available
 * @param {Object} source
 * @param {String|Array<String>} names Aliases for the parameter names
 * @param {Boolean} [required=false]
 * @returns {Number|undefined}
 * @throws {TypeError}
 */
export const parseInt = (
	source: NextApiRequest["query"],
	names: string | string[],
	required = false
): number | undefined => {
	// Passing only one parameter name
	if (typeof names === "string") {
		names = [names];
	}

	// Read inside the source (the half-parsed query)
	const str: QueryParameter = names.reduce(
		(found: QueryParameter, name) => (found !== undefined ? found : source[name]),
		undefined
	);

	if (typeof str === "string") {
		try {
			return Number.parseInt(str, 10);
		} catch (err) {
			throw new TypeError(
				`Parameter ${names.join("|")} is not of the expected type (integer)`
			);
		}
	}

	// str is not defined
	if (required) {
		throw new TypeError(`Parameter ${names.join("|")} (integer) is required`);
	}
	return undefined;
};
