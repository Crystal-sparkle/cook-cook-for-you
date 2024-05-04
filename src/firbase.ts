import { message } from "antd";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
  addDoc,
  collection,
import { getStorage } from "firebase/storage";

import "firebase/storage";
import { NewPlan } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyASak1RhNpksXuoa_xg4ibo5_NqLTMuYNE",
  authDomain: "cook-cook-for-you-test.firebaseapp.com",
  databaseURL:
    "https://cook-cook-for-you-test-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cook-cook-for-you-test",
  storageBucket: "cook-cook-for-you-test.appspot.com",
  messagingSenderId: "200140396105",
  appId: "1:200140396105:web:858fccd67c7784cf6f5198",
  measurementId: "G-QC9P648LL8",
};
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
