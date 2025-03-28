import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8KIR75UzA3U9lgRKDLTn7CJnKbYm97Fo",
  authDomain: "myreactgame-8a3b9.firebaseapp.com",
  projectId: "myreactgame-8a3b9",
  storageBucket: "myreactgame-8a3b9.firebasestorage.app",
  messagingSenderId: "989554260876",
  appId: "1:989554260876:web:48d48133992058331c74a9",
  measurementId: "G-7PVPBHY7JT"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
