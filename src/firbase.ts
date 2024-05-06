import { message } from "antd";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

import "firebase/storage";
import { DailyMealPlan, NewPlan, PurchasePlan } from "./types";

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

export const handleUpdate = async (
  collectionName: string,
  updateData: (docRef: DocumentReference<DocumentData>) => {
    [key: string]: string;
  },
  callback: (value: React.SetStateAction<string>) => void
) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where("isActive", "==", true));
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const docRef = doc.ref;

      await updateDoc(docRef, updateData(docRef));

      callback(docRef.id);
    });
  } catch (error) {
    message.error("存取失敗");
  }
};

export const handleAddPlan = async (
  collectionName: string,
  newPlan: NewPlan
) => {
  const collectionRef = collection(db, collectionName);

  try {
    await addDoc(collectionRef, newPlan);
  } catch (error) {
    message.error("烹煮計畫新增失敗");
  }
};

export const closeActivePlan = async (collectionName: string) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where("isActive", "==", true));
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const docRef = doc.ref;

      await updateDoc(docRef, {
        isActive: false,
      });
    });
  } catch (error) {
    message.error("存取失敗");
  }
};
