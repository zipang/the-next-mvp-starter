#!/usr/bin/env node

const { existsSync } = require("fs");
const path = require("path");
const { getFirestore } = require("firebase-admin/firestore");
const { cert, initializeApp } = require("firebase-admin/app");
const { selectFiles, COMPLETED } = require("select-files-cli");

// Parse the command line arguments : let's ask for a collection name to import data into
let params = require("yargs")
	.usage("Usage: $> $0 --collection [collection-name]")
	.describe("c", "Name of the collection to import the data into")
	.describe("truncate", "(Y/N) Truncate the collection before import")
	.alias("c", "collection")
	.require("collection")
	.default("truncate", false)
	.boolean("truncate")
	.help("h")
	.alias("h", "help").argv;

/**
 * Display a text browser to select a JSON file to import
 * @returns {String|null}
 */
const selectJSONFile = async () => {
	const { selectedFiles, status } = await selectFiles({
		startingPath: path.join(process.cwd(), ".."),
		root: "/",
		multi: false,
		pageSize: 20,
		directoryFilter: (directoryName) => {
			return !/node_modules$/gi.test(directoryName);
		},
		fileFilter: (fileName) => /.json$/i.test(fileName)
	});
	return status === COMPLETED ? selectedFiles[0] : null;
};

/**
 * Load the service account credentials file to init a new Firestore instance
 * Note : This file is secret so don't store it in git
 * @see https://firebase.google.com/docs/admin/setup?authuser=0#initialize-sdk
 * @returns {Promise<Firebase.FirebaseFirestore>}
 */
const initFirestoreSDK = async () => {
	const credentialFile = "service-account.json";
	if (!existsSync(`./${credentialFile}`)) {
		throw new Error(`Missing JSON service account file for Firebase.
Download a JSON credential file from Firebase : Project settings > Service accounts
and store it next to this import script under the name '${credentialFile}'
See https://firebase.google.com/docs/admin/setup?authuser=0#initialize-sdk`);
	}
	const firebaseSettings = require(`./${credentialFile}`);

	let app = initializeApp({
		credential: cert(firebaseSettings)
	});

	return getFirestore(app);
};

/**
 *
 * @param {FirebaseFirestore.Firestore} firestore
 * @param {String} collectionName
 * @param {String} selectedFile Path to a JSON file
 */
const importFile = async (firestore, collectionName, selectedFile, truncate) => {
	// Load the JSON Data
	const fileData = require(selectedFile);
	console.log(`Loading '${selectedFile}' ... OK`);

	const colRef = firestore.collection(collectionName);

	// Wow : importing an ESM module from Common JS Module..
	const { waitForAllJobs } = await import("../src/lib/utils/Promises.js");

	if (Array.isArray(fileData)) {
		console.log(`Importing ${fileData.length} documents into ${collectionName}`);
		return waitForAllJobs(
			fileData.map((doc) => () => {
				console.log(`Inserting document`, doc);
				return colRef.doc(doc.id).set(doc);
			})
		);
	} else {
		console.log(`Importing one single document into ${collectionName}`);
		return colRef.doc(fileData.id).set(fileData);
	}
};

const launchImport = async () => {
	const firestore = await initFirestoreSDK();
	const selectedFile = await selectJSONFile();

	if (firestore && selectedFile) {
		await importFile(firestore, params.collection, selectedFile);
	}
};

launchImport().catch((err) => {
	console.error(`File import failed`, err);
});
