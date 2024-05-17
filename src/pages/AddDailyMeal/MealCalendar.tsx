import type { CalendarProps } from "antd";

import { message } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "firebase/database";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { db, handleGetDailyMeal } from "../../services/firebase";
import { CalerdarContent, DailyMealPlan } from "../../types";
import {
  CalerdarWrapper,
  PopoverStyle,
  StyledCalendar,
  TagStyle,
} from "./MealCalendar.style";

const MealCalendar: React.FC = () => {
  const [thisMonthMealPlans, setThisMonthMealPlans] = useState<DailyMealPlan[]>(
    []
  );
  const userInformation = useContext(AuthContext);
  const currentUserUid = userInformation?.user?.uid;

  useEffect(() => {
    const unsubscribe = handleGetDailyMeal(
      "DailyMealPlan",
      "userId",
      currentUserUid,
      setThisMonthMealPlans
    );
    return () => unsubscribe();
  }, [currentUserUid]);

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
      <li key={`${index}-${item}`}>
        {item.content.map((menu, subIndex) =>
          Array.from({ length: menu.serving }).map((_, servingIndex) => (
            <div>
              <PopoverStyle
                trigger="hover"
                content={
                  <TagStyle
                    key={subIndex + servingIndex}
                    closable
                    onClose={preventDefault(menu, item.id)}
                  >
                    {menu.name}
                  </TagStyle>
                }
              >
                <TagStyle
                  key={subIndex + servingIndex}
                  closable
                  onClose={preventDefault(menu, item.id)}
                >
                  {menu.name}
                </TagStyle>
              </PopoverStyle>
            </div>
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
      <StyledCalendar cellRender={cellRender} />
    </CalerdarWrapper>
  );
};

export default MealCalendar;
