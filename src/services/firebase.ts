import { message } from "antd";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
  DocumentData,
  DocumentReference,
  QuerySnapshot,
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
  CurrentItem,
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

export const handleGetResult = (
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  callback: (value: React.SetStateAction<PurchasePlan[]>) => void
) => {
  return subscribeToCollection(
    collectionName,
    searchKey,
    searchValue,
    (data) => {
      callback(data as PurchasePlan[]);
    },

    (error) => {
      message.error(error.message || "取得資料時發生錯誤");
    }
  );
};

export const handleGetDailyMeal = (
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  callback: (value: React.SetStateAction<DailyMealPlan[]>) => void
): (() => void) => {
  return subscribeToCollection(
    collectionName,
    searchKey,
    searchValue,
    (data) => {
      callback(data as DailyMealPlan[]);
    },

    (error) => {
      message.error(error.message || "取得資料時發生錯誤");
    }
  );
};

export const subscribeToCollection = <T>(
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  onSuccess: (data: T[]) => void,
  onError: (error: Error) => void
): (() => void) => {
  try {
    const collectionRef = collection(db, collectionName);
    const queryRef = query(collectionRef, where(searchKey, "==", searchValue));
    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map((doc) => doc.data() as T);
        onSuccess(data);
      },
      (error) => {
        onError(
          new Error(
            `Failed to fetch data from ${collectionName}: ${error.message}`
          )
        );
      }
    );
    return unsubscribe;
  } catch (error) {
    message.error("取得資料失敗");
    return () => {};
  }
};

export const handleGetActivePlan = (
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  callback: (value: React.SetStateAction<CookingPlanData | undefined>) => void
): (() => void) => {
  return subscribeToCollection(
    collectionName,
    searchKey,
    searchValue,
    (data) => {
      const result = data.length > 0 ? data[0] : undefined;
      callback(result as CookingPlanData);
    },

    (error) => {
      message.error(error.message || "查無計劃");
    }
  );
};

//

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

export const subscribeToRecipes = (
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  callback: (items: { key: string; label: string }[]) => void
) => {
  return subscribeToCollection(
    collectionName,
    searchKey,
    searchValue,
    (data: CurrentItem[]) => {
      const items = data.map((doc, index) => ({
        key: `${index}`,
        label: doc.name,
      }));
      callback(items);
    },
    (error) => {
      message.error(error.message || "查無食譜");
    }
  );
};
