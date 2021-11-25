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

/**
 * Run a list of jobs concurrently with a limit
 * @param {Array<Function>} jobs
 * @param {Number} [concurrency=2] Limit the number of jobs running concurrently
 * @returns {Array}
 */
export const waitForAllJobs = async (jobs, concurrency = 2) => {
	let currentJobIndex = 0;
	const results = [];

	// Take the next job and
	const execThread = async () => {
		while (currentJobIndex < jobs.length) {
			const curIndex = currentJobIndex++;
			// Use of `curIndex` is important because `index` may change after await is resolved
			results[curIndex] = await jobs[curIndex]();
		}
	};

	// Start a pseudo pool of threads
	const pool = [];
	for (let i = 0; i < concurrency; i++) {
		pool.push(execThread());
	}
	await Promise.all(pool);
	return results;
};
