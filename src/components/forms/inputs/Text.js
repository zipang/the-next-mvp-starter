import {
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Textarea } from "@chakra-ui/textarea";
import React, { createRef, useEffect, useLayoutEffect } from "react";
import { useFormValidationContext } from "../validation/FormValidationProvider";
import { evalContextualProp } from "../validation/utils.js";
import { convertToStartCase } from "./utils.js";

/**
 * @typedef TextInputProps
 * @property {String}  name The name of the field (can use dots to describe a deeply nested property)
 * @property {String}  label The field label
 * @property {Boolean} [required=false] is this field value required ?
 * @property {String}  [defaultValue] Default value is returned if nothing was entered
 * @property {String}  [placeHolder=""] Text shown when no input or default value is given
 * @property {String}  [helperText=""]  Helper text is shown behind the input field
 * @property {Boolean} [autoFocus=false] Get focus on this field on page load ?
 * @property {Boolean} [readOnly=false] Can or cannot edit
 * @property {Object}  [validation={}] Validation object
 */

/**
 * Basically same features as Text input
 * but with validation
 * @param {TextInputProps} props -
 */
const Text = ({
	name = "text",
	label,
	placeHolder,
	helperText,
	size,
	rows = 1,
	required = false,
	disabled = false,
	defaultValue = "",
	autoFocus = false,
	readOnly = false,
	validation = {},
	...moreProps
}) => {
	// Find the form validation context to register our input
	const inputRef = createRef();
	const { register, data, errors, setData, getData, validate } =
		useFormValidationContext();

	const errorMessage = errors[name]?.message || "";
	const RenderTextInput = rows > 1 ? Textarea : Input;

	if (!label) label = convertToStartCase(name);

	// Keep form context data in sync
	const onChange = (evt) => {
		setData(name, evt.target.value);
		if (errorMessage) {
			validate(name); // Revalidate immediately to show when the input becomes valid again
		}
	};

	// Register our Input so that the validation can take effect
	register(name, { inputRef, required, defaultValue, validation });

	useEffect(() => {
		console.log(`Re-rendering text field ${name}`);
	});

	useLayoutEffect(() => {
		inputRef.current.value = getData(name); // Apply the default value
		if (autoFocus || errorMessage) {
			console.log(`Focus on ${name} (${errorMessage})`);
			inputRef.current.focus();
		}
	}, [name]);

	return (
		<FormControl
			id={name}
			mt={2}
			onChange={onChange}
			isDisabled={evalContextualProp(data, disabled)}
			isRequired={evalContextualProp(data, required)}
			isReadOnly={readOnly}
			isInvalid={Boolean(errorMessage)}
			size={size}
		>
			<FormLabel mb={0} paddingLeft={1} requiredIndicator={" *"}>
				{label}
			</FormLabel>
			<RenderTextInput
				name={name}
				ref={inputRef}
				variant="filled"
				height={`${rows * 2}rem`}
				borderRadius={0}
				autoFocus={autoFocus}
				placeholder={placeHolder}
				paddingInline={1}
				bgColor="transparent"
				borderColor="white"
				{...moreProps}
			/>
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

export default Text;
