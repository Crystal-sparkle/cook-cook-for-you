import { Button, Steps, message } from "antd";
import "firebase/database";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firbase";
import { AddDailyMealProps, CookingPlanData, PurchasePlan } from "../../types";
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

const AddDailyMeal = ({ user }: AddDailyMealProps) => {
  const [cookingPlanId, setCookingPlanId] = useState<string>("");
  const [activeCookingPlan, setActiveCookingPlan] = useState<
    CookingPlanData | undefined
  >();
  // const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [purchasePlanCollection, setPurchasePanCollection] = useState<
    PurchasePlan[]
  >([]);

  useEffect(() => {
    const getActivePlan = async () => {
      const CookingPlanCollection = collection(db, "cookingPlan");
      const q = query(CookingPlanCollection, where("isActive", "==", true));

      try {
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let results = null;

          querySnapshot.forEach((doc) => {
            results = doc.data();
          });

          if (results) {
            setActiveCookingPlan(results);
          }
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        message.error("查無計劃");
      }
    };

    getActivePlan();
  }, []);

  useEffect(() => {
    const getPurchasePlan = async () => {
      const purchaseCollection = collection(db, "purchasePlan");
      const queryRef = query(purchaseCollection, where("isActive", "==", true));

      const unsubscribe = onSnapshot(
        queryRef,
        (querySnapshot) => {
          const results: PurchasePlan[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();

            results.push(data as PurchasePlan);
          });

          setPurchasePanCollection(results);
        },
        () => {
          message.error("取得資料時發生錯誤");
        }
      );

      return () => unsubscribe();
    };

    getPurchasePlan();
  }, []);

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
          activeCookingPlan={activeCookingPlan}
          setCookingPlanId={setCookingPlanId}
          setActiveCookingPlan={(cookingPlanData: CookingPlanData) =>
            setActiveCookingPlan(cookingPlanData)
          }
        />
      ),
    },
    {
      title: "生成購買清單",
      content: (
        <PurchasingPlan
          user={user}
          activeCookingPlan={activeCookingPlan}
          setActiveCookingPlan={setActiveCookingPlan}
          purchasePlanCollection={purchasePlanCollection}
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

  // const contentStyle: React.CSSProperties = {
  //   lineHeight: "120px",
  //   textAlign: "start",
  //   color: token.colorTextTertiary,
  //   borderRadius: token.borderRadiusLG,
  //   marginTop: "6px",
  //   width: "100%",
  // };

  const handleProjectClose = () => {
    const closePurchasePlan = async () => {
      const PurchasePlanCollection = collection(db, "purchasePlan");
      const q = query(PurchasePlanCollection, where("isActive", "==", true));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const docRef = doc.ref;

          await updateDoc(docRef, {
            isActive: false,
          });
        });
      } catch (error) {
        message.error("存取失敗");
      }
    };
    const closeCookingSchedule = async () => {
      const CookingPlanCollection = collection(db, "cookingPlan");
      const q = query(CookingPlanCollection, where("isActive", "==", true));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const docRef = doc.ref;

          await updateDoc(docRef, {
            isActive: false,
          });
        });
      } catch (error) {
        message.error("存取失敗");
      }
    };
    closeCookingSchedule();
    closePurchasePlan();

    setActiveCookingPlan(undefined);

    message.info("開啟新的烹煮旅程吧");
  };

  return (
    <>
      <Image src="https://firebasestorage.googleapis.com/v0/b/cook-cook-for-you-test.appspot.com/o/images%2Fbanner1.jpeg?alt=media&token=25e37ec8-3cd2-49c1-ac36-cc513642360d" />
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
