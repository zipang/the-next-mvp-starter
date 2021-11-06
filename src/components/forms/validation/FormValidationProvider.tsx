import { Context, createContext, useContext, useEffect, useState } from "react";
import { createValidationContext, ValidationContext } from "./ValidationContext";

const FormValidationContext: Context<any> = createContext(undefined);

/**
 * Provide the form validation context to children
 * IMPORTANT : Calling validate() will trigger a re-render if the validationState changes
 * @param {PropsWithChildren} props
 * @param {ValidationContextOptions} [props.options]
 */
export const FormValidationProvider = ({ children, data = {} }) => {
	// Store the initial validationContext state
	const newContext = createValidationContext({ data });
	const [validationContext, setValidationContext] =
		useState<ValidationContext>(newContext);

	useEffect(() => {
		// Validation context can globally change after a call to the `validate` or `setData` methods
		// Therefore we will check to apply a state change with the result of the validate() or setData() call
		["validate", "setData"].forEach((methodName) => {
			const originalMethod = newContext[methodName];
			// Note : be careful not to wrap the validate method multiple times
			if (!originalMethod._enhanced) {
				newContext[methodName] = (...args) => {
					const updatedValidationContext = originalMethod(...args);
					if (updatedValidationContext !== newContext) {
						setValidationContext(updatedValidationContext);
					}
					return updatedValidationContext;
				};
				newContext[methodName]._enhanced = true;
			}
		});
		setValidationContext(newContext);
	}, [data]);

	return (
		<FormValidationContext.Provider value={{ ...validationContext }}>
			{children}
		</FormValidationContext.Provider>
	);
};

/**
 * Hook to retrieve the parent Form ValidationContext
 * @return {ValidationContext}
 */
export const useFormValidationContext = (): ValidationContext => {
	const validationContext = useContext(FormValidationContext);
	if (validationContext === undefined) {
		throw new Error(
			`useFormValidationContext() hook can only be used from inside a <FormValidationProvider> parent`
		);
	}
	return validationContext;
};

/**
 * HOC : Wrap a component inside a Form Validation Context provider
 * Note : because of ESLint complaining we don't use an anonymous function here like :
 * > const AdHoc = (Component) => (props) => ( <i><Component {...props} /></i> );
 * @see Component definition is missing display name react/display-name
 *
 * @param {JSXElementConstructor} FormComponent
 * @param {ValidationContextOptions} options like `initialValues`
 * @param {Props} initialProps pass these to the wrapped component (he can receive more)
 * @return FormComponent
 */
export const withFormValidationContext = (FormComponent, options = {}, initialProps) => {
	// sick..
	const Wrapped = (props) => (
		<FormValidationProvider {...options}>
			<FormComponent {...initialProps} {...props} />
		</FormValidationProvider>
	);
	Wrapped.displayName = `WithFormValidationContext<${FormComponent.displayName}>`;

	return Wrapped;
};
