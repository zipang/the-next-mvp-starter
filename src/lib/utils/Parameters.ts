import { NextApiRequest } from "next";

/**
 * That's how query parameters are already pre-parsed in Next.js
 */
export type QueryParameter = string | string[] | undefined;

/**
 * Parse a parameter that may have multiple aliases (names variations)
 *
 * @param {Object} source The NextJS Api query object
 * @param {String|Array<String>} names Aliases for the parameter names
 * @param {Boolean} [required=false] Is it required ? (throws an exception when not present)
 * @returns {String|undefined}
 * @throws {TypeError}
 */
export const parseParam = (
	source: NextApiRequest["query"],
	names: string | string[],
	required = false
): string | undefined => {
	// Received only one parameter name
	if (typeof names === "string") {
		names = [names];
	}

	// Read inside the source (the half-parsed query)
	const str: QueryParameter = names.reduce(
		(found: QueryParameter, name) => (found !== undefined ? found : source[name]),
		undefined
	);

	if (typeof str === "string") {
		return str;
	} else if (required) {
		throw new TypeError(`Parameter ${names.join("|")} (string) is required`);
	}
	return undefined;
};

/**
 * Parse a multi value parameter that may have multiple aliases (names variations)
 * If not using the traditional approach for multi value parameters : `choices=a&choices=b`
 * The values can also be comma separated : `choices=a,b`
 *
 * @param {Object} source The NextJS Api query object
 * @param {String|Array<String>} names Aliases for the parameter names
 * @param {Boolean} [required=false] Is it required ? (throws an exception when not present)
 * @returns {String|undefined}
 * @throws {TypeError}
 */
export const parseArrayParam = (
	source: NextApiRequest["query"],
	names: string | string[],
	required = false
): string[] => {
	// Received only one parameter name
	if (typeof names === "string") {
		names = [names];
	}

	// Read inside the source (the half-parsed query)
	const str: QueryParameter = names.reduce(
		(found: QueryParameter, name) => (found !== undefined ? found : source[name]),
		undefined
	);

	if (typeof str === "string") {
		return str.split(",");
	} else if (Array.isArray(str)) {
		return str;
	} else if (required) {
		throw new TypeError(`Parameter ${names.join("|")} (string[]) is required`);
	}

	// Nothing found, return an empty array
	return [];
};

/**
 * Parse an integer parameter that may have multiple aliases (names variations)
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
	// Received only one parameter name
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
