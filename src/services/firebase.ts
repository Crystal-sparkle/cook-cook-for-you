import { message } from "antd";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

import "firebase/storage";
import {
  CookingPlanData,
  DailyMealPlan,
  NewPlan,
  PurchasePlan,
} from "../types";

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

export const handleGetData = async (
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean,
  callback: (value: React.SetStateAction<string>) => void
) => {
  const collectionRef = collection(db, collectionName);
  const queryRef = query(collectionRef, where(searchKey, "==", searchValue));

  try {
    const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      const results: PurchasePlan[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        results.push(data as PurchasePlan);
      });

      if (results.length > 0) {
        callback(results[0].planId);
      } else {
        return;
      }
    });
    return () => unsubscribe();
  } catch (error) {
    message.error("取得資料時發生錯誤");
  }
};

export const handleGetDataObject = async <T>(
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  callback: (value: T) => void
) => {
  const collectionRef = collection(db, collectionName);
  const queryRef = query(collectionRef, where(searchKey, "==", searchValue));

  try {
    const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      const results: T[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        results.push(data as T);
      });

      if (results.length > 0) {
        callback(results[0]);
      } else {
        return;
      }
    });
    return () => unsubscribe();
  } catch (error) {
    message.error("取得資料時發生錯誤");
  }
};

export const handleGetResult = async (
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  callback: (value: React.SetStateAction<PurchasePlan[]>) => void
) => {
  const collectionRef = collection(db, collectionName);
  const queryRef = query(collectionRef, where(searchKey, "==", searchValue));

  try {
    const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      const results: PurchasePlan[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        results.push(data as PurchasePlan);
      });

      if (results.length > 0) {
        callback(results);
      } else {
        return;
      }
    });
    return () => unsubscribe();
  } catch (error) {
    message.error("取得資料時發生錯誤");
  }
};

export const handleGetDailyMeal = async (
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  callback: (value: React.SetStateAction<DailyMealPlan[]>) => void
) => {
  const collectionRef = collection(db, collectionName);
  const queryRef = query(collectionRef, where(searchKey, "==", searchValue));

  try {
    const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      const results: DailyMealPlan[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        results.push(data as DailyMealPlan);
      });

      if (results.length > 0) {
        callback(results);
      } else {
        return;
      }
    });
    return () => unsubscribe();
  } catch (error) {
    message.error("取得資料時發生錯誤");
  }
};

export const handleGetActivePlan = async (
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  callback: (value: React.SetStateAction<CookingPlanData | undefined>) => void
) => {
  const collectionRef = collection(db, collectionName);
  const queryRef = query(collectionRef, where(searchKey, "==", searchValue));

  try {
    const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      let results = null;
      querySnapshot.forEach((doc) => {
        results = doc.data();
      });

      if (results) {
        callback(results);
      } else {
        callback(undefined);
      }
    });
    return () => unsubscribe();
  } catch (error) {
    message.error("查無計劃");
  }
};

export const updateCollectionItems = async (
  collectionName: string,
  itemIndex: number,
  updateFunction: (docData: PurchasePlan) => void
) => {
  const purchaseCollection = collection(db, collectionName);
  const q = query(purchaseCollection, where("isActive", "==", true));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const docRef = doc.ref;
      const docData = (await getDoc(docRef)).data();

      if (docData && docData.items && docData.items[itemIndex]) {
        updateFunction(docData as PurchasePlan);
        await updateDoc(docRef, {
          items: docData.items,
        });
      }
    });
  } catch (error) {
    message.error("更改資料失敗");
  }
};
