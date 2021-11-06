// Radio.stories.js
import { FormValidationProvider } from "../validation/FormValidationProvider";
import ValidatingForm from "../validation/ValidatingForm.js";
import Radio from "./Radio.js";

const musicOptions = {
	rock: "Rock",
	punk: "Punk",
	indie: "Indie Rock"
};
const saucesOptions = [
	{ code: "oyster", label: "Sauce Huitre" },
	{ code: "gingember", label: "Sauce Gingembre" },
	{ code: "garlic", label: "Sauce Ail" },
	{ code: "ketchup", label: "Sauce Ketchup" },
	{ code: "bbq", label: "Sauce BBQ" }
];

// This default export determines where your story goes in the story list
export default {
	title: "Radio Input with validation",
	component: Radio,
	args: {
		required: false,
		autoFocus: true,
		readOnly: false
	},
	argTypes: {
		required: { control: { type: "boolean" } },
		autoFocus: { control: { type: "boolean" } },
		readOnly: { control: { type: "boolean" } },
		defaultValue: { control: { type: null } },
		name: { control: { type: null } },
		label: { control: { type: null } },
		load: { control: { type: null } },
		serialize: { control: { type: null } }
	}
};

export const SimpleRadioOutput = ({ ...args }) => (
	<FormValidationProvider>
		<ValidatingForm id="simple-checkboxes-input" validateOnEnter={true}>
			<Radio
				{...args}
				name="choices.music"
				label="What's the best music ?"
				options={musicOptions}
			/>
		</ValidatingForm>
	</FormValidationProvider>
);

export const MoreRadioInputs = ({ prefix, suffix, ...args }) => (
	<FormValidationProvider data={{ choices: { music: "indie", sauce: "garlic" } }}>
		<ValidatingForm id="more-checkboxes-inputs">
			<Radio
				{...args}
				name="choices.music"
				label="Your music choice"
				readOnly={true}
				options={musicOptions}
				helperText="Read only"
			/>
			<Radio
				{...args}
				name="choices.sauce"
				label="Your special sauce"
				options={saucesOptions}
				validation={{
					notAvailable: (choice) =>
						choice === "bbq" ? "This sauce is not available now" : true
				}}
			/>
		</ValidatingForm>
	</FormValidationProvider>
);
