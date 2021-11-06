import code from "@hapi/code";
import suite from "baretest";
import extendArrays from "./Arrays.js";
extendArrays();

const { expect } = code;
const ArraysTestSuite = suite("Arrays extensions");

const arrTest1 = [
	{
		firstName: "John",
		lastName: "DOE",
		gender: "M"
	},
	{
		firstName: "Jane",
		lastName: "DOE",
		gender: "F"
	},
	{
		firstName: "Polly",
		lastName: "GONE",
		gender: "F"
	},
	{
		firstName: "Joey",
		lastName: "RAMONE",
		gender: "M"
	}
];

const isAMan = (p) => p.gender === "M";
const isAWoman = (p) => p.gender === "F";

/**
 * Check the API
 */
ArraysTestSuite("Array partition with boolean return", () => {
	const [men, women] = arrTest1.partition((p) => p.gender === "M");

	expect(men.length).to.equal(2);
	expect(women.length).to.equal(2);

	expect(men.every(isAMan)).to.be.true();
	expect(women.every(isAWoman)).to.be.true();
});

export default ArraysTestSuite;
