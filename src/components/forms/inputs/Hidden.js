import React, { createRef } from "react";
import { useFormValidationContext } from "../validation/FormValidationProvider";

/**
 * @typedef HiddenProps
 * @property {String}  name The name of the field (can use dots to describe a deeply nested property)
 * @property {String}  [defaultValue] Default value is returned if nothing was entered
 */

/**
 * Basically same features as Text input
 * but with validation
 * @param {HiddenProps} props -
 */
const Hidden = ({ name = "text", defaultValue = "", ...moreProps }) => {
	// Find the form validation context to register our input
	const inputRef = createRef();
	const { register } = useFormValidationContext();

	// Register our Input so that the validation can take effect
	register(name, { inputRef, defaultValue });

	return <input type="hidden" name={name} ref={inputRef} />;
};

export default Hidden;
