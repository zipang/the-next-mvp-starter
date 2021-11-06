// It's usually a big idea to extend native prototypes but..
// it can be damn useful too to chain array manipulations

const _ARRAY_EXTENSIONS = {
	last: function () {
		return this[this.length - 1];
	},
	/**
	 * Just scramble elements in place and return the array
	 * @return {Array}
	 */
	shuffle: function () {
		let len = this.length,
			i;
		while (len) {
			i = (Math.random() * len--) >>> 0;
			[this[len], this[i]] = [this[i], this[len]];
		}
		return this;
	},
	/**
	 * Move an element from one position to another
	 * @param {Number} from
	 * @param {Number} to
	 * @return {Array}
	 */
	move: function (from, to) {
		const arr = this,
			len = arr.length;

		if (!arr[from]) {
			// index not existing
			return arr;
		}

		const startIndex = from < 0 ? len + from : from;

		if (startIndex >= 0 && startIndex < len) {
			const endIndex = to < 0 ? len + to : to;

			const [item] = arr.splice(from, 1);
			arr.splice(endIndex, 0, item);
		}
		return arr;
	},
	partition: function (fn) {
		return this.reduce((acc, val) => {
			const p = fn(val);
			let pos = p;
			if (p === true) {
				pos = 0;
			} else if (p === false) {
				pos = 1;
			}
			// Insert the val at this position/key
			if (acc[pos] === undefined) {
				// First insertion at this poisition
				acc[pos] = []; // Init an empty array
			}
			acc[pos].push(val);
			return acc;
		}, []);
	},
	/**
	 * Re-order this array following the order given by the list and the key
	 *
	 * @param {Array<String>} list
	 * @param {String} key
	 * @return {Array}
	 */
	reorderFrom: function (list, key) {
		const arr = this;
		if (!Array.isArray(list)) {
			return arr; // We can't do this
		}
		const reordered = Array.from(list)
			.map((source) => arr.find((elt) => elt[key] === source))
			.filter((o) => Boolean(o)); // remove undefined values
		return reordered;
	}
};

export const extendsPrototype = (proto) => {
	Object.keys(_ARRAY_EXTENSIONS).forEach((methodName) => {
		if (!proto[methodName]) proto[methodName] = _ARRAY_EXTENSIONS[methodName];
	});
	return proto;
};

const extendArrays = () => extendsPrototype(Array.prototype);
export default extendArrays;
