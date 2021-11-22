import { cert, getApp, initializeApp, ServiceAccount } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

const readServiceAccount = (): ServiceAccount => {
	// Read from the environment variables
	const {
		NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		FIREBASE_ADMIN_SDK_PRIVATE_KEY,
		FIREBASE_ADMIN_SDK_CLIENT_EMAIL
	} = process.env;
	if (!FIREBASE_ADMIN_SDK_PRIVATE_KEY) {
		throw new Error(
			`Missing environment variables to init the Firebase SDK : FIREBASE_ADMIN_SDK_PRIVATE_KEY`
		);
	}
	if (!FIREBASE_ADMIN_SDK_CLIENT_EMAIL) {
		throw new Error(
			`Missing environment variables to init Firebase SDK : FIREBASE_ADMIN_SDK_CLIENT_EMAIL`
		);
	}
	return {
		projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		clientEmail: FIREBASE_ADMIN_SDK_CLIENT_EMAIL,
		privateKey: FIREBASE_ADMIN_SDK_PRIVATE_KEY
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

	let app;

	try {
		app = getApp(appName);
	} catch (err) {
		// FirebaseAppError: Firebase app named ".." does not exist.
		const serviceAccount = readServiceAccount();
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
