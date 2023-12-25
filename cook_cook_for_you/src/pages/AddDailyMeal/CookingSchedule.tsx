import type { DatePickerProps } from "antd";
import { Button, Card, DatePicker, Modal, Space, message } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../../context/authContext";
import { db } from "../../firbase";
import { Accumulator, CookingScheduleProps, MealPlan } from "../../types";
type RangeValue = [Dayjs | null, Dayjs | null] | null;
const { Meta } = Card;
const { RangePicker } = DatePicker;

const Wrapper = styled.div`
  border: 2px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  justify-content: space-between;
`;

const TotalServingTitle = styled.div`
  font-size: 14px;
  margin-top: 5px;
`;

const ServingList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px auto;
  font-size: 16px;
  text-align: center;
`;

const ServingItem = styled.div`
  display: flex;
  margin-top: 6px;
  margin-right: 5px;
`;

function CookingSchedule({
  setCookingPlanId,
  cookingPlanId,
}: CookingScheduleProps) {
  const userInformation = useContext(AuthContext);
  const currentUserUid = userInformation?.user?.uid;

  const [cookingDate, setCookingDate] = useState<Date | undefined>();
  const pickCookingDate: DatePickerProps["onChange"] = (date) => {
    if (date !== null) {
      const pickDate: Date = date?.toDate();
      setCookingDate(pickDate);
    }
  };

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

  const [selectDate, setSelectDate] = useState<(Timestamp | null)[]>([]);
  useEffect(() => {
    if (value !== null) {
      const filterDates = value.map((item) => {
        const date = item?.toDate();

        return date ? Timestamp.fromDate(date) : null;
      });
      setSelectDate(filterDates);
    }
  }, [value]);

  const [cookingMeals, setCookingMeals] = useState<MealPlan[]>([]);
  console.log(cookingMeals);

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
        console.error("Error fetching data:", error);
      }
    };
    if (cookingDate !== undefined && selectDate !== null) {
      handleCookingMeals();
    }
  }, [cookingDate, selectDate]);

  async function addCookingPlan() {
    const CookingPlanCollection = collection(db, "cookingPlan");

    const startDate = selectDate[0]?.toDate() || null;
    const endDate = selectDate[1]?.toDate() || null;

    const newPlan = {
      cookingDate: cookingDate,
      cookingItems: combinedServingArray,
      userId: currentUserUid,
      mealsStartDate: startDate,
      mealsEndDate: endDate,
      isActive: true,
    };
    try {
      const docRef = await addDoc(CookingPlanCollection, newPlan);

      const updatedData = { planId: docRef.id };
      await setDoc(doc(CookingPlanCollection, docRef.id), updatedData, {
        merge: true,
      });
      setCookingPlanId(docRef.id);
    } catch (error) {
      message.error("烹煮計畫新增失敗");
    }
  }

  useEffect(() => {
    async function addPurchasingPlan() {
      if (cookingPlanId) {
        const purchasePlanCollection = collection(db, "purchasePlan");

        const startDate = selectDate[0]?.toDate() || null;
        const endDate = selectDate[1]?.toDate() || null;

        const newPlan = {
          cookingDate: cookingDate,
          items: [],
          userId: currentUserUid,
          mealsStartDate: startDate,
          mealsEndDate: endDate,
          planId: cookingPlanId,
          isActive: true,
        };
        try {
          const docRef = await addDoc(purchasePlanCollection, newPlan);
          console.log("Document written successfully!", docRef.id);
        } catch (error) {
          console.error("Error writing document: ", error);
        }
      }
    }

    addPurchasingPlan();
  }, [cookingPlanId]);

  // 所有的烹煮行程表中的料理
  // const allMealPlans = cookingMeals.flatMap((meal) => meal.mealPlan);

  const combinedServingArray = Object.values(combinedSearvings);

  const [visible, setVisible] = useState(false);
  const handleClick = () => {
    setVisible(true);
  };

  const createPurchsingList = async () => {
    addCookingPlan();
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Wrapper>
      <div>
        <Card
          style={{
            width: "100%",
            marginTop: 6,
            marginBottom: 10,
            padding: "5px",
          }}
        >
          <Meta title="烹煮計畫" description="" />
          <h4>烹煮日期：</h4>
          <Space direction="vertical">
            <DatePicker onChange={pickCookingDate} />
          </Space>
          <div>
            <h4>烹飪區間：</h4>
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
            <>
              <Meta title="" description="" style={{ marginTop: 6 }} />

              <TotalServingTitle>
                {combinedServingArray.length > 0 ? (
                  <div>
                    <h4>烹煮份量：</h4>(總共{combinedServingArray.length}道)
                  </div>
                ) : (
                  <div></div>
                )}
              </TotalServingTitle>
              <ServingList>
                {combinedServingArray?.map((meal, index) => (
                  <ServingItem key={index}>
                    <div>{index + 1}.</div>
                    <div>{meal.name}</div>
                    <div>
                      {meal.serving}
                      {meal.unit}
                    </div>
                  </ServingItem>
                ))}
              </ServingList>
            </>
            {combinedServingArray.length > 0 ? (
              <div>
                <br />
                <Button
                  type="primary"
                  style={{ backgroundColor: "#b7dbdf", color: "#4b4947" }}
                  onClick={handleClick}
                >
                  確認烹煮計畫
                </Button>
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
              <h2>要建立採購清單嗎？</h2>
            </Modal>
          </div>
        </Card>
      </div>
      <div></div>
    </Wrapper>
  );
}

export default CookingSchedule;
