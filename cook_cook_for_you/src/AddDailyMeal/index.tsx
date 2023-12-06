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
import MealCalendar from "./MealCalendar";
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
      <h1>Create Your Daily</h1>

      <div style={{ display: "flex" }}>
        <div>
          <div style={{ width: "100%", padding: "10px" }}>
            <SelectMenu />
            <br />
            <div>
              <MealCalendar />
            </div>
          </div>
        </div>
        <div>
          <h2>Create Cook Buy ! </h2>

          <CookingSchedule
            cookingPlanId={cookingPlanId}
            setCookingPlanId={setCookingPlanId}
            activeCookingPlan={activeCookingPlan}
            setActiveCookingPlan={setActiveCookingPlan}
          />
          <div style={{ display: "flex", flexWrap: "nowrap" }}>
            <PurchasingPlan activeCookingPlan={activeCookingPlan} />
            <br />
          </div>
        </div>
      </div>
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
    </>
  );
};

export default AddDailyMeal;
