import { Center } from "@chakra-ui/layout";
import { CircularProgress } from "@chakra-ui/progress";
import { chakra } from "@chakra-ui/system";
import { useState } from "react";
import APIClient from "../../lib/services/APIClient.js";
import {
	useFormValidationContext,
	withFormValidationContext
} from "./validation/FormValidationProvider";

/**
 * @typedef APIFormProps
 * @property {String} action local URL of an API page
 * @property {String} [method=POST] HTTP method to use to submit the form data
 * @property {Function<FormData>} [onSubmit] optional function to handle the form data submission
 * @property {onSuccess} [onSuccess] optional function to handle the successfull API response
 * @property {onError} [onError] optional function to handle the failed API response
 */

/**
 * Automatically submit validated form data to the API
 * The APIForm will take care of the inputs validation before submitting to the API
 * @param {APIFormProps} props
 */
const APIForm = ({
	action,
	method = "POST",
	onSubmit,
	onSuccess,
	onError,
	children,
	...moreProps
}) => {
	const [submitting, setSubmitting] = useState(false);
	const { validate } = useFormValidationContext();

	/**
	 * Submit the form data to the API when it is validated
	 */
	const onValidationSuccess = async (formData) => {
		try {
			console.dir(`Sending form data to ${action} : `, JSON.stringify(formData));
			setSubmitting(true);
			const apiResponse = await APIClient[method.toLowerCase()](action, formData);
			if (typeof onSuccess === "function") {
				onSuccess(apiResponse);
			}
		} catch (err) {
			if (typeof onError === "function") {
				// return API error to provided callback
				onError(err);
			} else {
				// or display it
				alert(`API Form ${err.message}`);
			}
		}
		setSubmitting(false);
	};

	// Validate before submitting to the API
	const handleValidation = (evt) => {
		evt.preventDefault();
		validate({
			onSuccess: onSubmit || onValidationSuccess
		});
	};

	return (
		<Center>
			{!submitting && (
				<chakra.form
					action={action}
					method={method}
					onSubmit={handleValidation}
					{...moreProps}
				>
					{children}
				</chakra.form>
			)}
			{submitting && <CircularProgress isIndeterminate />}
		</Center>
	);
};

export default withFormValidationContext(APIForm);
