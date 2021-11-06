// Decimal.stories.js
import { FormValidationProvider } from "../validation/FormValidationProvider";
import ValidatingForm from "../validation/ValidatingForm.js";
import Decimal from "./Decimal.js";

// This default export determines where your story goes in the story list
export default {
	title: "Decimal Input with validation",
	component: Decimal,
	args: {
		required: false,
		autoFocus: true,
		readOnly: false,
		defaultValue: 0,
		thousandsSeparator: ".",
		decimalsSeparator: ",",
		prefix: "",
		suffix: ""
	},
	argTypes: {
		required: { control: { type: "boolean" } },
		autoFocus: { control: { type: "boolean" } },
		readOnly: { control: { type: "boolean" } },
		defaultValue: { control: { type: "number" } },
		name: {
			control: {
				type: null
			}
		},
		label: {
			control: {
				type: null
			}
		},
		thousandsSeparator: {
			control: {
				type: "select",
				options: [" ", ".", "'"]
			}
		},
		decimalsSeparator: { control: { type: "select", options: [".", ","] } },
		suffix: { control: { type: "select", options: ["€", "kg", "j/H", "kms"] } },
		prefix: { control: { type: "select", options: ["", "$", "￥"] } }
	}
};

export const SimpleDecimalOutput = ({ ...args }) => (
	<FormValidationProvider>
		<ValidatingForm id="simple-decimal-input">
			<Decimal
				{...args}
				helperText="2 decimals are allowed"
				name="decimal_value"
				label="A"
			/>
		</ValidatingForm>
	</FormValidationProvider>
);

export const MoreDecimalInputs = ({ prefix, suffix, ...args }) => (
	<FormValidationProvider data={{ quantity: 500.5 }}>
		<ValidatingForm id="multiple-decimal-inputs">
			<Decimal
				{...args}
				helperText="Tip : change the separators"
				name="quantity"
				label="Quantity (<1000)"
				plage={[0, 1000]}
			/>
			<Decimal
				{...args}
				required={true}
				helperText="Use a prefix unit"
				name="donation_dollars"
				label={`Donation (${prefix})`}
				suffix=""
				prefix={prefix}
			/>
			<Decimal
				{...args}
				required={true}
				helperText="Change the suffix unit"
				name="decimal_input"
				label={`Measure (${suffix})`}
				prefix=""
				suffix={suffix}
			/>
		</ValidatingForm>
	</FormValidationProvider>
);
