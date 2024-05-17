import { Button, Steps, message } from "antd";
import "firebase/database";
import { useEffect, useState } from "react";
import {
  closeActivePlan,
  handleGetActivePlan,
  handleGetResult,
} from "../../services/firebase";
import { CookingPlanData, PurchasePlan } from "../../types";
import CookingSchedule from "./CookingSchedule/CookingSchedule";
import MealCalendar from "./MealCalendar";
import PurchasingPlan from "./PurchasingPlan/PurchasingPlan";
import SelectMenu from "./SelectMenu";
import {
  Cotent,
  Image,
  MainContent,
  MealCalenderWrapper,
  StepsButton,
  StepsWrapper,
} from "./addDailyMeal.style";

const AddDailyMeal = () => {
  const [current, setCurrent] = useState(0);
  const [purchasePlanCollection, setPurchasePlanCollection] = useState<
    PurchasePlan[]
  >([]);

  const [activeCookingPlan, setActiveCookingPlan] = useState<
    CookingPlanData | undefined
  >();

  useEffect(() => {
    const unsubscribe = handleGetActivePlan(
      "cookingPlan",
      "isActive",
      true,
      setActiveCookingPlan
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = handleGetResult(
      "purchasePlan",
      "isActive",
      true,
      setPurchasePlanCollection
    );
    return () => unsubscribe();
  }, []);

  const steps = [
    {
      title: "規劃每日菜單",
      content: <SelectMenu />,
    },
    {
      title: "設定烹煮日程",
      content: <CookingSchedule activeCookingPlan={activeCookingPlan} />,
    },
    {
      title: "生成購買清單",
      content: (
        <PurchasingPlan
          purchasePlanCollection={purchasePlanCollection}
          activeCookingPlan={activeCookingPlan}
          setPurchasePlanCollection={setPurchasePlanCollection}
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
    if (purchasePlanCollection.length > 0) {
      setCurrent(2);
    } else {
      setCurrent(0);
    }
  }, [purchasePlanCollection]);

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const handleProjectClose = async () => {
    await Promise.all([
      closeActivePlan("purchasePlan"),
      closeActivePlan("cookingPlan"),
    ]);
    setPurchasePlanCollection([]);

    message.info("開啟新的烹煮旅程吧");
  };
  const imageSrc =
    "https://firebasestorage.googleapis.com/v0/b/cook-cook-for-you-test.appspot.com/o/images%2Fbanner1.jpeg?alt=media&token=25e37ec8-3cd2-49c1-ac36-cc513642360d";

  return (
    <>
      <Image src={imageSrc} />
      <MainContent>
        <StepsWrapper>
          <Steps direction="vertical" current={current} items={items} />
          <StepsButton>
            {current === 0 && (
              <Button type="primary" onClick={() => next()}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={handleProjectClose}>
                建立新計畫
              </Button>
            )}
            {current > 0 && current === 1 && (
              <Button type="primary" onClick={() => prev()}>
                上一步
              </Button>
            )}
          </StepsButton>
          <Cotent>{steps[current].content}</Cotent>
        </StepsWrapper>

        <MealCalenderWrapper>
          <MealCalendar />
        </MealCalenderWrapper>
      </MainContent>
    </>
  );
};

export default AddDailyMeal;
