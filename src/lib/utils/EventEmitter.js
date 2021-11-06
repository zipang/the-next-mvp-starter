"use strict";

/**
 * @typedef EventEmitter
 * @property {Function} addEventListener Register an event listener
 * @property {Function} on Same as addEventListener
 * @property {Function} removeEventListener Remove an event listener
 * @property {Function} off Same as removeEventListener
 * @property {Function} emit Send an event
 * @property {Function} send Same as emit()
 */

/**
 * An EventEmitter for the front-side
 */
function EventEmitter() {}

const EP = EventEmitter.prototype;

/**
 * Registers an event listener for the specified event. If the listener has
 * already been registered for the event, this is a no-op.
 *
 * @param {string} name The event name.
 * @param {function} fn The listener function.
 */
EP.addEventListener = function (name, fn) {
	var eventMap = (this.__events = this.__events || {});
	var handlerList = (eventMap[name] = eventMap[name] || []);
	if (handlerList.indexOf(fn) < 0) {
		handlerList.push(fn);
	}
	console.log(`We have ${handlerList.length} listeners for ${name}`);
	return this;
};
EP.on = EP.addEventListener;

/**
 * Unregisters an event listener from the specified event. If the listener
 * hasn't been registered for the event, this is a no-op.
 *
 * @param {string} name The event name.
 * @param {function} fn The listener function.
 */
EP.removeEventListener = function (name, fn) {
	var eventMap = (this.__events = this.__events || {});
	var handlerList = eventMap[name];
	if (handlerList) {
		console.log(`Removing event handler for ${name} event`, fn);
		var index = handlerList.indexOf(fn);
		if (index >= 0) {
			handlerList.splice(index, 1);
		}
	}
	return this;
};
EP.off = EP.removeEventListener;

/**
 * Emits an event, causing all registered event listeners for that event to be
 * called in registration order.
 *
 * @param {string} name The event name.
 * @param {...*} var_args Arguments to call listeners with.
 */
EP.emit = function (name, var_args) {
	var eventMap = (this.__events = this.__events || {});
	var handlerList = eventMap[name];
	var args = Array.prototype.slice.call(arguments, 1);
	if (handlerList) {
		for (var i = 0, len = handlerList.length; i < len; i++) {
			var fn = handlerList[i];
			try {
				fn.apply(this, args);
			} catch (err) {
				console.log(
					`Event handler for ${name} has generated an error : ${err.message} !`
				);
			}
		}
	} else {
		console.warn(`No event handler for event '${name}'`);
	}
	return this;
};
EP.send = EP.emit;

EP.clearEvents = function () {
	this.__events = {};
};

export default EventEmitter;
