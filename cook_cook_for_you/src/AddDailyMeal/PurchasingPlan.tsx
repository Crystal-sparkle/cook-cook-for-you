import { Select } from "antd";
import dayjs from "dayjs";
import "firebase/database";
import {
  Timestamp,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firbase";
const Wrapper = styled.div`
  margin: 20px;
  padding: 5px 40px;
  height: 100%;
  width: 90%;
  background-color: #858297;
  border: 2px;
  border-radius: 10px;
`;
interface PurchaseItem {
  isPurchased: boolean | string;
  name: string;
  quantity: number;
  responsible: string;
  unit: string;
}

interface PurchasePlan {
  date: Timestamp;
  items: PurchaseItem[];
  mealsEndDate: Timestamp;
  mealsStartDate: Timestamp;
  test: string;
  userId: string;
}
//dummy data
const partners = [
  {
    label: "CrystaL",
    key: "1",
  },
  {
    label: "PeiPei",
    key: "2",
  },
  {
    label: "Jenny",
    key: "3",
  },
];

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
  activeCookingPlan: CookingPlanData | undefined; // 這裡修正
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

const PurchasingPlan = ({ activeCookingPlan }: PurchasePlanProps) => {
  const { Option } = Select;

  const [purchasePlanCollection, setPurchasePanCollection] = useState<
    PurchasePlan[]
  >([]);

  useEffect(() => {
    const getPurchasePlan = async () => {
      const purchaseCollection = collection(db, "purchasePlan");

      const endDateStartTime = dayjs("2023-11-08").startOf("day").toDate();
      const endDateEndTime = dayjs("2023-11-08").endOf("day").toDate();

      const endTimestamp0 = Timestamp.fromDate(endDateStartTime);
      const endTimestamp1 = Timestamp.fromDate(endDateEndTime);

      const queryRef = query(
        purchaseCollection,
        where("mealsEndDate", ">=", endTimestamp0),
        where("mealsEndDate", "<=", endTimestamp1)
      );

      try {
        const querySnapshot = await getDocs(queryRef);
        const results: PurchasePlan[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          results.push(data as PurchasePlan);
          console.log(results);
        });
        setPurchasePanCollection(results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getPurchasePlan();
  }, []);

  const [checkedItems, setCheckedItems] = useState<Array<Array<boolean>>>([]);

  const handleCheckboxChange = (planIndex: number, itemIndex: number) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = [...prevCheckedItems];
      newCheckedItems[planIndex] = [...(newCheckedItems[planIndex] || [])];
      newCheckedItems[planIndex][itemIndex] =
        !newCheckedItems[planIndex][itemIndex];
      return newCheckedItems;
    });
  };

  const handleSelectChange = (
    value: string,
    index: number,
    itemIndex: number
  ) => {
    console.log(value, index, itemIndex);
  };

  const [activePlanIngredients, setActivePlanIngredients] = useState<
    CookingPlanItem[]
  >([]);

  useEffect(() => {
    const purchaseMeals = activeCookingPlan?.cookingItems;
    console.log(purchaseMeals);

    if (Array.isArray(purchaseMeals) && purchaseMeals.length > 0) {
      const getRecipesIngredients = async () => {
        const recipesCollection = collection(db, "recipes");

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
                console.log(newIngredients);
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
  console.log(activeCookingPlan);

  console.log(activePlanIngredients);

  const [purchaseItems, setPurchaseItems] = useState<
    { name: string; quantity: number; unit: string }[]
  >([]);

  useEffect(() => {
    const purchaseItemsArray = activePlanIngredients.reduce<
      { name: string; quantity: number; unit: string }[]
    >((accumulator, item) => {
      item.ingredients.forEach((ingredient) => {
        const existingIngredient = accumulator.find(
          (accIngredient) =>
            accIngredient.name === ingredient.name &&
            accIngredient.unit === ingredient.unit
        );

        if (existingIngredient) {
          existingIngredient.quantity += ingredient.quantity * item.serving;
        } else {
          accumulator.push({
            name: ingredient.name,
            quantity: ingredient.quantity * item.serving,
            unit: ingredient.unit,
          });
        }
      });
      return accumulator;
    }, []);

    setPurchaseItems(purchaseItemsArray);
  }, [activePlanIngredients]);

  console.log(purchaseItems);

  return (
    <Wrapper>
      <h2>採購清單</h2>
      <div>
        {purchasePlanCollection.map((item, index) => (
          <div key={index}>
            <span>採購品項</span>
            <span> {item.items.length} 個</span>
            <p>烹煮計畫日期：{item.date.toDate().toLocaleDateString()}</p>
            <hr />
            {item.items.map((purchaseItem, itemIndex) => (
              <div key={itemIndex}>
                <span>品項{itemIndex + 1}:</span>
                <input
                  type="checkbox"
                  checked={checkedItems[index]?.[itemIndex] || false}
                  onChange={() => handleCheckboxChange(index, itemIndex)}
                />
                <span>{purchaseItem.name}</span>
                <span>{purchaseItem.quantity}</span>
                <span>{purchaseItem.unit}</span>
                <br />
                <p>誰採買</p>
                <Select
                  defaultValue={purchaseItem.responsible}
                  style={{ width: 120 }}
                  onChange={(value) =>
                    handleSelectChange(value, index, itemIndex)
                  }
                >
                  {partners.map((partner) => (
                    <Option key={partner.key} value={partner.label}>
                      {partner.label}
                    </Option>
                  ))}
                </Select>
                <hr />
              </div>
            ))}
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default PurchasingPlan;
