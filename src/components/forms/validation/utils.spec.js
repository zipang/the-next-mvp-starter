import suite from "baretest";
import code from "@hapi/code";
const { expect } = code;

import {
	formatInteger,
	formatIntegerWithUnit,
	applyNumericMask,
	applyDateMask
} from "./utils.js";

const UtilsTestSuite = suite("Validation utils");

UtilsTestSuite("Format Integers", () => {
	expect(formatInteger(" ")("9")).to.equal("9");
	expect(formatInteger("")("9")).to.equal("9");
	expect(formatInteger(" ")("9999")).to.equal("9 999");
});

UtilsTestSuite("Format Integers with a unit", () => {
	expect(formatIntegerWithUnit(" ", "$")("9")).equal("$9");
	expect(formatIntegerWithUnit("", "", "€")("9")).to.equal(["9", "€"]);
	expect(formatIntegerWithUnit(" ", "", "j/H")("9999")).to.equal(["9 999", "j/H"]);
});

UtilsTestSuite("Numeric masks", () => {
	expect(applyNumericMask("99 99 99 99")("1234")).equal(["12 34 ", "__ __"]);
});

export default UtilsTestSuite;
