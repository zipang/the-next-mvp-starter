import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Switch as ChakraUISwitch } from "@chakra-ui/react";
import { createRef, useLayoutEffect, useState } from "react";
import { useFormValidationContext } from "../validation/FormValidationProvider";

/**
 * @typedef SwitchProps
 * @property {String} name
 * @property {String} label
 * @property {Array<checked,unchecked>} values The values to apply when the switch is activated/disactivated
 */
/**
 * This Switch has only two possible values (on/off) and cannot be in an undefined state
 * The real `values` can be provided as an array, if not they are equal to the boolean values : [false,true]
 * The first value passed to `values` correspond to the default value
 * @param {SwitchProps} props
 */
const Switch = ({
	name = "radio",
	label = "Y/N",
	values = [false, true],
	autoFocus = false,
	...moreProps
}) => {
	// Find the form validation context to register our input
	const inputRef = createRef();
	const { register, setData, getData, validate } = useFormValidationContext();

	// Register our Input so that the validation can take effect
	register(name, { inputRef, defaultValue: values[0], validation: {} });

	// Load the initial value from the Validation Context
	const [selectedValue, setSelectedValue] = useState(getData(name));

	const onChange = (evt) => {
		const selectedValue = evt.target.checked ? values[1] : values[0];
		setData(name, selectedValue);
		setSelectedValue(selectedValue);
	};

	useLayoutEffect(() => {
		if (autoFocus) {
			inputRef.current.focus();
		}
	}, [name]);

	return (
		<FormControl display="flex" alignItems="center" mt={3} id={name}>
			<FormLabel mb="0">{label}</FormLabel>
			<ChakraUISwitch
				ref={inputRef}
				defaultChecked={selectedValue === values[1]}
				onChange={onChange}
				size="sm"
				{...moreProps}
			/>
		</FormControl>
	);
};

export default Switch;
