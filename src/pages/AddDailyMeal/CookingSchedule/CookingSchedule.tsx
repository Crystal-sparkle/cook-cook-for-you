import { Card, Modal, message } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { db, handleAddPlan, handleUpdate } from "../../../services/firebase";
import {
  Accumulator,
  CookingPlanItem,
  CookingScheduleProps,
  MealPlan,
  PurchaseList,
  activePlanIngredients,
} from "../../../types";
import CookingDatePicker from "./CookingDatePicker";
import CookingRangePicker from "./CookingRangePicker";
import {
  CardStyle,
  CookingScheduleButton,
  ModleText,
  PhotoWrapper,
  ServingItem,
  ServingList,
  ShoppingListPhoto,
  TotalServingTitle,
  Wrapper,
} from "./CookingSchedule.style";
type RangeValue = [Dayjs | null, Dayjs | null] | null;
const { Meta } = Card;

function CookingSchedule({ activeCookingPlan }: CookingScheduleProps) {
  const userInformation = useContext(AuthContext);
  const currentUserUid = userInformation?.user?.uid;

  const [cookingDate, setCookingDate] = useState<Date | undefined>();
  const [value, setValue] = useState<RangeValue>(null);
  const [selectDate, setSelectDate] = useState<(Timestamp | null)[]>([]);
  const [cookingMeals, setCookingMeals] = useState<MealPlan[]>([]);
  const [visible, setVisible] = useState(false);
  const [activePlanIngredients, setActivePlanIngredients] = useState<
    CookingPlanItem[]
  >([]);
  const [totalIngredients, setTotalIngredients] = useState<PurchaseList[]>([]);

  useEffect(() => {
    if (value !== null) {
      const findMealPlans = value.map((item) => {
        const date = item?.toDate();

        return date ? Timestamp.fromDate(date) : null;
      });
      setSelectDate(findMealPlans);
    }
  }, [value]);

  const combinedSearvings = cookingMeals.reduce(
    (accumulator: Accumulator, meal) => {
      meal.mealPlan.forEach((item) => {
        const { name, serving } = item;
        if (accumulator[name]) {
          accumulator[name].serving += serving;
        } else {
          accumulator[name] = { ...item };
        }
      });
      return accumulator;
    },

    {}
  );

  const combinedServingArray = Object.values(combinedSearvings);

  useEffect(() => {
    const handleCookingMeals = async () => {
      const CookingMealCollection = collection(db, "DailyMealPlan");
      const startDate = selectDate[0]?.toDate() || null;
      const endDate = selectDate[1]?.toDate() || null;
      const queryRef = query(
        CookingMealCollection,
        where(
          "planDate",
          ">",
          startDate ? dayjs(startDate).startOf("day").toDate() : null
        ),
        where(
          "planDate",
          "<",
          endDate ? dayjs(endDate).endOf("day").toDate() : null
        )
      );

      try {
        const querySnapshot = await getDocs(queryRef);
        const results: MealPlan[] = [];
        querySnapshot.forEach((doc) => {
          results.push(doc.data() as MealPlan);
        });

        setCookingMeals(results);
      } catch (error) {
        message.error("取得資料失敗");
      }
    };
    if (cookingDate !== undefined && selectDate !== null) {
      handleCookingMeals();
    }
  }, [cookingDate, selectDate]);

  const handleClick = () => {
    setVisible(true);
  };

  const [cookingPlanId, setCookingPlanId] = useState<string>("");

  handleUpdate(
    "cookingPlan",
    (docRef) => ({ planId: docRef.id }),
    setCookingPlanId
  );

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

  useEffect(() => {
    const calculateTotalIngredients = activePlanIngredients.reduce<
      activePlanIngredients[]
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

    setTotalIngredients(calculateTotalIngredients);
  }, [activePlanIngredients]);

  useEffect(() => {
    if (totalIngredients.length > 0 && cookingPlanId) {
      handleAddPlan("purchasePlan", {
        cookingDate: cookingDate,
        items: totalIngredients,
        userId: currentUserUid,
        mealsStartDate: selectDate[0]?.toDate() || null,
        mealsEndDate: selectDate[1]?.toDate(),
        planId: cookingPlanId,
        isActive: true,
      });
    }
  }, [totalIngredients, cookingPlanId]);

  const createPurchsingList = async () => {
    handleAddPlan("cookingPlan", {
      cookingDate: cookingDate,
      cookingItems: combinedServingArray,
      userId: currentUserUid,
      mealsStartDate: selectDate[0]?.toDate() || null,
      mealsEndDate: selectDate[1]?.toDate(),
      isActive: true,
    });
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Wrapper>
      <CardStyle>
        <Meta title="烹煮計畫" />
        <CookingDatePicker setCookingDate={setCookingDate} />
        <div>
          <CookingRangePicker setValue={setValue} value={value} />
          <>
            <Meta />
            <TotalServingTitle>
              <h4>烹煮份量統計：</h4>

              {combinedServingArray.length < 1 && value !== null ? (
                <div>選取區間無已規劃菜單，請回到上一步規劃每日菜單</div>
              ) : (
                <div></div>
              )}
              {value === null ? (
                <ServingItem>尚未選取料理日期</ServingItem>
              ) : (
                <div></div>
              )}
            </TotalServingTitle>
            {cookingMeals.length > 0 && value !== null ? (
              <ServingList>
                {combinedServingArray?.map((meal, index) => (
                  <ServingItem key={`${index}-${meal}`}>
                    <div>{index + 1}.</div>
                    <div>{meal.name}</div>
                    <div>
                      {meal.serving}
                      {meal.unit}
                    </div>
                  </ServingItem>
                ))}
              </ServingList>
            ) : (
              <div></div>
            )}
          </>
          {combinedServingArray.length > 0 ? (
            <div>
              <br />
              <CookingScheduleButton type="primary" onClick={handleClick}>
                確認烹煮計畫
              </CookingScheduleButton>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div>
          <Modal
            open={visible}
            onOk={createPurchsingList}
            onCancel={handleCancel}
          >
            <ModleText>要建立採購清單嗎？</ModleText>
            <PhotoWrapper>
              <ShoppingListPhoto
                src="https://firebasestorage.googleapis.com/v0/b/cook-cook-for-you-test.appspot.com/o/shoppingList.jpeg?alt=media&token=c7fe0a6f-e59c-44a1-9725-6bfe30b477f9"
                alt="shoppingList picture "
              />
            </PhotoWrapper>
          </Modal>
        </div>
      </CardStyle>
    </Wrapper>
  );
}

export default CookingSchedule;
