import {
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel
} from "@chakra-ui/form-control";
import { Select } from "@chakra-ui/select";
import { createRef } from "react";
import { useFormValidationContext } from "../validation/FormValidationProvider";
import { evalContextualProp } from "../validation/utils.js";
import { convertOptions, convertToStartCase } from "./utils.js";

/**
 * @typedef SelectBoxProps
 * @property {String} name
 * @property {String} label
 * @property {Map<String>|Array<code,value>} options
 * @property {ValidationObject} validation
 * @property {String} helperText
 * @property {String} defaultValue
 * @property {Boolean|Function} [required=false]
 * @property {Boolean|Function} [disabled=false]
 * @property {Boolean} [readOnly=false]
 */

/**
 * Select a value amongst one defined list of options
 * @param {SelectBoxProps} props
 */
const SelectBox = ({
	name = "select-box",
	label = "",
	options = [],
	defaultValue = "",
	helperText = "",
	autoFocus = false,
	required = false,
	readOnly = false,
	disabled = false,
	validation = {},
	...moreProps
}) => {
	const inputRef = createRef();

	// Accept a hashmap (key : value) as different format
	options = convertOptions(options);

	if (!label) label = convertToStartCase(name);

	// Find the Form Validation Context to register our input
	const { register, data, errors, setData, getData, validate } =
		useFormValidationContext();

	// Register our Input so that the validation can take effect
	register(name, { inputRef, required, defaultValue, validation });

	const selectedValue = getData(name, ""); // Material UI Select has a problem with null or undefined values
	const errorMessage = errors[name]?.message || "";

	const onChange = (evt) => {
		setData(name, evt.target.value || null);
		if (errorMessage) {
			validate(name); // Show when the input becomes valid again
		}
	};

	return (
		<FormControl
			mt={2}
			id={name}
			isRequired={evalContextualProp(data, required)}
			isDisabled={evalContextualProp(data, disabled)}
			isInvalid={Boolean(errorMessage)}
			isReadOnly={readOnly}
		>
			<FormLabel mb={0} paddingLeft={1}>
				{label}
			</FormLabel>
			<Select
				ref={inputRef}
				paddingInlineStart={1}
				borderRadius={0}
				defaultValue={selectedValue} // We use an uncontrolled component this way
				onChange={onChange}
				size="sm"
				autoFocus={autoFocus}
				{...moreProps}
			>
				{!required && (
					<option key={`${name}-empty-option`} value="">
						&nbsp;
					</option>
				)}
				{options.map((option) => (
					<option key={option.code} value={option.code}>
						{option.label}
					</option>
				))}
			</Select>
			<FormErrorMessage fontSize="small" mt={0} paddingLeft={1}>
				{errorMessage}
			</FormErrorMessage>
			{!errorMessage && (
				<FormHelperText fontSize="small" mt={0} paddingLeft={1}>
					{helperText}
				</FormHelperText>
			)}
		</FormControl>
	);
};

export default SelectBox;
