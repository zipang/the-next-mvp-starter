/*!
 * @description Recursive object extending
 * @author Viacheslav Lotsmanov <lotsmanov89@gmail.com>
 * @license MIT
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2018 Viacheslav Lotsmanov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

"use strict";

const isSpecificValue = (val) => {
	return val instanceof Buffer || val instanceof Date || val instanceof RegExp
		? true
		: false;
};

const cloneSpecificValue = (val) => {
	if (val instanceof Buffer) {
		var x = Buffer.alloc ? Buffer.alloc(val.length) : new Buffer(val.length);
		val.copy(x);
		return x;
	} else if (val instanceof Date) {
		return new Date(val.getTime());
	} else if (val instanceof RegExp) {
		return new RegExp(val);
	} else {
		throw new Error("Unexpected situation");
	}
};

/**
 * Recursive cloning array.
 */
export const deepCloneArray = (arr) => {
	var clone = [];
	arr.forEach(function (item, index) {
		if (typeof item === "object" && item !== null) {
			if (Array.isArray(item)) {
				clone[index] = deepCloneArray(item);
			} else if (isSpecificValue(item)) {
				clone[index] = cloneSpecificValue(item);
			} else {
				clone[index] = merge({}, item);
			}
		} else {
			clone[index] = item;
		}
	});
	return clone;
};

const safeGetProperty = (object, property) => {
	return property === "__proto__" ? undefined : object[property];
};

/**
 * Deeply merge new objects values inside the target object.
 * Different from Object.assign() in that all existing values are preserved and not replaced
 *
 * Returns extended object or false if have no target object or incorrect type.
 * @example
 *   merge(target, payload1, payload2, ...); // Will add all new keys to target
 *   const merged =
 * @return {Object} a new object instance with the fusion of all properties
 */
export const merge = (...args) => {
	if (!args.length) {
		return {};
	}

	if (typeof args[0] !== "object") {
		throw TypeError(`merge() target first argument is not an object`);
	}

	if (args.length === 1) {
		return args[0];
	}

	// Take the first element as the target
	var target = args.shift();

	var val, src, clone;

	args.forEach(function (obj) {
		// Skip argument if isn't an object, is null, or is an array
		if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
			return;
		}

		Object.keys(obj).forEach(function (key) {
			src = safeGetProperty(target, key); // source value
			val = safeGetProperty(obj, key); // new value

			// recursion prevention
			if (val === target) {
				return;
			} else if (typeof val !== "object" || val === null) {
				// if new value isn't object then just overwrite by new value
				// instead of extending.
				target[key] = val;
				return;
			} else if (Array.isArray(val)) {
				// just clone arrays (and recursive clone objects inside)
				target[key] = deepCloneArray(val);
				return;
			} else if (isSpecificValue(val)) {
				// custom cloning and overwrite for specific objects
				target[key] = cloneSpecificValue(val);
				return;
			} else if (typeof src !== "object" || src === null || Array.isArray(src)) {
				// overwrite by new value if source isn't object or array
				target[key] = merge({}, val);
				return;
			} else {
				// source value and new value is objects both, extending...
				target[key] = merge(src, val);
				return;
			}
		});
	});

	return target;
};
