// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwNv8hZMP4YSfyyRO24JKb6Mlu0a_C_4A",
  authDomain: "my-app-6c025.firebaseapp.com",
  projectId: "my-app-6c025",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
