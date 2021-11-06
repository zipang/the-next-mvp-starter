// Text.stories.js
import {
	FormValidationProvider,
	useFormValidationContext
} from "../validation/FormValidationProvider";
import HiddenSubmit from "./HiddenSubmit.js";
import Text from "./Text.js";

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
			<HiddenSubmit label="Valider"></HiddenSubmit>
		</form>
	);
};

// This default export determines where your story goes in the story list
export default {
	title: "Text Input with validation",
	component: Text,
	args: {
		required: false,
		autoFocus: true,
		readOnly: false,
		rows: 1,
		defaultValue: ""
	},
	argTypes: {
		required: { control: { type: "boolean" } },
		autoFocus: { control: { type: "boolean" } },
		readOnly: { control: { type: "boolean" } },
		defaultValue: { control: { type: "text" } },
		rows: { control: { type: "number" } }
	}
};

export const SimpleText = ({ defaultValue, ...args }) => (
	<FormValidationProvider>
		<ValidatingForm id="simple-text-form">
			<Text
				{...args}
				defaultValue={defaultValue}
				helperText="With default value"
				name="firstName"
				label="Prénom"
			/>
			<Text
				{...args}
				name="lastName"
				label="Nom"
				placeHolder="Valjean"
				required="Saississez un nom"
				helperText="With place holder"
			/>
		</ValidatingForm>
	</FormValidationProvider>
);
SimpleText.args = {
	defaultValue: "Jean"
};

export const ReadOnlyTextWithData = ({ ...args }) => (
	<FormValidationProvider data={{ firstName: "John" }}>
		<ValidatingForm id="simple-text-form">
			<Text {...args} name="firstName" label="Prénom" />
		</ValidatingForm>
	</FormValidationProvider>
);
ReadOnlyTextWithData.args = {
	readOnly: true
};

export const TextArea = ({ ...args }) => (
	<FormValidationProvider data={{ message: "Once upon a time...\n" }}>
		<ValidatingForm id="simple-textarea-form">
			<Text {...args} name="message" label="Message" />
		</ValidatingForm>
	</FormValidationProvider>
);
TextArea.args = {
	rows: 5
};
