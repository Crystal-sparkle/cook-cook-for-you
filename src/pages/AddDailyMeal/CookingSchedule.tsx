import type { DatePickerProps } from "antd";
import { Card, DatePicker, Modal, Space, message } from "antd";
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
import { AuthContext } from "../../context/authContext";
import { db } from "../../firbase";
import { Accumulator, CookingScheduleProps, MealPlan } from "../../types";
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
const { RangePicker } = DatePicker;

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
        message.error("取得資料失敗");
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
          await addDoc(purchasePlanCollection, newPlan);
          message.success("新增成功!");
        } catch (error) {
          message.error("新增失敗");
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
      <CardStyle>
        <Meta title="烹煮計畫" description="" />
        <h4>烹煮日期：</h4>
        <Space direction="vertical">
          <DatePicker onChange={pickCookingDate} size={"small"} />
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
            placement={"bottomRight"}
            size={"small"}
          />
          <>
            <Meta title="" description="" />
            <TotalServingTitle>
              <h4>烹煮份量統計：</h4>
              {combinedServingArray.length < 1 && value !== null ? (
                <div>選取區間無已規劃菜單</div>
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
