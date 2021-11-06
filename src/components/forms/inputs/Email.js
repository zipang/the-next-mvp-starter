import Text from "./Text.js";

/**
 * @typedef EmailProps
 * @property {Object} validation
 * @property {String} errorMessage
 */

/**
 * Render a text Input with specific email validation
 * @param {EmailProps} props
 */
const Email = ({ validation = {}, errorMessage = "Email invalide", ...props }) => {
	const emailValidation = {
		...validation,
		invalidEmail: {
			pattern: /^.+@.+\..+$/,
			message: errorMessage
		}
	};
	return <Text validation={emailValidation} autoComplete="on" {...props} />;
};

export default Email;
