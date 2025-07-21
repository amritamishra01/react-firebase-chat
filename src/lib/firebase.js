// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth} from "firebase/auth";
// import { getFirestore} from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_API_KEY,
// //   apiKey: "AIzaSyAcQXIlOFwySqTmUUNabEb_AuvqhUH2cnM",
//   authDomain: "reactchat-6249e.firebaseapp.com",
//   projectId: "reactchat-6249e",
//   storageBucket: "reactchat-6249e.firebasestorage.app",
//   messagingSenderId: "638963713254",
//   appId: "1:638963713254:web:5ffe6c8c4f10c312876727",
//   measurementId: "G-DTM5TKY0F3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const auth=getAuth();
// export const db=getFirestore();

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth, connectAuthEmulator } from "firebase/auth";
// import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// // Your Firebase config (use dummy data or keep env for project separation)
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_API_KEY,
//   authDomain: "localhost", // for emulator, doesn't really matter
//   projectId: "demo-project", // should match your emulator projectId
//   storageBucket: "demo-project.appspot.com",
//   messagingSenderId: "1234567890",
//   appId: "demo-app-id",
//   measurementId: "G-XXXXXXX"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// export const auth = getAuth(app);
// export const db = getFirestore(app);

// // Connect to emulators if in local environment
// if (location.hostname === "localhost") {
//   connectAuthEmulator(auth, "http://localhost:9100");
//   connectFirestoreEmulator(db, "localhost", 8085);
//   // If you're using Storage or Functions, you can connect them too:
//   // connectStorageEmulator(storage, "localhost", 9200);
// }


import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// Your Firebase config (use dummy data or env vars for separation)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "localhost", // emulator placeholder
  projectId: "demo-project", // must match your emulator setup
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "demo-app-id",
  measurementId: "G-XXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators if running locally
if (location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9100");
  connectFirestoreEmulator(db, "localhost", 8085);
  connectStorageEmulator(storage, "localhost", 9200); // ✅ added for storage
}
