import { chakra } from "@chakra-ui/system";
import HiddenSubmit from "../inputs/HiddenSubmit.js";
import { useFormValidationContext } from "./FormValidationProvider";

/**
 * @typedef VFormProps
 * @property {Function<data>} onSuccess Callback called when the form validation is a success. The validated data is provided.
 * @property {Function<errors>} onError Callback called when the form validation is a failure. The errors object is provided.
 * @property {Boolean} validateOnEnter Add a hidden submit to catch the ENTER keypressed and trigger a form validation
 */

/**
 * This form MUST be used inside a <FormValidationProvider>
 * @param {VFormProps} props
 */
const ValidatingForm = ({
	onSuccess = console.log,
	onError = console.error,
	validateOnEnter = false,
	extraValidation,
	children,
	...props
}) => {
	const { validate } = useFormValidationContext();

	/**
	 * Prevent for submission, validate the field values
	 * And then call the appropriate callback
	 * @param {DOMEvent}
	 */

	const onSubmit = (evt) => {
		evt.preventDefault();
		validate({
			extraValidation,
			onSuccess,
			onError
		});
	};

	return (
		<chakra.form onSubmit={onSubmit} className="form" {...props}>
			{children}
			{validateOnEnter && <HiddenSubmit />}
		</chakra.form>
	);
};

export default ValidatingForm;
