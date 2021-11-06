import Text from "./Text.js";
import Formatted from "./Formatted.js";
import Integer from "./Integer.js";
import Decimal from "./Decimal.js";
import Date from "./Date.js";
import Percent from "./Percent.js";
import CheckBoxes from "./CheckBoxes.js";
import SelectBox from "./SelectBox.js";
import Switch from "./Switch.js";
import Radio from "./Radio.js";
import Tel from "./Tel.js";
import Email from "./Email.js";
import Url from "./Url.js";

const customInputs = {};

const Input = ({ type, ...fieldProps }) => {
	switch (type) {
		case "text":
			return <Text {...fieldProps} />;
		case "switch":
			return <Switch {...fieldProps} />;
		case "checkboxes":
			return <CheckBoxes {...fieldProps} />;
		case "radio":
			return <Radio {...fieldProps} />;
		case "select":
			return <SelectBox {...fieldProps} />;
		case "date":
			return <Date {...fieldProps} />;
		case "integer":
			return <Integer {...fieldProps} />;
		case "decimal":
			return <Decimal {...fieldProps} />;
		case "percent":
			return <Percent {...fieldProps} />;
		case "email":
			return <Email {...fieldProps} />;
		case "tel":
			return <Tel {...fieldProps} />;
		case "url":
			return <Url {...fieldProps} />;
		case "formatted":
			return <Formatted {...fieldProps} />;

		default:
			if (customInputs[type]) {
				return customInputs[type]({ ...fieldProps });
			} else {
				return <Text {...fieldProps} />;
			}
	}
};

/**
 * Register a custom input to render them using a specific key
 * <Input type="custom" {...props} />
 * @param {String} key The custom type value to register
 * @param {Function} render
 */
Input.registerInput = (name, render) => {
	customInputs[name] = render;
};

export default Input;
