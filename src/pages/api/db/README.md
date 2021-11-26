# A QUICK REST ENTRY POINT ON A FIRESTORE DATABASE

## INSTALLATION

This API entry point instanciates a Firebase ADMIN SDK, so it needs advanced credentials that must not be stored in the GIT repo.  
The SDK instanciation must be done through secrets that are only stored in environment variables.

### Locally :

Create the `.env` file with this content : copy `.env.sample` and fill the values.

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

The first batch of `NEXT_PUBLIC_FIREBASE` properties are the one that are used by the web client sdk.  
They are not sensitives. You can find them and copy them from the Project Settings, apps (create one) and the code sample that is provided to instanciate the web SDK :

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

The second batch of properties are needed to instanciate a NodeJS only Admin SDK. These credentials are sensitives because the Admin SDK has all powers on the database.
The way to get these properties is usually to download a one time only JSON file names Service Account.
These properties must be copied from the JSON file that looks like this :

```JSON
{
	"type": "service_account",
	"project_id": "same-as-before-seen",
	"private_key_id": "weirdo",
	"private_key": "-----BEGIN PRIVATE KEY-----\nSOME RANDOM BASE64 STRING\nAANOTHER ONE\nAND SO ON\nBLAH BLAH BLAH==\n-----END PRIVATE KEY-----\n",
	"client_email": "...@....iam.gserviceaccount.com",
	"client_id": "...",
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://oauth2.googleapis.com/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/.....iam.gserviceaccount.com"
}
```

But with an important trick :
`FIREBASE_ADMIN_SDK_PRIVATE_KEY` must received the value found in the `private_key` but with all the `\n` (line feeds) replaced by pipes (`|`) so that the environment variable can be reconstructed.

### Vercel :

When deploying to Vercel you'll have to manually create and fill the values for all these enviromnent variables now correctly filled in the `.env` file. (boring)

## GET THE DATA

The idea is to easily retrieve and download portions of the data we are insterested into.

### SELECT

To include only the fields you are insterested into, pass the `fields` parameter :

```
https://somewhere.overthe.rainbow/api/db/collection?fields=this,that
```

### PAGINATE

To restrict the amount of data retrieved, pass the limit or pageSize parameter :

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
