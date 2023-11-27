import type { DatePickerProps } from "antd";
import { Button, DatePicker, Space } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firbase";
interface MealPlan {
  mealPlan: {
    name: string;
    serving: number;
    unit: string;
  }[];
  planDate: Timestamp;
  userId: string;
}
interface Accumulator {
  [key: string]: { name: string; serving: number; unit: string };
}

const { RangePicker } = DatePicker;
const Wrapper = styled.div`
  margin: 20px;
  padding: 5px 40px;
  height: 100%;
  width: 90%;
  background-color: #5ba294;
  border: 2px;
  border-radius: 10px;
`;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

function CookingSchedule({
  setCookingPlanId,
  cookingPlanId,
}: {
  setCookingPlanId: (id: string) => void;
  cookingPlanId: string;
}) {
  const [cookingDate, setCookingDate] = useState<Date | undefined>();
  const pickCookingDate: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);

    if (date !== null) {
      const pickDate: Date = date?.toDate();
      setCookingDate(pickDate);
    }
  };
  console.log(cookingDate);

  const [dates, setDates] = useState<RangeValue>(null);
  const [value, setValue] = useState<RangeValue>(null);

  const disabledDate = (current: Dayjs) => {
    if (!dates) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], "days") >= 12;
    const tooEarly = dates[1] && dates[1].diff(current, "days") >= 12;
    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open: boolean) => {
    if (open) {
      setDates([null, null]);
    } else {
      setDates(null);
    }
  };
  console.log(dates);
  console.log(value);

  const [selectDate, setSelectDate] = useState<(Timestamp | null)[]>([]);
  useEffect(() => {
    if (value !== null) {
      const filterDates = value.map((item) => {
        const date = item?.$d;
        return date ? Timestamp.fromDate(date) : null;
      });
      setSelectDate(filterDates);
    }
  }, [value]);

  const [cookingMeals, setCookingMeals] = useState<MealPlan[]>([]);

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
        console.log(doc);
      });

      setCookingMeals(results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(cookingMeals);
  useEffect(() => {
    handleCookingMeals();
  }, []);

  async function addCookingPlan() {
    const CookingPlanCollection = collection(db, "cookingPlan");

    const startDate = selectDate[0]?.toDate() || null;
    const endDate = selectDate[1]?.toDate() || null;

    // const docRef = doc(CookingPlanCollection);
    const newPlan = {
      cookingDate: cookingDate,
      cookingItems: combinedServingArray,
      userId: "crystal",
      mealsStartDate: startDate,
      mealsEndDate: endDate,
      isActive: true,
    };
    try {
      const docRef = await addDoc(CookingPlanCollection, newPlan);
      console.log("Document added with ID: ", docRef.id);

      const updatedData = { planId: docRef.id };
      await setDoc(doc(CookingPlanCollection, docRef.id), updatedData, {
        merge: true,
      });
      setCookingPlanId(docRef.id);
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  console.log("cookingPlanId", cookingPlanId);
  useEffect(() => {
    addPurchasingPlan();
  }, [cookingPlanId]);

  const combinedSearvings = cookingMeals.reduce(
    (accumulator: Accumulator, meal) => {
      meal.mealPlan.forEach((item) => {
        const { name, serving } = item;
        if (accumulator[name]) {
          accumulator[name].serving += serving;
        } else {
          accumulator[name] = { ...item };
        }
        console.log(accumulator);
      });
      return accumulator;
    },
  async function addPurchasingPlan() {
    if (cookingPlanId) {
      const purchasePlanCollection = collection(db, "purchasePlan");

      const startDate = selectDate[0]?.toDate() || null;
      const endDate = selectDate[1]?.toDate() || null;

      const newPlan = {
        cookingDate: cookingDate,
        Items: "",
        userId: "crystal",
        mealsStartDate: startDate,
        mealsEndDate: endDate,
        planId: cookingPlanId,
      };
      try {
        const docRef = await addDoc(purchasePlanCollection, newPlan);
        console.log("Document written successfully!", docRef.id);
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    }
  }

  // 所有的烹煮行程表中的料理
  // const allMealPlans = cookingMeals.flatMap((meal) => meal.mealPlan);

  const combinedServingArray = Object.values(combinedSearvings);
  const handleClick = () => {
    handleConfirm();
  };

  const [visible, setVisible] = useState(false);

  const handleConfirm = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    addCookingPlan();

    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const [activeCookingPlan, setActiveCookingPlan] = useState<CookingPlanData>();

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
            console.log("找到了", results);
          } else {
            console.log("找不到活動計劃");
            setActiveCookingPlan("");
          }
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("獲取數據時出錯:", error);
      }
    };

    getActivePlan();
  }, []);
  const dateForCooking = activeCookingPlan?.cookingDate
    ?.toDate()
    .toLocaleDateString("zh-TW");

  if (activeCookingPlan === null) {
    return;
  }

  return (
    <Wrapper>
      <h1>cooking schedule</h1>
      <h2>烹煮日期：</h2>
      <Space direction="vertical">
        <DatePicker onChange={pickCookingDate} />
      </Space>
      <div>
        <h2>烹飪區間：</h2>
        <RangePicker
          value={dates || value}
          disabledDate={disabledDate}
          onCalendarChange={(val) => {
            setDates(val);
          }}
          onChange={(val) => {
            setValue(val);
          }}
          onOpenChange={onOpenChange}
          changeOnBlur
        />
      </div>
      <br />
      <br />
      <Button type="primary" onClick={handleClick}>
        烹煮份量表
      </Button>
      <div>
        {/* <h2>烹煮品項與分量</h2>
        <div>
          {allMealPlans.map((meal, index) => (
            <div key={index}>
              <p>No.{index + 1}</p>
              <p>Name: {meal.name}</p>
              <p>Serving: {meal.serving}</p>
              <p>Unit: {meal.unit}</p>
              <hr />
            </div>
          ))}
        </div> */}
        <div>
          <h2>統整份量</h2>
          {combinedServingArray.map((meal, index) => (
            <div key={index}>
              <p>Name: {meal.name}</p>
              <p>Serving: {meal.serving}</p>
              <p>Unit: {meal.unit}</p>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}

export default CookingSchedule;
