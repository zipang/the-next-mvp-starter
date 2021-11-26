# A QUICK REST ENTRY POINT ON A FIRESTORE DATABASE

## INSTALLATION

IMPORTANT: This API entry point instanciates a Firebase ADMIN SDK, so it needs advanced credentials that must NOT be stored in the GIT repo.  
The SDK instanciation must be done through secrets that are _only_ stored in environment variables.

### Locally :

Create the `.env` file with this content : (copy `.env.sample` and fill the values).

```properties
NEXT_PUBLIC_FIREBASE_API_KEY =
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =
NEXT_PUBLIC_FIREBASE_PROJECT_ID =
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET =
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID =
NEXT_PUBLIC_FIREBASE_APP_ID =

FIREBASE_ADMIN_SDK_CLIENT_EMAIL = something-like@your-project-id.iam.gserviceaccount.com
FIREBASE_ADMIN_SDK_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----|IMPORTANT: Replace all the \n with pipes when you copy the key|-----END PRIVATE KEY-----|
```

The first batch of `NEXT_PUBLIC_FIREBASE_..` properties are the same ones used to instantiate the [Firebase Javascript SDK](https://firebase.google.com/docs/web/learn-more?authuser=0#config-object).  
They are not sensitives. You can find them and copy them from the Firebase console : Project Settings > apps (create one) and the code sample that is provided to instanciate the web SDK :

```js
// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AEIOUY",
	authDomain: "your-project-id.firebaseapp.com",
	projectId: "your-project-id",
	storageBucket: "your-project-id.appspot.com",
	messagingSenderId: "123456789",
	appId: "1:123456789:web:123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
```

The second batch of properties (`FIREBASE_ADMIN_SDK_..`) are needed to instanciate a NodeJS only Admin SDK. These credentials are sensitives because the Admin SDK has all powers on the database.
The way to get these properties is usually to download a one time only JSON file that contains the Service Account private key : go to Project Settings > Service accounts in your Firebase console and click on the `Generate new private key` button. [Full explanations here](https://firebase.google.com/docs/admin/setup?authuser=0).
These properties must be copied from the JSON file that looks like this :

```JSON
{
	"type": "service_account",
	"project_id": "same-as-before",
	"private_key_id": "weirdo",
	"private_key": "-----BEGIN PRIVATE KEY-----\nSOME RANDOM BASE64 STRING\nAANOTHER ONE\nAND SO ON\nBLAH BLAH BLAH==\n-----END PRIVATE KEY-----\n",
	"client_email": "(...)@(...).iam.gserviceaccount.com",
	"client_id": "(...)",
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://oauth2.googleapis.com/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/(...).iam.gserviceaccount.com"
}
```

Copy `client_email` into `FIREBASE_ADMIN_SDK_CLIENT_EMAIL` and `private_key` into `FIREBASE_ADMIN_SDK_PRIVATE_KEY` but with an IMPORTANT TRICK : the value found in the `private_key` must be edited to replace all `\n` characters (new lines) by pipes (`|`) so that the key can now be safely reconstructed from the environment variable that doesn't accept line breaks.

### Vercel :

When deploying to Vercel you'll have to manually create and fill the values for all these enviromnent variables now correctly filled in the `.env` file. (boring)

## NAVIGATE THE DATA

The idea is to easily retrieve and download portions of the data we are interested into.
Path appended to the API entry point (/api/db) is followed by alterning collection names and document ids.

Examples (collections or document must exists or you should get a 404) :

```
https://somewhere.overthe.rainbow/api/db/authors
https://somewhere.overthe.rainbow/api/db/authors/john-doe
https://somewhere.overthe.rainbow/api/db/authors/john-doe/books
```

### SELECT

To select only the relevant fields you are interested into, just pass the `fields` parameter :

```
https://somewhere.overthe.rainbow/api/db/collection?fields=this,that
```

### PAGINATE

To limit the amount of data retrieved, pass the `limit` or `pageSize` parameter :

```
https://somewhere.overthe.rainbow/api/db/collection?limit=100
```

OR

```
https://somewhere.overthe.rainbow/api/db/collection?pageSize=100
```

To go to a specific `page` or `offset`, use these parameters :

```
https://somewhere.overthe.rainbow/api/db/collection?limit=100&page=2
```

OR

```
https://somewhere.overthe.rainbow/api/db/collection?limit=100&offset=300
```

### DOWNLOAD

When you are interested by what you see, you can easily force the download of a JSON file by providing a .json extension to the path or a fileName parameter :

```
https://somewhere.overthe.rainbow/api/db/collection.json?limit=100&offset=300
```

OR

```
https://somewhere.overthe.rainbow/api/db/collection?limit=100&offset=300&fileName=my-selection.json
```
