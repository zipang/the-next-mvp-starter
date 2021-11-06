/**
 *
 * @param {String} uid
 * @param {Number} expirationDelay
 * @return
 */
export const retrieveFromCache = (uid, expirationDelay = 10 * 60 * 1000) => {
	if (typeof window === "undefined") return;
	let cached = window.localStorage.getItem(uid);
	if (!cached) return null;
	cached = JSON.parse(cached);
	if (cached.timeStamp > Date.now() - expirationDelay) {
		// expired
		return null;
	} else {
		console.log(`Loaded from cache`, cached);
		return cached;
	}
};

/**
 *
 * @param {String} uid
 * @param {Object} data
 */
export const storeInCache = (uid, data) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(
		uid,
		JSON.stringify({
			...data,
			timeStamp: Date.now()
		})
	);
};
