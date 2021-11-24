/**
 * Test if there is some entries in an object
 * @param {Object} obj
 * @return {Boolean} TRUE if this object has no entries
 */
export const isEmpty = (obj) => Object.keys(obj).length === 0;

/**
 * Split a path to a property into its keys
 * (property names or array indexes)
 * @example
 *   splitPath("persons[0].address.street") => ["persons", "0", "address", "street"]
 * @param {String} path
 * @return {Array<String>}
 */
export const splitPath = (path = "") => path.split(/[,[\].]+?/).filter(Boolean);

/**
 * Extract the property value at the designed path
 * @example getProperty({ person: { firstName: "John" }}, "person.firstName", "")
 * @param {Object} source Object to extract the property from
 * @param {String} path Usings dots and [] to access sub properties
 * @param {Object} [defaultValue] what to return if the property is not found (undefined)
 * @return {Any}
 */
export const getProperty = (source = {}, path = "", defaultValue = undefined) => {
	const result = splitPath(path).reduce(
		(result, key) => (result !== null && result !== undefined ? result[key] : result),
		source
	);

	return result === undefined || result === null || result === source
		? defaultValue
		: result;
};

/**
 * Set a new property value by its path
 * @param {Object} source
 * @param {String} path
 * @param {Any} newValue
 */
export const setProperty = (source = {}, path = "", newValue) => {
	let property = source;
	const keys = splitPath(path);
	const lastKey = keys.pop();
	keys.forEach((key, i) => {
		if (property[key] === undefined) {
			// Look ahead to see if we need to create an array or an object as receptor of the property
			const nextKey = keys[i + 1] === undefined ? lastKey : keys[i + 1];
			if (Number.isInteger(parseInt(nextKey + ""))) {
				// It's an array index
				property[key] = Array(parseInt(nextKey + "") + 1).fill(undefined);
			} else {
				property[key] = {};
			}
		}
		property = property[key];
	});
	property[lastKey + ""] = newValue;
	return source;
};
