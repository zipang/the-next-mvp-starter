// CheckBoxes.stories.js
import { FormValidationProvider } from "../validation/FormValidationProvider";
import ValidatingForm from "../validation/ValidatingForm.js";
import CheckBoxes from "./CheckBoxes.js";

const musicOptions = {
	rock: "Rock",
	punk: "Punk",
	indie: "Indie Rock",
	garage: "Garage",
	soul: "Soul",
	funk: "Funk",
	rnb: "Rythm & Blues",
	blues: "Blues",
	jazz: "Jazz",
	easy: "Easy Listening",
	kpop: "KPop",
	jpop: "JPop"
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
	title: "CheckBoxes Input with validation",
	component: CheckBoxes,
	args: {
		required: false,
		autoFocus: true,
		serialization: "array",
		readOnly: false
	},
	argTypes: {
		required: { control: { type: "boolean" } },
		autoFocus: { control: { type: "boolean" } },
		readOnly: { control: { type: "boolean" } },
		serialization: { control: { type: "select", options: ["array", "object"] } },
		defaultValue: { control: { type: null } },
		name: { control: { type: null } },
		label: { control: { type: null } }
	}
};

export const SimpleCheckBoxesOutput = ({ ...args }) => (
	<FormValidationProvider>
		<ValidatingForm id="simple-checkboxes-input">
			<CheckBoxes
				{...args}
				name="music_choices"
				label="Choose your music"
				options={musicOptions}
			/>
		</ValidatingForm>
	</FormValidationProvider>
);

export const MoreCheckBoxesInputs = ({ prefix, suffix, ...args }) => (
	<FormValidationProvider data={{ music_choices: ["punk", "rock", "indie", "garage"] }}>
		<ValidatingForm id="more-checkboxes-inputs">
			<CheckBoxes
				{...args}
				name="music_choices"
				label="Your music choices"
				readOnly={true}
				options={musicOptions}
				helperText="Read only"
			/>
			<CheckBoxes
				{...args}
				name="alternate_choices"
				label="Choose more than 2 sauces"
				options={saucesOptions}
				validation={{
					tooFew: (choices) =>
						choices.length < 2 ? "Not enough choices" : true
				}}
			/>
		</ValidatingForm>
	</FormValidationProvider>
);
