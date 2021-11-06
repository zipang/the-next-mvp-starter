import Text from "./Text.js";

/**
 * Text Input with specific url validation
 * @param {TextInputProps} props
 */
const Url = ({ validation = {}, errorMessage = "URL invalide", ...props }) => {
	const urlValidation = {
		...validation,
		validate: {
			invalid: (val) => {
				if (!val) return true;
				try {
					new URL(val);
					return true;
				} catch (err) {
					return errorMessage;
				}
			}
		}
	};
	return <Text validation={urlValidation} {...props} />;
};

export default Url;
