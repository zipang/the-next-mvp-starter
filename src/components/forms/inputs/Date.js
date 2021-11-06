import Formatted from "./Formatted.js";
import { isDate, applyDateMask, serializeDate, formatDate } from "../validation/utils.js";

/**
 * @typedef DateInputProps extends FormattedInputProps
 * @property {String} name
 * @property {String} label
 * @property {String} format The date format. Use `d` for days, `m` for months, `y` for years
 * @property {String} [defaultValue] Default date value if there is none in the context
 * @property {Boolean|String} [required=false]
 * @property {Object} [validation] Additional custom validation rules
 * @property {String} [errorMessage] A custom error message when the validation fails
 */
/**
 * Display a text input uniquely dedicated to dates
 * The date serialization is made using the ISO 8601 format
 * Note : the defaultValue must be given in ISO format
 * @example
 *   <Date name="french_date" format="dd/mm/yyyy" />
 *   <Date name="us_date" format="mm/dd/yyyy" />
 * @param {DateInputProps} props
 */
const Date = ({
	format = "dd/mm/yyyy",
	defaultValue = null,
	required = false,
	errorMessage,
	validation = {},
	...props
}) => {
	validation.isDate = isDate(errorMessage);

	return (
		<Formatted
			required={required}
			format={applyDateMask(format)}
			serialize={serializeDate(format)}
			load={formatDate(format)}
			defaultValue={defaultValue}
			validation={validation}
			inputType="tel"
			inputProps={{ style: { textAlign: "right" } }}
			{...props}
		/>
	);
};

export default Date;
