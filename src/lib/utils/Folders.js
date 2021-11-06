export const EMPTY_RAILWAY = {
	leaf: "",
	parents: []
};

/**
 * @typedef Breadcrumbs
 * @property {String} leaf The name of the last node in the path
 * @property {Array<String>} parents An ordonned array of paths
 */

/**
 * Giving a slash '/' separated path,
 * extract the leaf and all the preceding parent paths
 * eg.
 *   makeBreadcrumbs("my/way/to/home") =>
 *   {
 *     leaf: "home",
 *     parents: [
 *       "my",
 *       "my/way",
 *       "my/way/to"
 *     ]
 *   }
 * @param {String} path
 * @param {Boolean} [includeLeaf=false] Include the leaf to the parents list
 * @return {Breadcrumbs}
 */
export const makeBreadcrumbs = (path, includeLeaf = false) => {
	if (!path) {
		return EMPTY_RAILWAY;
	}
	const parents = path.split("/");
	const leaf = parents.pop();
	for (let i = 1; i < parents.length; i++) {
		parents[i] = parents[i - 1] + "/" + parents[i];
	}
	if (includeLeaf) {
		if (parents.length) {
			parents.push(parents[parents.length - 1] + "/" + leaf);
		} else {
			parents.push(leaf);
		}
	}
	return {
		leaf,
		parents
	};
};
