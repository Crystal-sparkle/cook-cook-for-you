import { Button, Flex, Input, Space } from "antd";
import { initializeApp } from "firebase/app";
import "firebase/database";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
// The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import SelectMenu from "./SelectMenu";
dayjs.locale("zh-cn");

const firebaseConfig = {
  apiKey: "AIzaSyASak1RhNpksXuoa_xg4ibo5_NqLTMuYNE",
  authDomain: "cook-cook-for-you-test.firebaseapp.com",
  projectId: "cook-cook-for-you-test",
  storageBucket: "cook-cook-for-you-test.appspot.com",
  messagingSenderId: "200140396105",
  appId: "1:200140396105:web:858fccd67c7784cf6f5198",
  measurementId: "G-QC9P648LL8",
};

const AddDailyMeal: React.FC = () => {
  const [mealItems, setmealItems] = useState();
  initializeApp(firebaseConfig);
  const db = getFirestore();
  const recipesCollection = collection(db, "recipes");
  const docRef = doc(recipesCollection, "100");

  useEffect(() => {
    async function getRecipeName() {
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const recipeData = docSnap.data();
          // mealItems.push(recipeData.name);
          // const newMealItem = []

          // setmealItems([...recipeData.name, mealItems]);
          setmealItems(recipeData.name);
          console.log("Recipe Name:", mealItems);
          // return recipeName;
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    }

    getRecipeName();
  }, []);

  const [searchInputValue, setSearchInputValue] = useState("");
  const { Search } = Input;

  const onSearch = (value: string) => {
    console.log("Search value:", value);
    setSearchInputValue(value);
  };

  const [searchResults, setSearchResults] = useState<string[]>([]);
  const handleSearch = async () => {
    const q = query(recipesCollection, where("name", "==", searchInputValue));

    try {
      const querySnapshot = await getDocs(q);
      const results: string[] = [];

      querySnapshot.forEach((doc) => {
        results.push(doc.data().name);
      });

      setSearchResults(results);
      console.log(searchResults);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log(searchResults);

  return (
    <>
      <div style={{ width: "100%", height: "400px", padding: "50px" }}>
        <h1>食譜名稱：</h1>
        <h2>{mealItems}</h2>

        <br />
        <Space direction="vertical">
          <Search
            placeholder="input search text"
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            onSearch={onSearch}
            enterButton
          />
        </Space>
        <Flex gap="small" wrap="wrap">
          <Button type="primary" onClick={handleSearch}>
            新增規劃料理
          </Button>
          <br />
          <SelectMenu />
          <br />
          <h2>{searchResults}</h2>
        </Flex>
      </div>
    </>
  );
};

export default AddDailyMeal;
