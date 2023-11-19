// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
// import 'firebase/auth'; 用户身份验证，包括用户注册、登录、注销和密码重置。
import "firebase/database";
// import 'firebase/firestore';
// import 'firebase/storage';  用于与 Firebase 存储的集成，用于存储和检索文件、图像和其他二进制数据。

// const storage = firebase.storage();
// const firestore = firebase.firestore();
// const database = firebase.database();
// const auth = firebase.auth();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASak1RhNpksXuoa_xg4ibo5_NqLTMuYNE",
  authDomain: "cook-cook-for-you-test.firebaseapp.com",
  projectId: "cook-cook-for-you-test",
  storageBucket: "cook-cook-for-you-test.appspot.com",
  messagingSenderId: "200140396105",
  appId: "1:200140396105:web:858fccd67c7784cf6f5198",
  measurementId: "G-QC9P648LL8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(analytics);
const db = getFirestore();
const recipesCollection = collection(db, "recipes");
const docRef = doc(recipesCollection, "002");

async function getRecipeName() {
  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const recipeData = docSnap.data();
      const recipeName = recipeData.name;
      console.log("Recipe Name:", recipeName);
    } else {
      console.log("Document does not exist!");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
}

// 呼叫函數來取得資料
getRecipeName();
