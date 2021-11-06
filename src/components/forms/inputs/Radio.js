import {
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Radio as ChakraUIRadio,
	RadioGroup,
	Stack
} from "@chakra-ui/react";
import { createRef, useLayoutEffect } from "react";
import { useFormValidationContext } from "../validation/FormValidationProvider";
import { isUndefined, noop } from "../validation/utils.js";
import { convertOptions } from "./utils.js";

/**
 * @typedef RadioProps
 * @property {String} name
 * @property {String} label
 * @property {Array|Object} options Available options to choose from (code + label) or map
 */
/**
 * The Radio has several options to choose from.
 * One selection is always required.
 * The first option is always selected if the `defaultValue` is not passed
 * @example
 *   <Radio name="gender" label="Gender" options={{ M:"Male", F:"Female "}} />
 * @param {RadioProps} props
 */
const Radio = ({
	name = "radio",
	label = "",
	helperText = "",
	options = [],
	defaultValue,
	load = noop,
	serialize = noop,
	autoFocus = false,
	readOnly = false,
	validation = {},
	size = 1 / 3,
	...moreProps
}) => {
	// Find the form validation context to register our input
	const inputRef = createRef();
	const { register, setData, getData, validate, errors } = useFormValidationContext();

	// Accept a hashmap (key : value) as different format
	if (!Array.isArray(options)) options = convertOptions(options);

	// Select the first value by default
	if (isUndefined(defaultValue)) defaultValue = options[0].code;

	// Do not focus on read-only items
	if (readOnly) autoFocus = false;

	// Register our Input so that the validation can take effect
	register(name, { inputRef, defaultValue, validation });

	// Load the initial value from the Validation Context
	const selectedValue = load(getData(name));
	const errorMessage = errors[name]?.message || "";

	const onChange = (selectedValue) => {
		setData(name, serialize(selectedValue));
		if (errorMessage) {
			validate(name); // Show when the selection becomes valid again
		}
	};

	useLayoutEffect(() => {
		if (autoFocus) {
			inputRef.current?.focus();
		}
	}, [name]);

	return (
		<FormControl
			as="fieldset"
			mt={2}
			isReadOnly={readOnly}
			isInvalid={Boolean(errorMessage)}

			// isDisabled={evalContextualProp(data, disabled)}
		>
			{label && (
				<FormLabel mb={0} component="legend">
					{label}
				</FormLabel>
			)}
			<RadioGroup
				name={name}
				defaultValue={selectedValue}
				onChange={onChange}
				{...moreProps}
			>
				<Stack direction="row">
					{options.map(({ code, label }, i) =>
						i === 0 ? (
							<ChakraUIRadio
								key={`${name}-${code}`}
								ref={inputRef}
								autoFocus={autoFocus}
								value={code}
								cursor="pointer"
							>
								{label}
							</ChakraUIRadio>
						) : (
							<ChakraUIRadio
								key={`${name}-${code}`}
								value={code}
								cursor="pointer"
							>
								{label}
							</ChakraUIRadio>
						)
					)}
				</Stack>
			</RadioGroup>
			<FormErrorMessage>{errorMessage}</FormErrorMessage>
			{!errorMessage && (
				<FormHelperText fontSize="small" mt={0}>
					{helperText}
				</FormHelperText>
			)}
		</FormControl>
	);
};

export default Radio;
