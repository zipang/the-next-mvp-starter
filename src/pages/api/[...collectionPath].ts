import { DocumentData } from "firebase-admin/firestore";
import { initFirestoreSDK } from "lib/firebase/FirebaseAdmin";
import { NextApiRequest, NextApiResponse } from "next";
import { Transform } from "stream";

/**
 * GET the flat content of a shared folder
 * @param {NextApiRequest} req
 * @param {NextApiResponse} resp
 */
const getCollection = async (req: NextApiRequest, resp: NextApiResponse) => {
	try {
		// PARSE ALL THE POSSIBLE QUERY PARAMETERS

		// Collection name (collections in Firestore can be a path like /authors/posts)
		const collectionPath = (req.query.collectionPath as string[]).join("/");

		// Get the firestore instance
		const firestore = await initFirestoreSDK(
			process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + "-admin-sdk"
		);
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

		// Retrieves only certain fields
		let fields = req.query.fields;
		if (typeof fields === "string" && fields.length) {
			// Field names are comma separated
			fields = fields.split(",");
			collectionRef = collectionRef.select(...fields);
		}

		// Order by
		let orderBy = req.query.orderBy;
		if (typeof orderBy === "string" && orderBy.length) {
			collectionRef = collectionRef.orderBy(orderBy);
		}

		let i = 0;
		/**
		 * Transform stream
		 * Takes a stream of DocumentData objects from firestore
		 * and stream back the JSON
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

		resp.setHeader("Content-Type", "application/json; charset=utf-8");
		collectionRef.stream().pipe(toJSON).pipe(resp);
	} catch (err) {
		console.error(err);
		resp.status(500).json(err);
	}
};

export default getCollection;
