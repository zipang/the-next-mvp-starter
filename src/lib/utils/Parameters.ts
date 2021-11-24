import { NextApiRequest } from "next";

/**
 * That's how query parameters are already pre-parsed in Next.js
 */
export type QueryParameter = string | string[] | undefined;

/**
 * Parse an integer parameter that may have aliases (names variations)
 *
 * @param {Object} source The NextJS Api query object
 * @param {String|Array<String>} names Aliases for the parameter names
 * @param {Boolean} [required=false] Is it required ? (throws an exception when not present)
 * @returns {Number|undefined}
 * @throws {TypeError}
 */
export const parseIntegerParam = (
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
