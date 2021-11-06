/**
 * Check if current script is running in browser or not
 * @return {boolean}
 */
export const isBrowser = () =>
	typeof window !== "undefined" && typeof document !== "undefined";

const loadPromises = {};
let _loadedFiles = "";

/**
 *
 * @return {Boolean} TRUE if we are running locally
 */
export const isLocalhost = () =>
	Boolean(
		isBrowser() &&
			(window.location.hostname === "localhost" ||
				// [::1] is the IPv6 localhost address.
				window.location.hostname === "[::1]" ||
				// 127.0.0.1/8 is considered localhost for IPv4.
				window.location.hostname.match(
					/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
				))
	);

/**
 * Scroll to the desired element
 * @param {String} hash - #id of the element
 */
export const localScroll = (hash) => {
	if (!document) return false; // Prevent errors during SSR rendering
	const target = document.querySelector(hash);
	if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
	return false; // prevent default event on anchors
};

/**
 * Simple numeric hash of a string, used for non-secure usage only
 * @param str
 * @param namespace
 * @return {string}
 */
export const generateStringHash = (str, namespace) => {
	const nmspace = namespace || "";
	let hash = 0;
	let i;
	let chr;
	if (str.length === 0) return `${nmspace}__${hash}`;
	const strr = `${nmspace}_${str}`;
	for (i = 0; i < strr.length; i += 1) {
		chr = strr.charCodeAt(i);
		// eslint-disable-next-line
		hash = (hash << 5) - hash + chr;
		// eslint-disable-next-line
		hash |= 0; // Convert to 32bit integer
	}
	return `${nmspace}__${hash}`;
};

/**
 * Load javascript file by path
 * @param path
 * @param attributes
 * @return {Promise}
 */
export const loadScript = (path, attributes = {}) => {
	const pathHash = generateStringHash(path, "JS").toString();
	if (loadPromises[pathHash]) return loadPromises[pathHash];

	loadPromises[pathHash] = new Promise((resolve, reject) => {
		if (!isBrowser()) {
			// If not a browser then do not allow loading of
			// css file, return with success->false
			return reject(
				new Error(
					"Cannot call from server. Function can be executed only from browser"
				)
			);
		}

		// Do not load script if already loaded
		const previousLink = document.getElementById(pathHash);
		if (previousLink) {
			resolve();
			return previousLink;
		}

		let r;
		r = false;
		const s = document.createElement("script");
		s.type = "text/javascript";
		s.id = pathHash;
		s.src = path;
		s.defer = true;
		// eslint-disable-next-line
		s.onload = s.onreadystatechange = function () {
			if (!r && (!this.readyState || this.readyState === "complete")) {
				r = true;
				resolve();
			}
		};
		// Add custom attribute added by user
		Object.keys(attributes).forEach((attr) => {
			s[attr] = attributes[attr];
		});
		const t = document.getElementsByTagName("script")[0];
		t.parentNode.insertBefore(s, t);
		return s;
	});
	return loadPromises[pathHash];
};

export const loadStyle = (path) => {
	_checkFile(path) && appendStyle(path);
};

const _checkFile = (path) => Boolean(_loadedFiles.indexOf(`[${path}]` === -1));

const appendStyle = (path) => {
	if (!isBrowser()) return false;

	const fileRef = document.createElement("link");
	fileRef.setAttribute("rel", "stylesheet");
	fileRef.setAttribute("type", "text/css");
	fileRef.setAttribute("href", path);

	document.getElementsByTagName("head")[0].appendChild(fileRef);

	return Boolean((_loadedFiles += `[${path}]`));
};
