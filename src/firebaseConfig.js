// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDGHgTSoD8xKfgXtQ2jlSuU_hzF-qY6i00",
    authDomain: "movie-list-12.firebaseapp.com",
    projectId: "movie-list-12",
    storageBucket: "movie-list-12.appspot.com",
    messagingSenderId: "21535973271",
    appId: "1:21535973271:web:316f0ed1a3987405a66ed2",
    measurementId: "G-SJ9YE5BCRT"
};

const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized: ", app);

const auth = getAuth(app);
console.log("Firebase auth object: ", auth);

const db = getFirestore(app);
console.log("Firebase Firestore object: ", db);

export { auth, db };