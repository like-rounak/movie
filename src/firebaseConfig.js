// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBtoX7N2a9c6wS12CXxuxs1IDqBkoXlg2Q",
    authDomain: "movielist-42ac1.firebaseapp.com",
    projectId: "movielist-42ac1",
    storageBucket: "movielist-42ac1.appspot.com",
    messagingSenderId: "1047011759293",
    appId: "1:1047011759293:web:3f2d52c16be041a6b753d4",
    measurementId: "G-E3N24H1M0F"
};

const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized: ", app);

const auth = getAuth(app);
console.log("Firebase auth object: ", auth);

const db = getFirestore(app);
console.log("Firebase Firestore object: ", db);

export { auth, db };