// YesNo.stories.js
import { FormValidationProvider } from "../validation/FormValidationProvider";
import ValidatingForm from "../validation/ValidatingForm.js";
import Submit from "./Submit.js";
import Text from "./Text.js";
import YesNo from "./YesNo.js";

const OuiNon = YesNo("Oui", "Non");
const YSN = YesNo();

// This default export determines where your story goes in the story list
export default {
	title: "YesNo Input with validation",
	component: YesNo,
	args: {
		autoFocus: true,
		readOnly: false,
		defaultValue: false
	},
	argTypes: {
		autoFocus: { control: { type: "boolean" } },
		readOnly: { control: { type: "boolean" } },
		defaultValue: { control: { type: "boolean" } },
		name: { control: { type: null } },
		label: { control: { type: null } }
	}
};

export const SimpleYesNoOutput = ({ ...args }) => (
	<FormValidationProvider>
		<ValidatingForm id="simple-ysn">
			<YSN
				{...args}
				name="choices.icecream"
				autoFocus={true}
				label="Do you like ice cream ?"
			/>
			<OuiNon {...args} name="choices.glace" label="Aimez-vous les glaces ?" />
			<Submit>Valider</Submit>
		</ValidatingForm>
	</FormValidationProvider>
);

export const MoreYesNoInputsWithData = ({ prefix, suffix, ...args }) => (
	<FormValidationProvider
		data={{ choices: { icecream: true, glaces: true, fish: false } }}
	>
		<ValidatingForm id="more-checkboxes-inputs">
			<YSN
				{...args}
				name="choices.icecream"
				label="Do you like ice-cream?"
				readOnly={true}
				helperText="Read only"
			/>
			<OuiNon
				{...args}
				name="choices.glaces"
				label="Aimez-vous les glaces ?"
				readOnly={true}
				helperText="Read only"
			/>
			<OuiNon
				{...args}
				name="choices.fish"
				label="Aimez-vous le poisson surgelé ?"
			/>
			<Submit>Valider</Submit>
		</ValidatingForm>
	</FormValidationProvider>
);

export const YesNoInputsWithDependant = ({ prefix, suffix, ...args }) => (
	<FormValidationProvider>
		<ValidatingForm id="more-checkboxes-inputs">
			<YSN {...args} name="icecream.like" label="Do you like ice-cream ?" />
			<Text
				{...args}
				name="icecream.favourite"
				label="Favourite flavour ?"
				required={(data) => data.icecream.like}
				disabled={(data) => !data.icecream.like}
				helperText="Dependant"
			/>
			<Submit>Valider</Submit>
		</ValidatingForm>
	</FormValidationProvider>
);
