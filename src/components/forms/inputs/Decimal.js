import Formatted from "./Formatted.js";
import {
	getDigitsOnly,
	formatDecimalWithUnit,
	isDecimal,
	isBetween
} from "../validation/utils.js";

export const serializeDecimal = (decimalsSeparator) => (str = "") => {
	const decimalParts = str
		.split(decimalsSeparator)
		.map(getDigitsOnly)
		.map((val) => val || "0");

	return Number.parseFloat(decimalParts.join("."));
};

/**
 * @typedef DecimalInputProps
 * @property {Number} [defaultValue]
 * @property {Boolean|String} [required=false]
 * @property {Object} validation Custom  validation rules
 * @property {String} [thousandsSeparator=" "] How to separate thousands groups of digits
 * @property {String} [decimalsSeparator=","] Decimal point symbol
 * @property {String} [unit] Optional unit (suffix)
 * @property {Array<Decimal,Decimal>} [plage] Optional plage of values to restrict the input
 * @property {Object} [validation] Custom validation rules
 * @property {String} [errorMessage] A custom error message when teh validation fails
 */
/**
 * Display a text input uniquely dedicated to integer numbers
 * With an optional unit
 * @param {DecimalInputProps} props
 */
const Decimal = ({
	thousandsSeparator = " ",
	decimalsSeparator = ",",
	defaultValue = null,
	required = false,
	errorMessage,
	maxDecimals,
	prefix = "",
	suffix = "",
	plage,
	validation = {},
	...props
}) => {
	if (required) {
		defaultValue = 0;
	}
	if (Array.isArray(plage)) {
		validation.isBetween = isBetween(plage[0], plage[1], errorMessage);
	}

	return (
		<Formatted
			required={required}
			format={formatDecimalWithUnit(
				thousandsSeparator,
				decimalsSeparator,
				maxDecimals,
				prefix,
				suffix
			)}
			serialize={serializeDecimal(decimalsSeparator)}
			defaultValue={defaultValue}
			validation={validation}
			inputType="tel"
			inputProps={{ style: { textAlign: "right" } }}
			{...props}
		/>
	);
};

export default Decimal;
