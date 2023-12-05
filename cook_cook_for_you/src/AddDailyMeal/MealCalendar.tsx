// import { PlusOutlined } from "@ant-design/icons";
import type { CalendarProps } from "antd";
//Button
import { Calendar, Tag } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "firebase/database";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
// import styled from "styled-components";

import { db } from "../firbase";
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

// const Wrapper = styled.div`
//   margin: 40px;
//   padding: 20px;
//   border-radius: 20px;
// `;

const MealCalendar: React.FC = () => {
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

  useEffect(() => {
    const handleDailyMealPlan = () => {
      const DailyMealPlanCollection = collection(db, "DailyMealPlan");
      const queryRef = query(
        DailyMealPlanCollection,
        where("planDate", ">", Timestamp.fromDate(new Date(2023, 9, 1))),
        where("planDate", "<", Timestamp.fromDate(new Date(2024, 11, 1)))
      );

      const unsubscribe = onSnapshot(
        queryRef,
        (querySnapshot) => {
          const results: DailyMealPlan[] = [];
          querySnapshot.forEach((doc) => {
            results.push(doc.data() as DailyMealPlan);
          });

          setThisMonthMealPlans(results);
        },
        (error) => {
          console.error("取得資料時發生錯誤:", error);
        }
      );

      // 當元件卸載時取消監聽
      return () => unsubscribe();
    };

    handleDailyMealPlan(); // 呼叫函數以執行一次
  }, []);

  const preventDefault = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    console.log("Clicked! But prevent default.");
  };

  // const dateCellRender = (value: Dayjs) => {
  //   // value.date()
  //   const dynamicListData = thisMonthMealPlans
  //     .filter((plan) => dayjs(plan.planDate.toDate()).isSame(value, "day"))
  //     .map((plan) => ({
  //       type: "",
  //       content: plan.mealPlan.map((meal) => `${meal.name}, ${meal.serving}`),
  //     }));
  //   //  log 出每一天的值
  //     // console.log(dynamicListData);

  //   const eventTags = dynamicListData.map((item, index) => (
  //     <li key={index}>
  //       {item.content.map((manu, index) => (
  //         <Tag key={index} closable onClose={preventDefault}>
  //           {manu}
  //         </Tag>
  //       ))}
  //     </li>
  //   ));

  //   return <div className="events">{eventTags}</div>;
  // };

  // const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
  //   if (info.type === "date") return dateCellRender(current);
  //   return info.originNode;
  // };

  // const eventTags = dynamicListData.map((item, index) => (
  //   <li key={index}>
  //     {item.content.map((menu, subIndex) => (
  //       <Tag key={subIndex} closable onClose={preventDefault}>
  //         {menu.name}, {menu.serving}
  //       </Tag>
  //     ))}
  //   </li>
  // ));

  const dateCellRender = (value: Dayjs) => {
    const dynamicListData = thisMonthMealPlans
      .filter((plan) => dayjs(plan.planDate.toDate()).isSame(value, "day"))
      .map((plan) => ({
        type: "",
        content: plan.mealPlan.map((meal) => ({
          name: meal.name,
          serving: meal.serving,
        })),
      }));

    const eventTags = dynamicListData.map((item, index) => (
      <li key={index}>
        {item.content.map((menu, subIndex) =>
          Array.from({ length: menu.serving }).map((_, servingIndex) => (
            <Tag
              key={subIndex + servingIndex}
              closable
              onClose={preventDefault}
            >
              {menu.name}
            </Tag>
          ))
        )}
      </li>
    ));

    return <div className="events">{eventTags}</div>;
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  const [selectedDate, setSelectedDate] = useState(null);

  const onSelect = (date) => {
    console.log("selected Date", date);
    setSelectedDate(date);
  };

  return (
    <div style={{ width: "70%" }}>
      <Calendar
        cellRender={cellRender}
        onSelect={(date) => {
          console.log("selected Date", date);
        }}
      />
    </div>
  );
};

export default MealCalendar;
