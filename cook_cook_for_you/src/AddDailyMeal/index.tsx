import "firebase/database";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
// The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
import { Button, message, Steps, theme } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

import styled from "styled-components";
import { db } from "../firbase";
import { AddDailyMealProps, CookingPlanData, PurchasePlan } from "../types";
import CookingSchedule from "./CookingSchedule";
import MealCalendar from "./MealCalendar";
import PurchasingPlan from "./PurchasingPlan";
import SelectMenu from "./SelectMenu";

dayjs.locale("zh-cn");

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

const AddDailyMeal = ({ user }: AddDailyMealProps) => {
  //manage state
  const [cookingPlanId, setCookingPlanId] = useState<string>("");
  const [activeCookingPlan, setActiveCookingPlan] = useState<
    CookingPlanData | undefined
  >();
  const { token } = theme.useToken();
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
          } else {
            console.log("no plan");
          }
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error(error);
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
        (error) => {
          console.error("取得資料時發生錯誤:", error);
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
          setCookingPlanId={setCookingPlanId}
          setActiveCookingPlan={(cookingPlanData: CookingPlanData) =>
            setActiveCookingPlan(cookingPlanData)
          }
        />
      ),
    },
    {
      title: "確認食材列表",
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

  const contentStyle: React.CSSProperties = {
    lineHeight: "120px",
    textAlign: "start",
    color: token.colorTextTertiary,

    borderRadius: token.borderRadiusLG,
    // border: `2px dashed ${token.colorBorder}`,
    marginTop: "6px",
    width: "100%",
  };

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
        console.log("設為false");
      } catch (error) {
        console.error("Error writing document: ", error);
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
        console.log("設為false");
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    };
    closeCookingSchedule();
    closePurchasePlan();

    setActiveCookingPlan(undefined);

    message.info("開啟新的烹煮旅程吧");
  };

  return (
    <>
      {/* <BannerImg></BannerImg> */}

      <Image src="https://firebasestorage.googleapis.com/v0/b/cook-cook-for-you-test.appspot.com/o/images%2Fbanner1.jpeg?alt=media&token=25e37ec8-3cd2-49c1-ac36-cc513642360d" />
      <MainContent>
        <div style={{ width: "22%" }}>
          <Steps
            direction="vertical"
            current={current}
            items={items}
            style={{ width: "100%" }}
          />
          <div style={{ marginTop: 24 }}>
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
