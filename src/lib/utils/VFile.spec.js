import suite from "baretest";
import code from "@hapi/code";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import VFile, { hasExtension } from "./VFile.js";

// REBUILD THE COMMON JS ENV VARIABLES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testSuite = suite("VFile");
const { expect } = code;

const me = VFile(__filename);

/**
 * Check the VFile
 */
testSuite("VFile exposes simple accessors to file path parts", () => {
	expect(me.filename).to.equal("VFile.spec.js");
	expect(me.name).to.equal("VFile.spec");
	expect(me.ext).to.equal("js");
	expect(me.dir).to.equal(__dirname);
	expect(me.path).to.equal(__filename);
});

/**
 * Check the VFile
 */
testSuite("hasExtension('.js') should be true", () => {
	const isJs = hasExtension(".js");
	expect(isJs(me)).to.be.true();
});
testSuite("hasExtension('.spec.js') can handle a long extension", () => {
	const isSpec = hasExtension(".spec.js");
	expect(isSpec(me)).to.be.true();
});
testSuite(
	"hasExtension('js', 'txt', 'md') test if file has at least one of these extensions",
	() => {
		const isJsOrTextOrMarkdown = hasExtension("js", "txt", "md");
		expect(isJsOrTextOrMarkdown(me)).to.be.true();
	}
);
testSuite(
	"hasExtension('txt', 'md', 'markdown') will fail if file has none of these extensions",
	() => {
		const isTextOrMarkdown = hasExtension("txt", "md", "markdown");
		expect(isTextOrMarkdown(me)).to.be.false();
	}
);
testSuite("hasExtension('txt', ['js', 'es', 'mjs']) will flatten all extensions", () => {
	const isTextOrJs = hasExtension("txt", ["js", "es", "mjs"]);
	expect(isTextOrJs(me)).to.be.true();
});

export default testSuite;
