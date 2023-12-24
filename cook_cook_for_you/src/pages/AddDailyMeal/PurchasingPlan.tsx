import { CarryOutOutlined, ExportOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Button, Card, Drawer, Space, message } from "antd";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";
import { db } from "../../firbase";
import { CookingPlanItem, PurchasePlan, PurchasePlanProps } from "../../types";
import ShoppingList from "./ShoppingList";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  justify-content: space-around;
`;

const CookingDate = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;
const ShowServing = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  font-size: 16px;
`;

const PurchasingPlan = ({
  setActiveCookingPlan,
  activeCookingPlan,
  purchasePlanCollection,
  user,
}: PurchasePlanProps) => {
  const [activePlanIngredients, setActivePlanIngredients] = useState<
    CookingPlanItem[]
  >([]);

  useEffect(() => {
    const purchaseMeals = activeCookingPlan?.cookingItems;

    if (Array.isArray(purchaseMeals) && purchaseMeals.length > 0) {
      const getRecipesIngredients = async () => {
        const recipesCollection = collection(db, "recipess");

        try {
          const promises = purchaseMeals.map(async (meal) => {
            const queryRef = query(
              recipesCollection,
              where("id", "==", meal.id)
            );

            try {
              const querySnapshot = await getDocs(queryRef);

              if (!querySnapshot.empty) {
                const ingredients = querySnapshot.docs[0].data().ingredients;
                const serving = meal.serving;

                const newIngredients = {
                  recipeId: meal.id,
                  serving: meal.serving,
                  ingredients: ingredients,
                };

                console.log(
                  `Ingredients for meal ${meal.id} with serving ${serving}:`,
                  ingredients
                );
                return newIngredients;
              } else {
                console.log(`No matching documents found for meal ${meal.id}.`);
                return null;
              }
            } catch (error) {
              console.error(`Error fetching data for meal ${meal.id}:`, error);
              return null;
            }
          });

          const results = await Promise.all(promises);

          const newIngredients = results.filter(
            (result) => result !== null
          ) as CookingPlanItem[];

          setActivePlanIngredients((prevIngredients) => [
            ...prevIngredients,
            ...newIngredients,
          ]);
        } catch (error) {
          console.error("Error processing promises:", error);
        }
      };

      getRecipesIngredients();
    }
  }, [activeCookingPlan]);

  const [purchaseItems, setPurchaseItems] = useState<
    {
      name: string;
      quantity: number;
      unit: string;
      isPurchased: boolean;
      responsible: string;
    }[]
  >([]);

  useEffect(() => {
    const purchaseItemsArray = activePlanIngredients.reduce<
      {
        name: string;
        quantity: number;
        unit: string;
        isPurchased: boolean;
        responsible: string;
      }[]
    >((accumulator, item) => {
      item.ingredients.forEach((ingredient) => {
        const existingIngredient = accumulator.find(
          (accIngredient) =>
            accIngredient.name === ingredient.name &&
            accIngredient.unit === ingredient.unit
        );

        if (existingIngredient) {
          existingIngredient.quantity +=
            Number(ingredient.quantity) * Number(item.serving);
        } else {
          accumulator.push({
            name: ingredient.name,
            quantity: Number(ingredient.quantity) * Number(item.serving),
            unit: ingredient.unit,
            isPurchased: false,
            responsible: "",
          });
        }
      });
      return accumulator;
    }, []);

    setPurchaseItems(purchaseItemsArray);
  }, [activePlanIngredients]);

  useEffect(() => {
    const addPurchaseItems = async () => {
      const PurchasePlanCollection = collection(db, "purchasePlan");
      const q = query(PurchasePlanCollection, where("isActive", "==", true));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const docRef = doc.ref;

          await updateDoc(docRef, {
            items: purchaseItems,
          });
        });
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    };

    addPurchaseItems();
  }, [purchaseItems]);

  const handleClick = () => {
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
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    };
    closeCookingSchedule();
    closePurchasePlan();
    setActiveCookingPlan();

    message.info("再開啟下一個烹煮計畫吧");
  };

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const [planId, setPlanId] = useState<string>("");

  useEffect(() => {
    const getPurchasePlanId = async () => {
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
          const purchasePlanId = results[0].planId;

          setPlanId(purchasePlanId);
        },
        (error) => {
          console.error("取得資料時發生錯誤:", error);
        }
      );

      return () => unsubscribe();
    };
    getPurchasePlanId();
  }, []);

  const dateForCooking = activeCookingPlan?.cookingDate
    ?.toDate()
    .toLocaleDateString("zh-TW");

  if (activeCookingPlan === undefined) {
    return <div>請先建立烹煮計畫</div>;
  }

  return (
    <Wrapper>
      <Card>
        <div>
          <ProCard>
            <div>
              <CookingDate>烹煮日期：{dateForCooking}</CookingDate>

              {activeCookingPlan?.cookingItems.map((plan, index) => (
                <ShowServing key={index}>
                  <div>
                    {index + 1}. {plan.name}
                  </div>
                  <div>
                    {plan.serving} {plan.unit}
                  </div>
                </ShowServing>
              ))}
            </div>
          </ProCard>
        </div>
        <div>
          <Button
            type="primary"
            style={{
              width: "100%",
              fontSize: "18px",
              height: "40px",
            }}
            onClick={showDrawer}
            icon={<CarryOutOutlined />}
            block
          >
            購買清單
          </Button>
          <Drawer
            title="購買清單"
            width={700}
            onClose={onClose}
            open={open}
            styles={{
              body: {
                paddingBottom: 70,
              },
            }}
            extra={
              <Space>
                <Link to={`/shopping/${user?.uid}/${planId}`} target="_blank">
                  <Button
                    type="text"
                    icon={<ExportOutlined style={{ fontSize: "24px" }} />}
                    style={{
                      marginRight: "5px",
                      color: "#f7bc0d",
                    }}
                  ></Button>
                </Link>

                <Button onClick={onClose}>Close</Button>
                {purchasePlanCollection.length > 0 ? (
                  <Button type="primary" onClick={handleClick}>
                    完成計畫
                  </Button>
                ) : (
                  <div></div>
                )}
              </Space>
            }
          >
            {purchasePlanCollection.length > 0 ? (
              purchasePlanCollection.map((item, index) => (
                <ShoppingList
                  key={index}
                  purchasePlan={item}
                  user={user}
                  index={index}
                />
              ))
            ) : (
              <div>請先建立烹煮計畫唷</div>
            )}
            <br />
          </Drawer>
        </div>
      </Card>
    </Wrapper>
  );
};

export default PurchasingPlan;
