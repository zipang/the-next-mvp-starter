import suite from "baretest";
import code from "@hapi/code";
import { splitPath, getProperty, setProperty } from "./NestedObjects.js";

const { expect } = code;

const testObject = {
	org: "X",
	members: [
		{
			firstName: "John",
			lastName: "DOE",
			address: { street: "X Mullholland Drive", city: "LA" }
		},
		{
			firstName: "Jane",
			lastName: "DOE",
			address: { street: "XXX Mullholland Drive", city: "LA" }
		}
	]
};

// Define our test suite
const NestedObjectsTestSuite = suite("NestedObjects utils");

/**
 * Split a path
 */
NestedObjectsTestSuite("Split a path", () => {
	expect(splitPath("")).to.be.an.empty().array();
	expect(splitPath("persons[0].address.street"))
		.array()
		.equals(["persons", "0", "address", "street"]);
});

NestedObjectsTestSuite("Get deep properties", () => {
	// Try a first level property
	expect(getProperty(testObject, "org")).to.equal("X");
	// Try an unexisting property to test default value
	expect(getProperty(testObject, "bad.name")).to.be.undefined();
	expect(getProperty(testObject, "bad.name", "I'll be There")).to.be.equal(
		"I'll be There"
	);
	// Now try deeper properties within an array
	expect(getProperty(testObject, "members[0].firstName")).to.equal("John");
	expect(getProperty(testObject, "members[1].firstName")).to.equal("Jane");
	expect(getProperty(testObject, "members[1].address.city")).to.equal(
		getProperty(testObject, "members[0].address.city")
	);
});

NestedObjectsTestSuite("Set deep preoperties", () => {
	// Try a first level property
	setProperty(testObject, "test", true);
	expect(testObject.test).to.be.a.boolean().true();
	// Now deeper
	setProperty(testObject, "contact.website.url", "https://X.org");
	setProperty(testObject, "contact.website.likes", 100000);
	expect(testObject.contact.website.url).to.equal("https://X.org");
	expect(testObject.contact.website.likes).to.equal(100000);
	// Adding to an existing array from scratch
	setProperty(testObject, "members[2].firstName", "Liliom");
	setProperty(testObject, "members[2].lastName", "Gallagher");
	expect(testObject.members.length).to.equal(3);
	expect(testObject.members[2].lastName).to.equal("Gallagher");
	// creating a non existing array
	setProperty(testObject, "stats.visits[0]", 0);
	expect(testObject.stats.visits).to.be.an.array().length(1);
	expect(testObject.stats.visits[0]).to.equal(0);
	// Updating existying properties
	setProperty(testObject, "members[0].lastName", "X");
	setProperty(testObject, "members[0].address.city", "SF");
	expect(testObject.members[0].lastName).to.equal("X");
	expect(testObject.members[0].address.city).to.equal("SF");
});

export default NestedObjectsTestSuite;
