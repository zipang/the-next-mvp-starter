// Switch.stories.js
import { FormValidationProvider } from "../validation/FormValidationProvider";
import ValidatingForm from "../validation/ValidatingForm.js";
import Submit from "./Submit.js";
import Switch from "./Switch.js";

// This default export determines where your story goes in the story list
export default {
	title: "Switch Input with validation",
	component: Switch,
	args: {
		autoFocus: true,
		readOnly: false,
		defaultValue: null
	},
	argTypes: {
		autoFocus: { control: { type: "boolean" } },
		readOnly: { control: { type: "boolean" } },
		defaultValue: { control: { type: "text" } },
		name: { control: { type: null } },
		label: { control: { type: null } }
	}
};

export const MultipleSwitchesExample = ({ ...args }) => (
	<FormValidationProvider>
		<ValidatingForm id="multiple-switches-example">
			<Switch
				{...args}
				name="choice.ysn"
				label="Yes or No"
				values={[true, false]}
			/>
			<Switch
				{...args}
				name="choice.color"
				label="Black or White"
				values={["black", "white"]}
			/>
			<Switch
				{...args}
				name="choice.count"
				label="Get One or none"
				values={[0, 1]}
			/>

			<Submit>Valider</Submit>
		</ValidatingForm>
	</FormValidationProvider>
);

export const SimpleSwitchesOutputWithData = ({ ...args }) => (
	<FormValidationProvider data={{ choice: { color: "white", count: 1 } }}>
		<ValidatingForm id="multiple-switches-w-data">
			<Switch {...args} name="choice.ysn" label="Yes" values={[false, true]} />
			<Switch
				{...args}
				name="choice.color"
				label="Black or White"
				readOnly={true}
				values={["black", "white"]}
			/>
			<Switch
				{...args}
				name="choice.count"
				label="Get One or none"
				values={[1, 0]}
			/>

			<Submit>Valider</Submit>
		</ValidatingForm>
	</FormValidationProvider>
);
