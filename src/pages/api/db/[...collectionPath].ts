import { DocumentData, FieldPath } from "firebase-admin/firestore";
import { initFirestoreSDK } from "lib/firebase/FirebaseAdmin";
import { parseArrayParam, parseIntegerParam, parseParam } from "lib/utils/Parameters";
import { NextApiRequest, NextApiResponse } from "next";
import { Transform } from "stream";

/**
 * Check if a fileName parameter is present or if a .json extension is present in the path
 * And set the file-attachment response header accordingly
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
const checkForFileAttachment = (req: NextApiRequest, resp: NextApiResponse) => {
	let fileName = parseParam(req.query, ["fileName", "file_name"]);

	if (!fileName) {
		// Convert document path to a suitable filename : authors/john/posts.json > authors-john-posts.json
		fileName = (req.query.collectionPath as string[]).join("-");
		// And look if we have a .json extension to this potential filename
		if (!/.json$/i.test(fileName)) return; // There is no extension
	}

	resp.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
};

/**
 * GET a document or collection by its path
 * Filter, paginate, download the results
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
const getDocumentOrCollection = async (req: NextApiRequest, resp: NextApiResponse) => {
	try {
		// Get the firestore instance
		const firestore = await initFirestoreSDK(
			process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + "-admin-sdk"
		);

		resp.setHeader("Content-Type", "application/json; charset=utf-8");
		// Check to see if we want to download the response as a json file
		checkForFileAttachment(req, resp);

		// Retrieves only certain fields (Field names are comma separated)
		const fields = parseArrayParam(req.query, "fields");

		if (req.query.collectionPath.length % 2 === 0) {
			// An even path leads us to a Document reference instead of a Collection !
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

			// Check to manually filter the fields required
			let data: DocumentData | undefined;
			if (fields.length === 0) {
				// No selection : Take all
				data = documentData.data();
			} else {
				// Read required fields one by one
				data = fields.reduce((selected, fieldName) => {
					selected[fieldName] = documentData.get(fieldName);
					return selected;
				}, {});
			}
			// Send it
			return resp.json(data);
		}

		// It is a Collection name (collections in Firestore have uneven paths like /authors/[id]/posts)
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

		// NOW PARSE AND APPLY THE POSSIBLE QUERY FILTERS

		// Retrieves only the selected fields
		if (fields.length) {
			collectionRef = collectionRef.select(...fields);
		}

		// We may have multiple orderBy parameters, ascending or descending
		// Example : orderBy=year-,title
		// But multiple sort will usually fail if the corresponding index is not present.. :
		// Cloud Firestore uses composite indexes for compound queries not already supported by single field indexes (ex: combining equality and range operators).
		let orderBy = parseArrayParam(req.query, [
			"orderBy",
			"order_by",
			"sortBy",
			"sort_by"
		]);
		if (orderBy.length) {
			orderBy.forEach((fieldName) => {
				if (/-$/.test(fieldName)) {
					// The presence of a minus suffix indicates the descending order
					collectionRef = collectionRef.orderBy(
						fieldName.replace(/-$/, ""),
						"desc"
					);
				} else {
					collectionRef = collectionRef.orderBy(fieldName, "desc");
				}
			});
		}

		// Pagination
		const pageSize = parseIntegerParam(req.query, ["limit", "pageSize", "page_size"]);
		let usePagination;
		if (pageSize) {
			// Parse other integer pagination parameters
			const page = parseIntegerParam(req.query, ["page"]);
			let offset = parseIntegerParam(req.query, ["offset"]);
			if (page || offset) {
				if (page) {
					offset = page * pageSize;
				}
				if (orderBy.length === 0) {
					// We must provide a default sort order to paginate
					collectionRef = collectionRef.orderBy(FieldPath.documentId());
				}
				usePagination = {
					from: offset,
					to: (offset as number) + pageSize
				};
				console.log("Using pagination", usePagination);
			} else {
				// Starting from the beginning we can limit the number of records returned
				collectionRef = collectionRef.limit(pageSize);
			}
		}

		/**
		 * Create a Transform stream that will read a
		 * stream of DocumentData objects from firestore
		 * and write their JSON representation as strings
		 */
		let readIndex = 0,
			count = 0;

		const toJSON = new Transform({
			writableObjectMode: true,

			transform(documentSnapshot: DocumentData, _encoding, callback) {
				if (
					!usePagination ||
					(readIndex >= usePagination.from && readIndex < usePagination.to) // Check the pagination window
				) {
					const jsonData = JSON.stringify(documentSnapshot.data());
					this.push((count++ > 0 ? "," : "[") + jsonData);
				}
				// Always count the record as read
				readIndex++;
				callback();
			},
			flush(callback) {
				this.push(count === 0 ? "[]" : "]"); // Close the array
				callback();
			}
		});

		collectionRef.stream().pipe(toJSON).pipe(resp);
	} catch (err) {
		console.error(err);
		resp.status(500).json({
			message: (err as Error).message
		});
	}
};

export default getDocumentOrCollection;
