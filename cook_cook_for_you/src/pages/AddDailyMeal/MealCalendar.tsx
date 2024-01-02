import type { CalendarProps } from "antd";

import { Calendar, Tag } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "firebase/database";
import {
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firbase";
import { DailyMealPlan } from "../../types";
const CalerdarWrapper = styled.div`
  margin: 5px;
  border-radius: 5px;
  background-color: #b7dbdf;
  height: 794px;
`;

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
        () => {
          message.error("發生錯誤");
        }
      );
      return () => unsubscribe();
    };

    handleDailyMealPlan();
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
      (content: CalerdarContent, id: string) =>
      (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        async function updateDailyMealQty() {
          const DailyMealPlanCollection = collection(db, "DailyMealPlan");
          const q = query(DailyMealPlanCollection, where("mealId", "==", id));

          try {
            const querySnapshot = await getDocs(q);
            for (const doc of querySnapshot.docs) {
              const docRef = doc.ref;
              const data = doc.data();

              const mealPlan = data.mealPlan[0];
              const serving = data.mealPlan[0].serving;

              if (serving > 1) {
                const updatedMealPlan = {
                  mealPlan: [{ ...mealPlan, serving: serving - 1 }],
                };

                await setDoc(docRef, updatedMealPlan, { merge: true });
              } else {
                await deleteDoc(docRef);
              }
            }

            message.success(`成功刪除：${content.name}`);
          } catch (error) {
            message.error("刪除失敗");
          }
        }

        updateDailyMealQty();
      };

    const eventTags = dynamicListData.map((item, index) => (
      <li key={index}>
        {item.content.map((menu, subIndex) =>
          Array.from({ length: menu.serving }).map((_, servingIndex) => (
            <Tag
              style={{
                fontSize: "16px",
                backgroundColor: "#b7dbdf",
                color: "#211607",
                marginBottom: "5px",
                padding: "3px",
              }}
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

  //current 是代表目前處理的日期，它是 cellRender 函式的一個參數。在你的情境中，dateCellRender 函式中的 value 參數即是 current，用來表示正在處理的日期。
  //info.originNode 是一個用來取得日期單元格原始節點的屬性，你可以使用它來獲取和操作原始的日期單元格內容。
  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <CalerdarWrapper>
      <Calendar
        style={{
          borderRadius: "5px",
          margin: "5px",
          fontSize: "14px",
          backgroundColor: "#b7dbdf",
        }}
        cellRender={cellRender}
        onChange={(date) => {
          console.log("點擊的日期是" + date.toDate());
        }}
      />
    </CalerdarWrapper>
  );
};

export default MealCalendar;
