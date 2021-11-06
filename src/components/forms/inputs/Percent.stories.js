// Percent.stories.js
import {
	FormValidationProvider,
	useFormValidationContext
} from "../validation/FormValidationProvider";
import Percent from "./Percent.js";

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
	title: "Percent Input with validation",
	component: Percent,
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

export const ReadOnlyPercent = ({ ...args }) => (
	<FormValidationProvider data={{ proportion: 50 }}>
		<ValidatingForm id="simple-integer-form">
			<Percent
				{...args}
				helperText="Read Only"
				name="proportion"
				label="Proportion"
			/>
		</ValidatingForm>
	</FormValidationProvider>
);
ReadOnlyPercent.args = {
	readOnly: true
};

export const SomePercentages = ({ unit, ...args }) => (
	<FormValidationProvider data={{ proportion: 75 }}>
		<ValidatingForm id="multiple-integer-inputs">
			<Percent
				{...args}
				helperText="Restricted to 0-100"
				name="proportion"
				label="Proportion"
				strict={true}
			/>
			<Percent
				{...args}
				required={true}
				helperText="Not restricted"
				name="performance"
				label="Performance"
			/>
		</ValidatingForm>
	</FormValidationProvider>
);
