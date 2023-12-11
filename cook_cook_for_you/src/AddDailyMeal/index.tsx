import "firebase/database";
import { Timestamp } from "firebase/firestore";
import React, { useState } from "react";
// The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
import { Button, Divider, message, Steps, theme } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import styled from "styled-components";
import banner1 from "../pages/Recipes/banner1.jpeg";
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
const BannerImg = styled.div`
  background-size: cover;
  background-image: url(${banner1});
  width: 100%;
  height: 240px;
  object-fit: cover;
  margin-bottom: 20px;
  align-items: center;
`;

const AddDailyMeal: React.FC = () => {
  //manage state
  const [cookingPlanId, setCookingPlanId] = useState<string>("");
  const [activeCookingPlan, setActiveCookingPlan] = useState<CookingPlanData>();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: "規劃每日菜單",
      content: <SelectMenu />,
    },
    {
      title: "設定烹煮日程",
      content: (
        <CookingSchedule
          cookingPlanId={cookingPlanId}
          setCookingPlanId={setCookingPlanId}
          setActiveCookingPlan={(cookingPlanData: CookingPlanData) =>
            setActiveCookingPlan(cookingPlanData)
          }
        />
      ),
    },
    {
      title: "食材購買列表",
      content: "點擊下方食材細項查看完整食材清單",
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: "220px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: "#ece8e3",
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  return (
    <>
      <BannerImg>
        {" "}
        <h1 style={{ margin: "auto" }}>管理你的料理流程</h1>
      </BannerImg>

      <>
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div style={{ marginTop: 24 }}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              下一步
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success("Processing complete!")}
            >
              完成
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              上一步
            </Button>
          )}
        </div>
      </>
      <Divider></Divider>
      <div>
        <PurchasingPlan
          activeCookingPlan={activeCookingPlan}
          // clearCookingPlan={() => {
          //   setActiveCookingPlan(null);
          // }}
          setActiveCookingPlan={setActiveCookingPlan}
        />
      </div>
      <div>
        <MealCalendar />
      </div>

      {/* <div style={{ display: "flex" }}>
        <div>
          <h2>Create Cook Buy ! </h2>

          <CookingSchedule
            cookingPlanId={cookingPlanId}
            setCookingPlanId={setCookingPlanId}
            activeCookingPlan={activeCookingPlan}
            setActiveCookingPlan={setActiveCookingPlan}
          />
        </div>
      </div> */}
    </>
  );
};

export default AddDailyMeal;
