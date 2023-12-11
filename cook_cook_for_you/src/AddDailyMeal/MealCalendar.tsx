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
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
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
  mealId: string;
}

// const Wrapper = styled.div`
//   margin: 40px;
//   padding: 20px;
//   border-radius: 20px;
// `;

const MealCalendar: React.FC = () => {
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
      return () => unsubscribe();
    };

    handleDailyMealPlan(); // 呼叫函數以執行一次
  }, []);

  const dateCellRender = (value: Dayjs) => {
    const dynamicListData = thisMonthMealPlans
      .filter((plan) => dayjs(plan.planDate.toDate()).isSame(value, "day"))
      .map((plan) => ({
        type: "",
        id: plan.mealId,
        content: Array.isArray(plan?.mealPlan)
          ? plan.mealPlan.map((meal) => ({
              name: meal.name,
              serving: meal.serving,
            }))
          : [],
      }));

    const preventDefault =
      (value: Dayjs, content: any, id: string) =>
      (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        async function handleDeletDailyMeal() {
          const DailyMealPlanCollection = collection(db, "DailyMealPlan");
          const q = query(DailyMealPlanCollection, where("mealId", "==", id));

          try {
            const querySnapshot = await getDocs(q);
            for (const doc of querySnapshot.docs) {
              const docRef = doc.ref; // 使用 DocumentReference
              const data = doc.data();

              const serving = data.mealPlan[0].serving;
              console.log(docRef);
              const mealPlan = data.mealPlan[0];

              if (serving > 1) {
                // 份量大於1，減少 serving

                const updatedMealPlan = {
                  ...mealPlan,
                  serving: serving - 1,
                };

                // const updatedData = {
                //   mealPlan: [
                //     {
                //       serving: serving - 1,
                //     },
                //   ],
                // };

                // await setDoc(docRef, updatedData, { merge: true });
                await setDoc(docRef, updatedMealPlan, { merge: true });
                console.log("減一");
              } else {
                // 份量為1或更少，直接刪除該筆資料
                await deleteDoc(docRef);
                console.log("刪除");
              }
            }

            console.log(`成功刪除：${content.name}`);
          } catch (error) {
            console.error("刪除計畫菜單失敗 ", error);
          }
        }

        handleDeletDailyMeal();
        // console.log(value.toString());
        console.log("content", content.name, value.toString(), id);
      };

    const eventTags = dynamicListData.map((item, index) => (
      <li key={index}>
        {item.content.map((menu, subIndex) =>
          Array.from({ length: menu.serving }).map((_, servingIndex) => (
            <Tag
              key={subIndex + servingIndex}
              closable
              onClose={preventDefault(value, menu, item.id)}
            >
              {menu.name}
            </Tag>
          ))
        )}
      </li>
    ));

    return (
      <div>
        <div className="events">{eventTags}</div>
      </div>
    );
  };
  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <div style={{ margin: "5px" }}>
      <Calendar
        cellRender={cellRender}
        onChange={(date) => {
          console.log("點擊的日期是" + date.toDate());
        }}
      />
    </div>
  );
};

export default MealCalendar;
