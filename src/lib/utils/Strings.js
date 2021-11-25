const SLUG_FROM =
	"àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż";
const SLUG_TO =
	"aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz";
const SLUG_SEARCH = new RegExp(SLUG_FROM.split("").join("|"), "g");

export const slugify = (str = "") => {
	return str
		.toLowerCase()
		.replace(SLUG_SEARCH, (c) => SLUG_TO.charAt(SLUG_FROM.indexOf(c))) // Replace special characters
		.replace(/[^a-z0-9]+/g, "-") // dashify all forbidden chars
		.replace(/^-+|-+$/g, ""); // remove leading and trailing dash
};

export const StringExtensions = {
	camelize: function () {
		return this.trim().replace(/(\-|_|\s)+(.)?/g, function (mathc, sep, c) {
			return c ? c.toUpperCase() : "";
		});
	},
	capitalize: function () {
		return this.substr(0, 1).toUpperCase() + this.substring(1).toLowerCase();
	},
	//#thanks Google
	collapseWhitespace: function () {
		return this.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
	},
	contains: function (ss) {
		return this.indexOf(ss) >= 0;
	},
	count: function (ss) {
		return this.split("").reduce(
			(prevCount, letter) => prevCount + (letter === ss ? 1 : 0),
			0
		);
	},
	equalsIgnoreCase: function (s) {
		return this.toLowerCase() === s.toLowerCase();
	},
	endsWith: function (...suffixes) {
		for (let i = 0; i < suffixes.length; ++i) {
			const l = this.length - suffixes[i].length;
			if (l >= 0 && this.indexOf(suffixes[i], l) === l) return true;
		}
		return false;
	},
	isAlpha: function () {
		return !/[^a-z\xDF-\xFF]|^$/.test(this.toLowerCase());
	},
	isAlphaNumeric: function () {
		return !/[^0-9a-z\xDF-\xFF]/.test(this.toLowerCase());
	},
	isLower: function () {
		return this.isAlpha() && this.toLowerCase() === this;
	},
	isNumeric: function () {
		return !/[^0-9]/.test(this);
	},
	isUpper: function () {
		return this.isAlpha() && this.toUpperCase() === this;
	},
	lines: function () {
		//convert windows newlines to unix newlines then convert to an Array of lines
		return this.replaceAll("\r\n", "\n").s.split("\n");
	},
	replaceAll: function (ss, r) {
		return this.split(ss).join(r);
	},
	/**
	 * Convert a string to a URL-safe representation (all lowercase, a-z, 0-9, -)
	 * @param {String} str
	 * @return A URL-safe version of the string
	 */
	slugify: function () {
		return this.toLowerCase()
			.replace(SLUG_SEARCH, (c) => SLUG_TO.charAt(SLUG_FROM.indexOf(c))) // Replace special characters
			.replace(/[^a-z0-9]+/g, "-") // dashify all forbidden chars
			.replace(/^-+|-+$/g, ""); // remove leading and trailing dash
	},
	/**
	 * Split a string at given positions
	 * @param  {Array<Integer>} positions
	 * @return {Array<String>}
	 */
	splitAt: function (...positions) {
		let start = 0;
		let parts = positions.reduce((splitted, position) => {
			splitted.push(this.substr(start, position - start));
			start = position;
			return splitted;
		}, []);
		parts.push(this.substr(start)); // what's
		return parts;
	},
	startsWith: function (...prefixes) {
		for (let i = 0; i < prefixes.length; ++i) {
			if (this.lastIndexOf(prefixes[i], 0) === 0) return true;
		}
		return false;
	},
	toInt: function () {
		// If the string starts with '0x' or '-0x', parse as hex.
		return /^\s*-?0x/i.test(this) ? parseInt(this, 16) : parseInt(this, 10);
	},
	/**
	 * Extract the words from this string
	 * @return {Array<String>}
	 */
	words: function () {
		return this.match(/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g);
	},
	/**
	 * Split each words and make them begin with an uppercase
	 */
	toStartCase: function () {
		return this.words().reduce(
			(result, word, index) => result + (index ? " " : "") + upperFirst(word),
			""
		);
	}
};

export const extendsTarget = (target) => {
	Object.keys(StringExtensions).forEach((methodName) => {
		if (!target[methodName]) target[methodName] = StringExtensions[methodName];
	});
};

const extendStrings = () => extendsTarget(String.prototype);
export default extendStrings;
