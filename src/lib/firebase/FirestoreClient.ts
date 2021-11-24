// Initialize Cloud Firestore through Firebase
import { initializeApp } from "firebase/app";
import {
	collection,
	doc,
	DocumentData,
	getDoc,
	getDocs,
	getFirestore,
	query,
	updateDoc
} from "firebase/firestore/lite";

const firebaseApp = initializeApp({
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
});

export const firestore = getFirestore(firebaseApp);

export const getCollectionRef = (collectionName) => collection(firestore, collectionName);

/**
 * Load a whole collection
 * @param {String} collectionName Name of the collection
 * @returns {Promise<Array<DocumentData>>}
 */
export const loadCollectionData = async (collectionName) => {
	const data: Array<DocumentData> = [];
	const querySnapshot = await getDocs(query(getCollectionRef(collectionName)));

	querySnapshot.forEach((doc) => {
		data.push({ _id: doc.id, ...doc.data() });
	});

	return data;
};

/**
 * Load a single document from a collection
 * @param {String} collectionName Name (or full path) to the collection
 * @param {String} documentId Unique id of the document to retrieve
 * @returns {Promise<DocumentData|undefined>}
 */
export const loadDocument = async (collectionName, documentId) => {
	const ref = doc(firestore, collectionName, documentId);
	const snap = await getDoc(ref);

	if (snap.exists()) {
		return { _id: documentId, ...snap.data() };
	} else {
		console.log(`${collectionName} document ${documentId} doesn't exist !`);
		return;
	}
};

/**
 * Update a single document from a collection with a patch
 * (merge patch with existing doc)
 * @param {String} collectionName Name (or full path) to the collection
 * @param {String} documentId Unique id of the document to update
 * @param {Object} patch
 * @returns {Promise<DocumentData>}
 */
export const updateDocument = async (collectionName, documentId, patch) => {
	console.log(`Update collection ${collectionName}, document ${documentId}`, patch);
	const ref = doc(firestore, collectionName, documentId);
	return updateDoc(ref, patch);
};
