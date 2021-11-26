import { App, cert, getApp, initializeApp, ServiceAccount } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

/**
 * Read Firebase service account details from the environment variables
 */
const readServiceAccountDetails = (): ServiceAccount => {
	// Check that all the variables exist in the current environment
	[
		"NEXT_PUBLIC_FIREBASE_PROJECT_ID",
		"FIREBASE_ADMIN_SDK_PRIVATE_KEY",
		"FIREBASE_ADMIN_SDK_CLIENT_EMAIL"
	].forEach((varName) => {
		if (!process.env[varName]) {
			throw new Error(
				`Missing environment variable '${varName}' to init the Firebase SDK.
Add them in the secrets of your Vercel project settings.`
			);
		}
	});

	// It should be good now
	let {
		NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId,
		FIREBASE_ADMIN_SDK_PRIVATE_KEY: privateKey,
		FIREBASE_ADMIN_SDK_CLIENT_EMAIL: clientEmail
	} = process.env;

	// Now the private key is multiline and must be reconstructed
	privateKey = privateKey?.split("|").join("\n");

	return {
		projectId,
		clientEmail,
		privateKey
	};
};

/**
 *
 * @param {String} appName
 * @returns Promise<Firestore>
 */
export const initFirestoreSDK = async (appName): Promise<Firestore> => {
	if (typeof window !== "undefined") {
		throw new Error("Admin SDK can only be used on the server side.");
	}

	let app: App;

	try {
		app = getApp(appName);
	} catch (err) {
		// Catch the FirebaseAppError: Firebase app named ".." does not exist.
		// to initialize the SDK
		const serviceAccount = readServiceAccountDetails();
		app = initializeApp(
			{
				credential: cert(serviceAccount),
				databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
			},
			appName
		);
	}

	return getFirestore(app);
};
