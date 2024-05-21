import type { CalendarProps } from "antd";

import { message } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "firebase/database";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
  deleteMealPlan,
  getDailyMealPlanDocs,
  handleGetDailyMeal,
  updateServingCount,
} from "../../services/firebase";
import { DailyMealPlan } from "../../types";
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

    const handleDailyMealUpdate = async (
      id: string,
      content: { name: string; serving?: number }
    ) => {
      try {
        const querySnapshot = await getDailyMealPlanDocs(id);
        querySnapshot.forEach(
          async (doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
            const docRef = doc.ref;
            const mealPlan = doc.data().mealPlan[0];
            const serving = doc.data().mealPlan[0].serving;

            if (serving > 1) {
              updateServingCount(docRef, mealPlan, serving);
            } else {
              deleteMealPlan(docRef);
            }
          }
        );

        message.success(`成功刪除：${content.name}`);
      } catch (error) {
        message.error("刪除失敗");
      }
    };

    const preventDefault =
      (content: { name: string; serving?: number }, id: string) =>
      (e: { preventDefault: () => void }) => {
        e.preventDefault();
        handleDailyMealUpdate(id, content);
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
