import { Button, Flex, Input, Space } from "antd";
import "firebase/database";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
// The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { db } from "../firbase";
import SelectMenu from "./SelectMenu";
dayjs.locale("zh-cn");

const AddDailyMeal: React.FC = () => {
  const recipesCollection = collection(db, "recipes");
  const docRef = doc(recipesCollection, "100");

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
        <h1>Create Cook Buy ! </h1>
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
