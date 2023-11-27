import type { CalendarProps } from "antd";
import { Button, Calendar, Tag } from "antd";
import type { Dayjs } from "dayjs";
import "firebase/database";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AddDailyMeal from "./AddDailyMeal";
// The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { db } from "./Firbase";
dayjs.locale("zh-cn");
interface DailyMealPlan {
  mealPlan: {
    name: string;
    serving: number;
    unit: string;
  }[];
  planDate: Timestamp;
  userId: string;
}

const Wrapper = styled.div`
  margin: 40px;
  padding: 20px;
  border-radius: 20px;
`;

const App: React.FC = () => {
  const [mealItems, setmealItems] = useState();

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

  const [thisMonthMealPlans, setThisMonthMealPlans] = useState<DailyMealPlan[]>(
    []
  );

  const handleDailyMealPlan = async () => {
    const DailyMealPlanCollection = collection(db, "DailyMealPlan");
    const queryRef = query(
      DailyMealPlanCollection,
      where("planDate", ">", Timestamp.fromDate(new Date(2023, 10, 1))),
      where("planDate", "<", Timestamp.fromDate(new Date(2023, 11, 1)))
    );

    try {
      const querySnapshot = await getDocs(queryRef);
      const results: DailyMealPlan[] = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data() as DailyMealPlan);
      });

      setThisMonthMealPlans(results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log(thisMonthMealPlans);

  const preventDefault = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    console.log("Clicked! But prevent default.");
  };

  const dateCellRender = (value: Dayjs) => {
    // value.date()
    const dynamicListData = thisMonthMealPlans
      .filter((plan) => dayjs(plan.planDate.toDate()).isSame(value, "day"))
      .map((plan) => ({
        type: "",
        content: plan.mealPlan.map((meal) => meal.name),
      }));
    const eventTags = dynamicListData.map((item, index) => (
      <li key={index}>
        {item.content.map((manu) => (
          <Tag closable onClose={preventDefault}>
            {manu}
          </Tag>
        ))}
      </li>
    ));

    return <ul className="events">{eventTags}</ul>;
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <Wrapper>
      <AddDailyMeal />
      {/* <Button type="primary" onClick={handleDailyMealPlan}>
        Daily Meal Menu
      </Button> */}
      <Calendar
        cellRender={cellRender}
        onSelect={(date) => {
          console.log("selected Date", date);
        }}
      />
    </Wrapper>
  );
};

export default App;
