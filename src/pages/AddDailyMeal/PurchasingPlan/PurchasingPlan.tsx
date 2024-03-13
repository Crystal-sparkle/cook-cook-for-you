import { ProCard } from "@ant-design/pro-components";
import { Card, message } from "antd";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firbase";
import {
  CookingPlanItem,
  PartnerList,
  PurchaseList,
  PurchasePlan,
  PurchasePlanProps,
} from "../../../types";
import Partner from "../../Profile/Partner";
import useGetPartnerList from "../../Shopping/hooks/useGetPartnerList";
import PurchasingDrawer from "./PurchasingDrawer";
import {
  CookingDate,
  GroupPartner,
  Serving,
  ShowMembers,
  ShowServing,
  Wrapper,
} from "./PurchasingPlan.style";

const PurchasingPlan = ({
  setActiveCookingPlan,
  activeCookingPlan,
  purchasePlanCollection,
}: PurchasePlanProps) => {
  const partners: PartnerList[] = useGetPartnerList();

  const [activePlanIngredients, setActivePlanIngredients] = useState<
    CookingPlanItem[]
  >([]);

  useEffect(() => {
    const purchaseMeals = activeCookingPlan?.cookingItems;

    if (Array.isArray(purchaseMeals) && purchaseMeals.length > 0) {
      const getSelectRecipesIngredients = async () => {
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

                const newIngredients = {
                  recipeId: meal.id,
                  serving: meal.serving,
                  ingredients: ingredients,
                };
                return newIngredients;
              } else {
                return null;
              }
            } catch (error) {
              message.error("取得資料失敗");
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
          message.error("取得資料失敗");
        }
      };

      getSelectRecipesIngredients();
    }
  }, [activeCookingPlan]);

  const [purchaseItems, setPurchaseItems] = useState<PurchaseList[]>([]);

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
        message.error("取得資料失敗");
      }
    };
    addPurchaseItems();
  }, [purchaseItems]);

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
        () => {
          message.error("取得資料時發生錯誤");
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
              <GroupPartner>
                <ShowServing> 夥伴：</ShowServing>
                <div style={{ height: "27px" }}>
                  {" "}
                  <Partner />
                </div>
              </GroupPartner>
              <ShowMembers>
                <div></div>
                {partners.map(
                  (partner, index) =>
                    index !== 0 && (
                      <Serving
                        key={`${partner.key}-${partner.label}`}
                        style={{ marginLeft: 6 }}
                      >
                        {partner.label}
                      </Serving>
                    )
                )}
              </ShowMembers>
              <ShowServing>料理份量：</ShowServing>
              {activeCookingPlan?.cookingItems.map((plan, index) => (
                <Serving key={index}>
                  <div>
                    {index + 1}. {plan.name}
                  </div>
                  <div>
                    {plan.serving} {plan.unit}
                  </div>
                </Serving>
              ))}
            </div>
          </ProCard>
        </div>
        <div>
          <PurchasingDrawer
            purchasePlanCollection={purchasePlanCollection}
            planId={planId}
            setActiveCookingPlan={setActiveCookingPlan}
          />
        </div>
      </Card>
    </Wrapper>
  );
};
export default PurchasingPlan;
