import { message } from "antd";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

import "firebase/storage";
import {
  CookingPlanData,
  CurrentItem,
  DailyMealPlan,
  MealPlanData,
  NewPlan,
  PurchasePlan,
  Recipe,
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

export const fetchId = async (
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  setValue: (Id: string) => void
) => {
  const collectionRef = collection(db, collectionName);
  const queryRef = query(collectionRef, where(searchKey, "==", searchValue));
  try {
    const querySnapshot = await getDocs(queryRef);
    querySnapshot.forEach(async (doc) => {
      const docRef = doc.ref;

      const Id = docRef.id;
      setValue(Id);
    });
  } catch (error) {
    message.error("獲取資料失敗");
  }
};

export const addMealPlanToFirestore = async (
  newPlan: MealPlanData,
  collectionName: string
) => {
  const docRef = await addDoc(collection(db, collectionName), newPlan);
  await updateDoc(docRef, { mealId: docRef.id });

  return docRef;
};

export const getDailyMealPlanDocs = async (id: string) => {
  const q = query(collection(db, "DailyMealPlan"), where("mealId", "==", id));
  return await getDocs(q);
};

export const updateServingCount = async (
  docRef: DocumentReference<DocumentData, DocumentData>,
  mealPlan: MealPlanData,
  serving: number
) => {
  const updatedMealPlan = {
    mealPlan: [{ ...mealPlan, serving: serving - 1 }],
  };
  await setDoc(docRef, updatedMealPlan, { merge: true });
};

export const deleteMealPlan = async (
  docRef: DocumentReference<DocumentData, DocumentData>
) => {
  await deleteDoc(docRef);
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

export const subscribeToCollection = <T>(
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  onSuccess: (data: T[]) => void,
  onError: (error: Error) => void
): (() => void) => {
  try {
    const queryRef = query(
      collection(db, collectionName),
      where(searchKey, "==", searchValue)
    );
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

export const fetchAndsubscribeToRecipes = (
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  onSuccess: (results: Recipe[]) => void,
  onError: (error: Error) => void,
  setLoading: (value: boolean) => void

  // setUserRecipes: (value: React.SetStateAction<Recipe[]>) => void,
  // setLoading: (value: boolean) => void
): (() => void) => {
  const queryRef = query(
    collection(db, collectionName),
    where(searchKey, "==", searchValue),
    orderBy("time", "desc")
  );

  const unsubscribe = onSnapshot(
    queryRef,
    (querySnapshot) => {
      const results: Recipe[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push(data as Recipe);
      });

      onSuccess(results);
      setLoading(false);
    },
    (error) => {
      onError(error);
      message.error("發生錯誤");
    }
  );

  return () => unsubscribe();
};

export const handleGetDataObject = <T>(
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  callback: (value: T) => void
): (() => void) => {
  return subscribeToCollection<T>(
    collectionName,
    searchKey,
    searchValue,
    (data) => {
      if (data.length > 0) {
        callback(data[0]);
      } else {
        message.error("查無資料");
      }
    },
    (error) => {
      message.error(error.message || "取得資料時發生錯誤");
    }
  );
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

export const subscribeToPartnerData = (
  collectionName: string,
  searchKey: string,
  searchValue: string | boolean | undefined,
  updatePartnerList: (value: string[]) => void,
  setUserName: (value: string) => void
): (() => void) => {
  return subscribeToCollection<PartnersType>(
    collectionName,
    searchKey,
    searchValue,
    (data: PartnersType[]) => {
      if (data[0].partners || data[0].name) {
        updatePartnerList(data[0].partners);
        setUserName(data[0].name);
      } else {
        message.error("查無資料");
      }
    },

    (error) => {
      message.error(error.message || "取得資料時發生錯誤");
    }
  );
};

interface PartnersType {
  name: string;
  partners: string[];
  uid: string;
}

export const updateRecipeInFirebase = async (
  itemId: string,
  values: Recipe,
  mainPhoto: string,
  userId: string | undefined
) => {
  try {
    const docRef = doc(collection(db, "recipess"), itemId);
    const updatedValues = {
      ...values,
      mainPhoto: mainPhoto,
      userId: userId,
      time: Timestamp.now(),
    };

    await setDoc(docRef, updatedValues);
    await updateDoc(docRef, { id: docRef.id });

    return true;
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw new Error("新增失敗");
  }
};
