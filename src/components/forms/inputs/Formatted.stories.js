// Formatted.stories.js
import {
	FormValidationProvider,
	useFormValidationContext
} from "../validation/FormValidationProvider";
import Formatted from "./Formatted.js";

/**
 * Allow only A-Z letters and 0-9 digits
 * + Convert letters to uppercase
 * @param {String} input
 */
const uppercaseAlpha = (input = "") => input.replace(/[^a-z\d]+/gi, "").toUpperCase();
const onlyDigits =
	(length) =>
	(input = "") =>
		input.replace(/[^\d]+/gi, "").substr(0, length);

const ValidatingForm = ({ children, ...props }) => {
	const { validate } = useFormValidationContext();

	// Just log what's goin on when submitting
	const onSubmit = (evt) => {
		evt.preventDefault();
		validate({
			onSuccess: console.log,
			onError: console.error
		});
	};

	return (
		<form onSubmit={onSubmit} {...props}>
			{children}
			<input type="submit" className="hidden" aria-hidden="true" />
		</form>
	);
};

// This default export determines where your story goes in the story list
export default {
	title: "Formatted Input with validation",
	component: Formatted,
	args: {
		required: false,
		autoFocus: true,
		readOnly: false,
		defaultValue: ""
	},
	argTypes: {
		required: { control: { type: "boolean" } },
		autoFocus: { control: { type: "boolean" } },
		readOnly: { control: { type: "boolean" } },
		defaultValue: { control: { type: "text" } }
	}
};

export const AlphaUppercaseFormatted = ({ ...args }) => (
	<FormValidationProvider>
		<ValidatingForm id="simple-text-form">
			<Formatted
				{...args}
				helperText="Accepts only letters and digits"
				name="code"
				label="Code"
				format={uppercaseAlpha}
			/>
		</ValidatingForm>
	</FormValidationProvider>
);

export const HowManyDigits = ({ length, ...args }) => (
	<FormValidationProvider data={{ cp: "12345" }}>
		<ValidatingForm id="simple-text-form">
			<Formatted
				{...args}
				readOnly={true}
				helperText="Read-only"
				format={onlyDigits(length)}
				name="cp"
				label="CP"
			/>
			<Formatted
				{...args}
				format={onlyDigits(length)}
				helperText="With default value"
				defaultValue="67890"
				name="cp1"
				label="CP"
			/>
			<Formatted
				{...args}
				format={onlyDigits(length)}
				helperText="Required"
				required={true}
				name="cp2"
				label="CP"
			/>
		</ValidatingForm>
	</FormValidationProvider>
);
HowManyDigits.args = {
	length: 5
};
