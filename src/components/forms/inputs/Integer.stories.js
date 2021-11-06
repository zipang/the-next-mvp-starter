// Integer.stories.js
import { FormValidationProvider } from "../validation/FormValidationProvider";
import ValidatingForm from "../validation/ValidatingForm.js";
import Integer from "./Integer.js";

// This default export determines where your story goes in the story list
export default {
	title: "Integer Input with validation",
	component: Integer,
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

export const SimpleInteger = ({ ...args }) => (
	<FormValidationProvider>
		<ValidatingForm id="simple-integer-form">
			<Integer
				{...args}
				helperText="Entrez un chiffre"
				name="count"
				label="Compte"
			/>
		</ValidatingForm>
	</FormValidationProvider>
);

export const MoreIntegerInputs = ({ unit, ...args }) => (
	<FormValidationProvider data={{ cp: "12345" }}>
		<ValidatingForm id="multiple-integer-inputs">
			<Integer
				{...args}
				helperText="Restricted to plage 0-10000"
				name="many"
				label="Quantity"
				plage={[0, 10000]}
			/>
			<Integer
				{...args}
				required={true}
				helperText="Use a prefix unit"
				name="donation_dollars"
				label="Donation ($)"
				prefix="$"
			/>
			<Integer
				{...args}
				required={true}
				helperText="Use a suffix unit"
				name="donation_euros"
				label="Donation (€)"
				suffix=" €"
			/>
		</ValidatingForm>
	</FormValidationProvider>
);
MoreIntegerInputs.args = {
	unit: "€"
};
