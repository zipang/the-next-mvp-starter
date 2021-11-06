export const _DEFAULT_MESSAGES = {
	isInteger: "This value must be an integer",
	isBetween: "This value must be between ${0} and ${1}",
	isDate: "Invalid Date"
};

export const noop = (val) => val;

export const isUndefined = (val) =>
	val === undefined || val === null || Number.isNaN(val);

export const isUndefinedOrEmpty = (val) => val === "" || isUndefined(val);

export const positiveNumber = (total) =>
	total === 0 ? "Ce nombre doit être positif (>0)" : true;

export const countSubstr = (s: string, ss: string) =>
	s.split("").reduce((prevCount, letter) => prevCount + (letter === ss ? 1 : 0), 0);

/**
 * Split a string at the given positions
 * @param {String} s
 * @param {Array<number>} positions
 * @returns {Array<string>}
 */
export const split = (s: string, ...positions: Array<number>) => {
	let start = 0;
	let parts = positions.reduce((splitted: Array<string>, position) => {
		splitted.push(s.substr(start, position - start));
		start = position;
		return splitted;
	}, []);
	parts.push(s.substr(start)); // what's
	return parts;
};

/**
 * Extracts only the digits from a given input string
 * Usable as the `format` property of a Formatted input
 * @return {String}
 */
export const getDigitsOnly = (str = "") => {
	return str.replace(/[^\d]+/gi, "");
};

/**
 * Eval properties like `required` or `disabled` can be a function depending
 * @param {Object} data Current data in the Validation Context
 * @param {Boolean|String|Function} prop The property definition (can be a function, a boolean or a string)
 * @return {Boolean|String} that evaluates if the current required property is true or false
 */
export const evalContextualProp = (data, prop) =>
	typeof prop === "function" ? prop(data) : prop;

/**
 * Generate an input formatter of digits only from a mask
 * @example
 *   const frenchTelMask = applyNumericMask("+(99) 9 99 99 99 99")
 *   const frenchDateMask = applyNumericMask("99/99/9999")
 * @param {String} mask Uses '9' to indicate the position of a digit ([0-9])
 * @return {Function} Usable as 'format' property inside Input.Formatter, Input.Date, Input.Tel..
 */
export const applyNumericMask =
	(mask = "99 99 99 99") =>
	(str = "") => {
		const howManyDigits = countSubstr(mask, "9");
		const validInput = getDigitsOnly(str).substr(0, howManyDigits);
		const digits = validInput.split("");
		const formatted = mask
			.split("")
			.map((maskLetter) => {
				return maskLetter === "9" ? digits.shift() || "_" : maskLetter;
			})
			.join("");
		const cursorPosition = formatted.indexOf("_"); // where is the rest of the mask ?
		return cursorPosition === -1 ? [formatted, ""] : split(formatted, cursorPosition);
	};

/**
 * Create a function that validates that a value is between the `min` and `max` range
 * @param {Number} min
 * @param {Number} max
 * @param {String} [msg] The error message to return if the validation fails
 * @return {true|String} If the return value is a string, that's an error message
 */
export const isBetween =
	(min, max, msg = _DEFAULT_MESSAGES.isBetween) =>
	(value) => {
		return (
			(value >= min && value <= max) ||
			msg.replace("${0}", min).replace("${1}", max)
		);
	};

/**
 * Build an integer validation function
 * @example
 *   <Formatted validation={{ isInteger }}
 * @param {String} errorMessage
 * @return {Function} the real `validation` fonction to use inside
 */
export const isInteger =
	(errorMessage = _DEFAULT_MESSAGES.isInteger) =>
	(value) =>
		Number.isInteger(value) || errorMessage;

/**
 *
 * @param {String} sep the character that will separate the blocks of 3 digits
 * @return {Function} the real formatter fonction to use inside <Formatted />
 * @example
 *   formatInteger(" ")(12345678) => "12 345 678"
 */
export const formatInteger =
	(sep = " ") =>
	(str = "") => {
		const number = getDigitsOnly(str + "");
		if (number === "" || sep === "") return number;
		const len = number.length;
		return number.split("").reduce(
			(prev, cur, i) =>
				i > 0 && (len - i) % 3 === 0
					? `${prev}${sep}${cur}` // add the separator between every 3 digits blocks
					: `${prev}${cur}`,
			""
		);
	};

/**
 * Format an integer and then append a unit before (prefix) or after (suffix)
 * @param {String} thousandsSeparator Separate every 000 blocks of digits
 * @param {String} [prefix=""]
 * @param {String} [suffix=""]
 * @return {String|Array<String,String>}
 */
export const formatIntegerWithUnit =
	(thousandsSeparator = ".", prefix = "", suffix = "") =>
	(str = "") => {
		const integerPart = formatInteger(thousandsSeparator)(str);
		if (suffix) {
			return [integerPart, suffix]; // This array splits at the cursor position for the next insertion
		} else {
			return prefix + integerPart;
		}
	};

/**
 * Format a decimal number
 * @param {Char} thousandsSeparator
 * @param {Char} decimalSeparator
 * @return {String}
 */
export const formatDecimal =
	(thousandsSeparator = " ", decimalSeparator = ".") =>
	(str = "") =>
		str
			.split(decimalSeparator)
			.map(formatInteger(thousandsSeparator))
			.join(decimalSeparator);

/**
 * Format an integer and then append a unit before (prefix) or after (suffix)
 * @param {String} thousandsSeparator Separate every 000 blocks of digits
 * @param {String} decimalsSeparator Decimal separator
 * @param {Numbre} [maxDecimals=2] Maximum number of decimals allowed
 * @param {String} [prefix=""]
 * @param {String} [suffix=""]
 * @return {String|Array<String,String>}
 */
export const formatDecimalWithUnit =
	(
		thousandsSeparator = ".",
		decimalsSeparator = ",",
		maxDecimals = 2,
		prefix = "",
		suffix = ""
	) =>
	(str = "") => {
		const decimalParts = (str + "")
			.split(decimalsSeparator)
			.map(formatInteger(thousandsSeparator))
			.map((val, i) => (i === 1 ? val.substr(0, maxDecimals) : val))
			.join(decimalsSeparator);

		if (suffix) {
			return [decimalParts, suffix]; // This array splits at the cursor position for the next insertion
		} else {
			return prefix + decimalParts;
		}
	};

/**
 * Build the validation function for ISO dates
 * @param {String} errorMessage
 * @return {Function}
 */
export const isDate =
	(errorMessage = _DEFAULT_MESSAGES.isDate) =>
	(isoDate) =>
		Number.isNaN(Date.parse(isoDate)) ? errorMessage : true;

/**
 * Build a masked input function following the given date format
 * The mask function return an array splitted on the next cursor position
 * @example
 *   applyDateMask("dd/mm/yyyy")("0102") => ["01/02/", "____"]
 * @param {String} format Like "dd/mm/yyyy"
 * @return {Function} Usable as format property
 */
export const applyDateMask =
	(format) =>
	(str = "") =>
		applyNumericMask(format.replace(/[dmy]/gi, "9"))(str);

/**
 * Given a date formatted with the given format
 * (using d for day positions, m for month position and y for year position)
 * Build the serializer function that will serialize the date representation back to ISO Format (yyyy-mm-dd)
 * @param {String} format
 * @return {Function} ISO date serializer usable inside <Date serialize />
 */
export const serializeDate =
	(format = "dd/mm/yyyy") =>
	(formattedDate = "") => {
		if (getDigitsOnly(formattedDate).length !== 8) return null; // uncomplete date input is not serializable
		const formatLetters = format.split("");
		const dateDigits = formattedDate.split("");
		const { year, month, day } = dateDigits.reduce(
			(prev, cur, i) => {
				if (formatLetters[i] === "d") {
					prev.day += cur;
				} else if (formatLetters[i] === "m") {
					prev.month += cur;
				} else if (formatLetters[i] === "y") {
					prev.year += cur;
				}
				return prev;
			},
			{
				year: "",
				month: "",
				day: ""
			}
		);
		console.log(`serializeDate ${formattedDate} to "${year}-${month}-${day}"`);
		return `${year}-${month}-${day}`;
	};

/**
 * Take a Date object or an ISO date string (eg. '2000-12-31')
 * and return it in the appropriate format
 * where 'dd' 'mm' 'yyyy' represent the position of 'day' 'month' and 'year' digits
 * @param {String} dateFormat desired output format
 * @return {Function} formatter function
 */
export const formatDate =
	(dateFormat = "dd/mm/yyyy") =>
	(str: any = "") => {
		if (!str) return "";

		if (str.toISOString) {
			str = str.toISOString().substr(0, 10);
		}

		const [year, month, day] = str.split("-");
		const formatted = dateFormat
			.replace("dd", day)
			.replace("mm", month)
			.replace("yyyy", year);
		console.log(`Formatting ${str} to ${formatted}`);
		return formatted;
	};

export const frenchDate = formatDate("dd/mm/yyyy");
export const usDate = formatDate("mm-dd-yyyy");
export const isoDate = formatDate("yyyy-mm-dd");

/**
 * Validate that an integer is between 0 and 100 (strict percentage)
 */
export const isPercentage = {
	validate: isBetween(0, 100),
	message: "This percentage must be between 0 and 100"
};
