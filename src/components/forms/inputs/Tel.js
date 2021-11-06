import { applyNumericMask } from "../validation/utils.js";
import Formatted from "./Formatted.js";

/**
 * Formatted Input for telephone numbers
 * @param {InputProps} props
 */
const Tel = ({
	format = "99 99 99 99 99",
	placeHolder = "01 23 45 67 89",
	validation = {},
	...props
}) => {
	const validationTel = {
		...validation,
		invalidFormat: {
			validate: (formatted) =>
				!formatted || formatted[0] === "0" ? true : "No invalide"
		}
	};
	return (
		<Formatted
			format={applyNumericMask(format)}
			validation={validationTel}
			size={14}
			placeHolder={placeHolder}
			inputType="tel"
			{...props}
		/>
	);
};

export default Tel;
