import Formatted from "./Formatted.js";
import {
	getDigitsOnly,
	formatIntegerWithUnit,
	isInteger,
	isBetween
} from "../validation/utils.js";

export const serializeInteger = (str) => {
	const digits = getDigitsOnly(str);
	return digits.length ? Number.parseInt(digits) : null;
};

/**
 * @typedef IntegerInputProps
 * @property {Number} [defaultValue]
 * @property {Boolean|String} [required=false]
 * @property {Object} validation Custom  validation rules
 * @property {String} [thousandsSeparator=" "] How to separate thousands groups of digits
 * @property {String} [prefix] Optional unit symbol (prefix)
 * @property {String} [sufix]  Optional unit symbol (sufix)
 * @property {Array<Integer,Integer>} [plage] Optional plage of values to restrict the input
 * @property {String} [errorMessage] A custom error message when teh validation fails
 */
/**
 * Display a text input uniquely dedicated to integer numbers
 * With an optional unit
 * @param {IntegerInputProps} props
 */
const Integer = ({
	thousandsSeparator = " ",
	defaultValue = null,
	required = false,
	errorMessage,
	prefix = "",
	suffix = "",
	plage,
	...props
}) => {
	if (required) {
		defaultValue = 0;
	}
	const validation = {
		isInteger: isInteger(errorMessage)
	};
	if (Array.isArray(plage)) {
		validation.isBetween = isBetween(plage[0], plage[1], errorMessage);
	}

	return (
		<Formatted
			required={required}
			format={formatIntegerWithUnit(thousandsSeparator, prefix, suffix)}
			serialize={serializeInteger}
			defaultValue={defaultValue}
			validation={validation}
			inputType="tel"
			inputProps={{ style: { textAlign: "right" } }}
			{...props}
		/>
	);
};

export default Integer;
