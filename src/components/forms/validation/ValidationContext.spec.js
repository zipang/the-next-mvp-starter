import suite from "baretest";
import code from "@hapi/code";
import {
	ValidationError,
	validateField,
	default as ValidationContext
} from "./ValidationContext.js";
const { expect } = code;

const johnDoe = {
	firstName: "John",
	lastName: "DOE",
	age: 20,
	address: {
		state: "CA"
	}
};
const janeDoe = {
	firstName: "Jane",
	last_name: "DOE",
	licenceId: "7654321",
	address: { city: "LA", state: "CA" }
};

// Some validation rules
const sevenDigits = {
	pattern: /^[\d]{7}$/,
	message: "This code must contain seven digits"
};

//
const plage = (min, max) => (value) => {
	return value >= min && value <= max;
};
const isInteger = (value) => Number.isInteger(value) || "This value must be an integer";
const percentStrict = {
	validate: plage(0, 100),
	message: "This percentage must be between 0 and 100"
};

const ValidationContextTestSuite = suite("ValidationContext");

/**
 * Test the validation function
 */
ValidationContextTestSuite("validateField", () => {
	// Validations that succeed..
	// 1. required
	expect(validateField("firstName", "John", true)).to.be.true();

	// 2. patterns (regex)
	expect(validateField("code", "1234567", true, { sevenDigits })).to.be.true();

	// 3. function
	expect(validateField("percent", 50, true, { isInteger, percentStrict })).to.be.true();

	// Validations that will fail
	expect(() => validateField("firstName", "", "firstName must be provided")).to.throw(
		ValidationError,
		"firstName must be provided"
	);
	expect(isInteger(parseInt("a"))).to.equal("This value must be an integer");
	expect(() => validateField("address.cp", "XXXXX", true, { sevenDigits })).to.throw(
		ValidationError,
		"This code must contain seven digits"
	);
	expect(() => validateField("age", parseInt("a"), false, { isInteger })).to.throw(
		ValidationError,
		"This value must be an integer"
	);
	expect(() =>
		validateField("percent", 110, true, { isInteger, percentStrict })
	).to.throw(ValidationError, "This percentage must be between 0 and 100");
});

/**
 * Test a ValidationContext with empty initial values
 */
ValidationContextTestSuite("validateField with interdependant validation rules", () => {
	const { register, setData, validate } = new ValidationContext({
		data: janeDoe
	});

	register("age", {
		required: (data) => (data.licenceId ? "Age is required for a licence id" : false)
	});
	register("licenceId", {
		validation: {
			sevenDigits,
			ageRestriction: (licenceId, data) =>
				licenceId && data.age < 20
					? "You must be over twenty to have a licence id"
					: true
		}
	});

	let { data, errors } = validate();
	expect(errors.age.code).to.equal("required");
	expect(errors.age.message).to.equal("Age is required for a licence id");

	// Now let's set the age
	setData("age", 18);

	// Validate this again
	({ data, errors } = validate());
	console.log(errors);
	expect(errors.licenceId.code).to.equal("ageRestriction");
	expect(errors.licenceId.message).to.equal(
		"You must be over twenty to have a licence id"
	);
});

/**
 * Test a ValidationContext with empty initial values
 */
ValidationContextTestSuite("ValidationContext", () => {
	const { register, setData, validate } = new ValidationContext();

	register("firstName", { required: "firstName is required" });
	register("lastName", { required: true });
	register("address.cp", { validation: { sevenDigits } });

	// First validation
	let { data, errors } = validate();
	console.log("First validation", data, errors);

	expect(data.firstName).to.be.null();
	expect(errors.firstName.message).to.equal("firstName is required");

	setData("firstName", "John");
	setData("lastName", "DOE");
	setData("address.cp", "XXXXX");

	({ data, errors } = validate());
	console.log("Second validation", data, errors);

	expect(data.firstName).to.equal("John");
	expect(data.lastName).to.equal("DOE");

	expect(errors["address.cp"].message).to.equal("This code must contain seven digits");
});

export default ValidationContextTestSuite;
