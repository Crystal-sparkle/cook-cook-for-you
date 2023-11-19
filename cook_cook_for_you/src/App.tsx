import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import "firebase/database";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import CalendarSection from "./CalendarSection.tsx";

const firebaseConfig = {
  apiKey: "AIzaSyASak1RhNpksXuoa_xg4ibo5_NqLTMuYNE",
  authDomain: "cook-cook-for-you-test.firebaseapp.com",
  projectId: "cook-cook-for-you-test",
  storageBucket: "cook-cook-for-you-test.appspot.com",
  messagingSenderId: "200140396105",
  appId: "1:200140396105:web:858fccd67c7784cf6f5198",
  measurementId: "G-QC9P648LL8",
};

const App: React.FC = () => {
  const [getName, setGetName] = useState();
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  console.log(analytics);
  const db = getFirestore();
  const recipesCollection = collection(db, "recipes");
  const docRef = doc(recipesCollection, "100");

  async function getRecipeName() {
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const recipeData = docSnap.data();
        setGetName(recipeData.name);
        console.log("Recipe Name:", getName);
        // return recipeName;
      } else {
        console.log("Document does not exist!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  }

  // 呼叫函數來取得資料
  getRecipeName();

  return (
    <>
      <div style={{ width: "100%", height: "500px" }}>
        <h1>食譜名稱：</h1>
        <p>{getName}</p>
      </div>
      <CalendarSection />
    </>
  );
};

export default App;
