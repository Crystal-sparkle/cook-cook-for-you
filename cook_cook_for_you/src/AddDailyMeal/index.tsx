import { Button, Flex, Input, Space } from "antd";
import "firebase/database";
import {
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
// The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { db } from "../firbase";
import CookingSchedule from "./CookingSchedule";
import PurchasingPlan from "./PurchasingPlan";
import SelectMenu from "./SelectMenu";
dayjs.locale("zh-cn");
interface CookingPlanData {
  cookingDate: Timestamp;
  cookingItems: {
    id: string;
    name: string;
    serving: number;
    unit: string;
  }[];
  isActive: boolean;
  mealsStartDate: Timestamp;
  mealsEndDate: Timestamp;
  planId: string;
  userId: string;
}

const AddDailyMeal: React.FC = () => {
  //manage state
  const [cookingPlanId, setCookingPlanId] = useState<string>("");
  const [activeCookingPlan, setActiveCookingPlan] = useState<CookingPlanData>();

  const recipesCollection = collection(db, "recipes");
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div style={{ width: "100%", height: "400px", padding: "50px" }}>
        <h1>Create Cook Buy ! </h1>
        <SelectMenu />
        <br />
        <br />
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
            顯示搜尋結果
          </Button>
        </Flex>
        <h2>{searchResults}</h2>
      </div>
      <CookingSchedule
        cookingPlanId={cookingPlanId}
        setCookingPlanId={setCookingPlanId}
        activeCookingPlan={activeCookingPlan}
        setActiveCookingPlan={setActiveCookingPlan}
      />
      <PurchasingPlan activeCookingPlan={activeCookingPlan} />
    </>
  );
};

export default AddDailyMeal;
