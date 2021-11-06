import Integer from "./Integer.js";
import { isInteger, isBetween } from "../validation/utils.js";

/**
 * @typedef PercentInputProps
 * @property {Number} [defaultValue]
 * @property {Boolean|String} [required=false]
 * @property {String} [thousandsSeparator=" "] How to separate thousands groups of digits
 * @property {String} [strict=false] Allow only values between 0 and 100
 * @property {String} [errorMessage] A custom error message when the validation fails
 */
/**
 * Display a text input uniquely dedicated to percentage
 * '%' suffix is automatically appended
 * @param {PercentInputProps} props
 */
const Percent = ({
	thousandsSeparator = " ",
	defaultValue = null,
	required = false,
	strict = false,
	errorMessage,
	...props
}) => {
	if (required) {
		defaultValue = 0;
	}
	const validation = {
		isInteger: isInteger(errorMessage)
	};
	if (strict) {
		validation.isBetween = isBetween(0, 100, errorMessage);
	}

	return (
		<Integer
			suffix="%"
			required={required}
			defaultValue={defaultValue}
			thousandsSeparator={thousandsSeparator}
			validation={validation}
			{...props}
		/>
	);
};

export default Percent;
