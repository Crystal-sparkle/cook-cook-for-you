import { CarryOutOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Button, Card, Drawer, Space, message } from "antd";
import "firebase/database";
import {
  Timestamp,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
// import { styled } from "styled-components";
import { User } from "firebase/auth";
import { db } from "../firbase";
import ShoppingList, { PurchasePlan } from "./ShoppingList";

// const currentUser = auth.currentUser;
// console.log(auth);
// console.log(currentUser);
// const currentUid: string = currentUser?.uid ?? "";

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
interface PurchasePlanProps {
  activeCookingPlan: CookingPlanData | undefined;
  setActiveCookingPlan: (cookingPlanData?: CookingPlanData) => void;
  purchasePlanCollection: PurchasePlan[];
  user: User | null;
}

interface CookingPlanItem {
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  recipeId: string;
  serving: number;
}

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
  const dateForCooking = activeCookingPlan?.cookingDate
    ?.toDate()
    .toLocaleDateString("zh-TW");

  if (activeCookingPlan === undefined) {
    return <div>請先建立烹煮計畫</div>;
  }

  return (
    <div
      style={{
        width: " 100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0, auto",
        justifyContent: "space-around",
      }}
    >
      <Card>
        <div>
          <ProCard>
            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "12px",
                }}
              >
                烹煮日期：{dateForCooking}
              </div>

              {activeCookingPlan?.cookingItems.map((plan, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "5px",
                    fontSize: "16px",
                  }}
                >
                  <div style={{ marginRight: "4px" }}>
                    {index + 1}. {plan.name}
                  </div>
                  <div>
                    {plan.serving} {plan.unit}
                  </div>
                </div>
              ))}
            </div>
          </ProCard>
        </div>
        <div>
          <Button
            type="primary"
            style={{
              // backgroundColor: "#e9c148",
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
                <Button
                  // style={{ backgroundColor: "#b7dbdf", color: "#4b4947" }}
                  onClick={onClose}
                >
                  Close
                </Button>
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
    </div>
  );
};

export default PurchasingPlan;
