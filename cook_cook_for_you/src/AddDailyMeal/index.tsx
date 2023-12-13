import "firebase/database";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
// The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
import { Button, message, Steps, theme } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import styled from "styled-components";
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
// const BannerImg = styled.div`
//   background-size: cover;
//   background-image: url(${banner1});
//   width: 100%;
//   height: 180px;
//   object-fit: cover;
//   margin-bottom: 10px;
//   object-position: calc(50% + 50px) calc(50% - 90px);
// `;

const Image = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  object-position: 50% -110px;
`;
const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 5px;
  border-radius: 5px;
`;

const AddDailyMeal: React.FC = () => {
  //manage state
  const [cookingPlanId, setCookingPlanId] = useState<string>("");
  const [activeCookingPlan, setActiveCookingPlan] = useState<CookingPlanData>();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  console.log("activeCookingPlan", activeCookingPlan);
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
      content: (
        <PurchasingPlan
          activeCookingPlan={activeCookingPlan}
          setActiveCookingPlan={setActiveCookingPlan}
        />
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    if (activeCookingPlan !== undefined) {
      setCurrent(2);
    }
  }, [activeCookingPlan]);

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: "220px",
    textAlign: "center",
    color: token.colorTextTertiary,

    borderRadius: token.borderRadiusLG,
    border: `2px dashed ${token.colorBorder}`,
    marginTop: 16,
    width: "100%",
  };

  return (
    <>
      {/* <BannerImg></BannerImg> */}

      <Image src="./src/pages/Recipes/banner1.jpeg" />
      <MainContent>
        <div style={{ width: "22%" }}>
          <Steps
            direction="vertical"
            current={current}
            items={items}
            style={{ width: "100%" }}
          />
          <div style={{ marginTop: 24 }}>
            {current < steps.length - 1 && (
              <Button
                style={{
                  backgroundColor: "#FFE57A",
                  color: "#254F13",
                }}
                type="primary"
                onClick={() => next()}
              >
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                style={{ backgroundColor: "#FFE57A", color: "#254F13" }}
                onClick={() => message.success("Processing complete!")}
              >
                封存計畫
              </Button>
            )}
            {current === 1 && (
              <Button
                style={{
                  backgroundColor: "#FFE57A",
                  color: "#254F13",
                  margin: "8px",
                }}
                onClick={() => prev()}
              >
                上一步
              </Button>
            )}
          </div>
          <div style={contentStyle}>{steps[current].content}</div>
        </div>

        <div style={{ width: "77%" }}>
          <MealCalendar />
        </div>
      </MainContent>
    </>
  );
};

export default AddDailyMeal;
