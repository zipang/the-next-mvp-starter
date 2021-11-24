import { DocumentData } from "firebase-admin/firestore";
import { initFirestoreSDK } from "lib/firebase/FirebaseAdmin";
import { NextApiRequest, NextApiResponse } from "next";
import { Transform } from "stream";

/**
 * That's how NextJS query parameters are allready pre-parsed
 */
type QueryParameter = string | string[] | undefined;

/**
 * Parse a parameter into an integer value if available
 * @param {Object} source
 * @param {Array<String>} names Aliases for the parameter names
 * @param {Boolean} [required=false]
 * @returns {Number|undefined}
 * @throws {TypeError}
 */
const parseInt = (
	source: NextApiRequest["query"],
	names: string[] = ["name"],
	required = false
): number | undefined => {
	// Read inside the source (the half-parsed query)
	const str: QueryParameter = names.reduce(
		(found: QueryParameter, name) => (found !== undefined ? found : source[name]),
		undefined
	);

	if (typeof str === "string") {
		try {
			return Number.parseInt(str, 10);
		} catch (err) {
			throw new TypeError(
				`Parameter ${names.join("|")} is not of the expected type (integer)`
			);
		}
	}

	// str is not defined
	if (required) {
		throw new TypeError(`Parameter ${names.join("|")} (integer) is required`);
	}
	return undefined;
};

/**
 * Check if a .json extension is present or if a fileName parameter is present
 * And set the file-attachment response header accordingly
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
const checkForFileAttachment = (req: NextApiRequest, resp: NextApiResponse) => {
	let fileName = (req.query.fileName || req.query.file_name) as string;

	if (!fileName) {
		// Look if we have a .json extension to the object's path
		// Convert paths to filename /authors/john/posts.json > authors-john-posts.json
		fileName = (req.query.collectionPath as string[]).join("-");
		if (!/.json$/i.test(fileName)) return; // There is no extensions
	}

	resp.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
};

/**
 * GET a collection or a document by its path
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
const getCollection = async (req: NextApiRequest, resp: NextApiResponse) => {
	try {
		// Get the firestore instance
		const firestore = await initFirestoreSDK(
			process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + "-admin-sdk"
		);
		resp.setHeader("Content-Type", "application/json; charset=utf-8");
		// Check to see if we want to download the response as a json file
		checkForFileAttachment(req, resp);

		if (req.query.collectionPath.length % 2 === 0) {
			// An even path leads us to a document reference instead of a collection !
			const documentPath = (req.query.collectionPath as string[])
				.join("/")
				.replace(/.json$/i, ""); // Remove the .json extension if present;
			let documentRef = firestore.doc(documentPath);

			// Do the firestore query
			const documentData = await documentRef.get();

			if (documentData === undefined) {
				return resp.status(404).json({
					code: "documentNotFound",
					message: `Document ${documentPath} doesn't exist`
				});
			}

			// Check if we require only a few fields
			let data;
			let fields = req.query.fields;
			if (typeof fields === "string" && fields.length) {
				// Field names are comma separated
				fields = fields.split(",");
				data = fields.reduce((selected, fieldName) => {
					selected[fieldName] = documentData.get(fieldName);
					return selected;
				}, {});
			} else {
				// No : Take all
				data = documentData.data();
			}
			// It's over
			return resp.json(data);
		}

		// Collection name (collections in Firestore have uneven paths like /authors/[id]/posts)
		const collectionPath = (req.query.collectionPath as string[])
			.join("/")
			.replace(/.json$/i, ""); // Remove the .json extension if present

		// Try to access this collection
		let collectionRef;
		try {
			collectionRef = firestore.collection(collectionPath);
		} catch (err) {
			return resp.status(404).json({
				code: "collectionNotFound",
				message: `Collection '${collectionPath}' doesn't exist.`
			});
		}

		// NOW PARSE ALL THE POSSIBLE QUERY PARAMETERS
		// Retrieves only certain fields
		let fields = req.query.fields;
		if (typeof fields === "string" && fields.length) {
			// Field names are comma separated
			fields = fields.split(",");
			collectionRef = collectionRef.select(...fields);
		}

		// Order by
		let orderBy = req.query.orderBy || req.query.order_by;
		if (typeof orderBy === "string" && orderBy.length) {
			collectionRef = collectionRef.orderBy(orderBy);
		}

		// Pagination
		const pageSize = parseInt(req.query, ["limit", "pageSize", "page_size"]);

		if (pageSize) {
			// we de-facto exclude the case where pageSize=0
			collectionRef = collectionRef.limit(pageSize);
			// Parse other integer pagination parameters
			const page = parseInt(req.query, ["page"]);
			let offset = parseInt(req.query, ["offset"]);
			if (page || offset) {
				if (page) {
					offset = (page - 1) * pageSize;
				}
				collectionRef = collectionRef.startAfter(offset);
			}
		}

		let i = 0;
		/**
		 * Create a Transform stream that will read a
		 * stream of DocumentData objects from firestore
		 * and write their JSON representation as strings
		 */
		const toJSON = new Transform({
			writableObjectMode: true,

			transform(documentSnapshot: DocumentData, _encoding, callback) {
				const jsonData = JSON.stringify(documentSnapshot.data());
				// console.log(`Writing ${collectionPath} #${i}`, jsonData);
				this.push((i++ > 0 ? "," : "[") + jsonData);
				callback();
			},
			flush(callback) {
				this.push("]"); // Close the array
				callback();
			}
		});

		collectionRef.stream().pipe(toJSON).pipe(resp);
	} catch (err) {
		console.error(err);
		resp.status(500).json(err);
	}
};

export default getCollection;
