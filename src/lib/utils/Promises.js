const unhandledRejectionEvent = "unhandledRejection";

/**
 * Build a promise that resolve in `ms` milliseconds with the response provided
 * NOTE: response may be a function, whose evaluation would be delayed by ms
 * @param {Number} ms The delay to wait before resolving the Promise
 * @param {Any} response The data to return after ms.
 * @return {Promise}
 */
export const delay = (ms, response) =>
	new Promise((resolve) =>
		setTimeout(
			() => resolve(typeof response === "function" ? response() : response),
			ms
		)
	);

/**
 * Unhandled Promises rejections will stop the current process in future nodeJS releases
 * => Do it now to detect all these dangerous promises rejections holes
 * @see https://github.com/mcollina/make-promises-safe#readme
 */
export const exitOnRejections = () => {
	process.on(unhandledRejectionEvent, (err) => {
		console.error(err);
		console.trace("Unhandled Promise stack");
		process.exit(1);
	});
};
