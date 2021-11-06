import { getProperty, setProperty } from "../../../lib/utils/NestedObjects";
import { isUndefined, isUndefinedOrEmpty } from "./utils";

const _EMPTY_ERRORS = {};
export const allways = (val) => () => val; // Allways return the same value
export const filterByValue = (good) => (testVal) => testVal === good; // A filter that let only the 'good' values pass

/**
 * Dedicated error
 */
export class ValidationError extends TypeError {
	value: any;
	code: string;
	constructor(value, code, message) {
		super(message);
		this.value = value;
		this.code = code;
	}
	toString() {
		return this.message;
	}
}

/**
 * @typedef {Object} FieldDef Holds a reference to an input and its validation rules
 * @property {inputRef} Reference to set focus on field when validation fails
 * @property {Any} [defaultValue] The default value if not set by the context
 * @property {Boolean} [required=false]
 * @property {Object} validation rules
 */

/**
 * @typedef {FieldRegistrationFunction}
 * @property {String} name (path) to the property
 * @property {FieldDef} fieldDef
 */

/**
 * Build the field registration function
 * @param {Object} fields Map of the fields indexed by their property path (eg : "user.name")
 * @param {Object} data
 * @return {FieldRegistrationFunction}
 */
const registerField =
	(fields, data) =>
	(
		name,
		{
			inputRef,
			defaultValue = null,
			required = false,
			disabled = false,
			validation = {}
		}
	) => {
		// Store these references in our fields map
		fields[name] = { inputRef, required, validation };

		// Check to see if this field must be refreshed when external data changes
		if (typeof required === "function" || typeof disabled === "function") {
			fields._forceRefreshAfterChange = true;
		}

		let currentValue: any = getProperty(data, name);

		// Apply the default value if the context has no existing data for this property
		if (isUndefined(currentValue)) {
			setProperty(data, name, (currentValue = defaultValue));
		}

		console.log(
			`Registering field '${name}', required: ${required}, value: '${currentValue}'`,
			data
		);
	};

/**
 * Validate a value against a set of validation rules
 * @param {String} name The name of the property to validate (for error report)
 * @param {Any} value The current value of the property to validate
 * @param {Function|String|Boolean} required If required is a string, it's the error message to return
 * @param {Object} validation Validation rules with their own keys
 * @param {Object} data The whole data object in the validation context
 */
export const validateField = (
	name,
	value,
	required: Function | string | boolean = false,
	validation = {},
	data
) => {
	// First thing first : is this value required ?
	if (isUndefinedOrEmpty(value)) {
		const isValueRequired =
			typeof required === "function" ? required(data) : required;
		if (isValueRequired) {
			throw new ValidationError(
				value,
				"required",
				typeof isValueRequired === "string" ? isValueRequired : `Required field.`
			);
		} else {
			if (!Number.isNaN(value)) {
				return true; // 'Normal' empty values are allowed and no further validation is useful
			}
		}
	}

	// Then the other validation rules
	Object.keys(validation).forEach((ruleId) => {
		const rule = validation[ruleId];

		// What kind of validation is it (using duck typing to guess)
		if (rule.pattern && typeof rule.pattern.test === "function") {
			// Apply the regex to test the value
			if (!rule.pattern.test(value)) {
				console.log(`ValidationError : "${value}" against pattern`, rule.pattern);
				throw new ValidationError(
					value,
					ruleId,
					rule.message || `${name} has an invalid format`
				);
			}
		} else if (typeof rule === "function") {
			const test = rule(value, data);
			if (test !== true) {
				throw new ValidationError(
					value,
					ruleId,
					test || `${name} validation failed (${ruleId})`
				);
			}
		} else if (typeof rule?.validate === "function") {
			const test = rule.validate(value, data);
			if (test !== true) {
				throw new ValidationError(value, ruleId, test || rule.message);
			}
		}
	});

	return true; // It's validated !
};

/**
 * Validate the whole data against more validation rules who act globally
 * @param {Object} [validation] Additional validation rules with their own keys
 * @param {Object} data The whole data object in the validation context
 */
export const doExtraValidation = (validation = {}, data) => {
	// Then the other validation rules
	Object.keys(validation).forEach((ruleId) => {
		const validationRule = validation[ruleId];

		if (typeof validationRule === "function") {
			const test = validationRule(data);
			if (test !== true && Array.isArray(test)) {
				throw new ValidationError(
					test[0], // Here is in fact the name of the field where to put the message or 'global'
					ruleId,
					test[1] || `Extra validation failed (${ruleId})`
				);
			}
		} else if (typeof validationRule?.validate === "function") {
			const test = validationRule.validate(data);
			if (test !== true) {
				const { name, message } = test; // these test return must return a field name or 'global'
				throw new ValidationError(name, ruleId, test || message);
			}
		}
	});

	return true; // It's validated !
};

/**
 * Build the validate function
 * @param {ValidationContext} validationContext
 * @return {Function} Validate a single property or the whole registered fields in the context
 */
const buildValidate =
	(validationContext: ValidationContext) =>
	(
		name?: string | ValidationCallback | any,
		options: ValidationCallback | any = {}
	) => {
		// Extract what we need
		const { fields, data } = validationContext;

		if (name?.onSuccess || name?.onError) {
			// name is in fact the options object
			options = name;
			name = null;
		}

		if (typeof name === "string" && fields[name] === undefined) {
			return {
				unregistered: `Property ${name} is not registered and therefore cannot be validated`
			};
		}

		if (name === null) {
			console.log(
				`validate() called globally on registered fields ${Object.keys(fields)}`
			);
		}

		// Check to see if we have a filter to apply
		const validateASingleField = typeof name === "string";
		const filterFields = validateASingleField ? filterByValue(name) : allways(true);

		// Here is the real validation happening :
		// We loop over all the field names that have been registered
		let errors = Object.keys(fields)
			.filter(filterFields)
			.reduce((foundAnError, name) => {
				if (foundAnError !== _EMPTY_ERRORS) {
					return foundAnError; // The first encountered error is good for us
				}

				try {
					const { validation, required } = fields[name];
					validateField(
						name,
						getProperty(data, name),
						required,
						validation,
						data
					);
					// found an error ? nope
					return _EMPTY_ERRORS;
				} catch (err) {
					const { code, message } = err as ValidationError; // Extract the error parts
					const newFoundError = {}; // IMPORTANT : create a new instance
					newFoundError[name] = { code, message };
					fields[name].inputRef?.current?.focus();
					return newFoundError;
				}
			}, _EMPTY_ERRORS);

		// And now for the last (optional) validation step that comes when
		// each field has successfully passed its own validation rules
		const { extraValidation, onSuccess, onError } = options;

		if (errors === _EMPTY_ERRORS && extraValidation) {
			try {
				doExtraValidation(extraValidation, data);
			} catch (err) {
				const { value, code, message } = err as ValidationError; // Extract the error parts
				errors = {}; // IMPORTANT : create a new instance
				errors[value] = { code, message };
				if (value in fields) fields[value].inputRef?.current?.focus();
			}
		}

		// Do we have some callback to call ?
		if (onSuccess && errors === _EMPTY_ERRORS) {
			onSuccess(data);
		}

		if (onError && errors !== _EMPTY_ERRORS) {
			onError(errors);
		}

		if (validateASingleField || validationContext.errors !== errors) {
			console.log(`Validation errors have been raised.`, errors);
			// Return a new validationContext instance with the updated errors object
			// => WILL re-render all the registered fields
			return { ...validationContext, errors };
		} else {
			// Return the SAME validationContext instance
			// => will NOT re-render all the fields
			return validationContext;
		}
	};

/**
 * @typedef InitialValidationContext
 * @property {Object} [data={}] initial data
 * @property {Function} [onSuccess] Callback when data validation has been successful
 * @property {Function} [onError] Callback when data validation has been a failure
 */
export type InitialValidationContext = {
	data?: Object;
	onSuccess?: Function;
	onError?: Function;
};

/**
 *
 * @param {InitialValidationContext} options
 * @return {ValidationContext}
 */
export const createValidationContext = (options: InitialValidationContext = {}) => {
	console.log(`Building a new validation context`, options);

	const fields: ValidationRules = {};
	const errors = _EMPTY_ERRORS; // Empty errors state will allways point to the same object instance
	const data = options.data || {};

	const register = registerField(fields, data);
	const getData = (name, defaultValue) => getProperty(data, name, defaultValue);

	const validationContext = {
		fields,
		data,
		errors,
		register,
		getData
	} as ValidationContext;

	// And now.. for the methods that can have side-effects on the ValidationContext instance
	validationContext.validate = buildValidate(validationContext);

	validationContext.setData = (name, value) => {
		setProperty(data, name, value);
		if (fields._forceRefreshAfterChange) {
			return { ...validationContext }; // return a new instance
		} else {
			return validationContext;
		}
	};

	validationContext.setError = (name, error) => {
		const errors = {}; // Create a new instance
		errors[name] = error;
		return { ...validationContext, errors }; // return a new instance
	};

	return validationContext;
};

export interface ValidationRules {
	_forceRefreshAfterChange?: boolean;
	required?: boolean;
	validation?: object;
	inputRef?: React.RefObject<HTMLInputElement>;
}

export interface ValidationCallback {
	extraValidation?: Object;
	onSuccess?(cb: Function): void;
	onError?(cb: Function): void;
}

/**
 * Represent the current state of validation of a set of properties
 * with their type and validation rules
 * And the current data and errors
 */
export interface ValidationContext {
	/**
	 * The current Map of <field name>, <field value>
	 */
	data: object;

	/**
	 * Maps field names with their validation rules
	 */
	fields: { [fieldName: string]: ValidationRules };

	/**
	 * The current Map of <field name>, <field error>
	 */
	errors: object;

	/**
	 * Register a property
	 * @param {String} name (path) to the property
	 * @param {FieldDef} fieldDef
	 */
	register(name: string, fieldDef: object): void;

	/**
	 * Get the value of a property
	 * @param {String} name Path to the property
	 * @param {Any} [defaultValue]
	 * @return {Any}
	 */
	getData(name: string, defaultValue?: any): any;

	/**
	 * Set the new value of a property
	 * @param {String} name Path to the property
	 * @param {Any} value
	 * @return {ValidationContext} A new instance if updated
	 */
	setData(name: string, value: any): ValidationContext;

	/**
	 * Validate all or just one registered fields againts their stored values
	 * @param {String} [name] Optional
	 * @param {Object} [options] expected keys for the options : `onSuccess` and `onError`
	 * @return {ValidationContext}
	 */
	validate(name?: string, options?: object): void;

	/**
	 * Add a new error to the existing one
	 * @param {String} name Name of the field on which the validation error occured
	 * @param {Object} error
	 * @return {ValidationContext}
	 */
	setError(name: string, error: object): ValidationContext;
}
