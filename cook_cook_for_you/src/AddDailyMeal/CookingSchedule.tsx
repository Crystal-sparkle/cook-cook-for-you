import { ProCard } from "@ant-design/pro-components";
import type { DatePickerProps } from "antd";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Modal,
  Skeleton,
  Space,
  Switch,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
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

interface CookingScheduleProps {
  setCookingPlanId: (id: string) => void;
  cookingPlanId: string;
  activeCookingPlan: CookingPlanData | undefined;
  setActiveCookingPlan: React.Dispatch<
    React.SetStateAction<CookingPlanData | undefined>
  >;
}
const { Meta } = Card;

const { RangePicker } = DatePicker;
const Wrapper = styled.div`
  margin: 0 20px;
  padding: 10px 20px;
  width: 320px;
  background-color: #728288;
  border: 2px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

function CookingSchedule({
  setCookingPlanId,
  cookingPlanId,
  activeCookingPlan,
  setActiveCookingPlan,
}: CookingScheduleProps) {
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

  useEffect(() => {
    async function addPurchasingPlan() {
      if (cookingPlanId) {
        const purchasePlanCollection = collection(db, "purchasePlan");

        const startDate = selectDate[0]?.toDate() || null;
        const endDate = selectDate[1]?.toDate() || null;

        const newPlan = {
          cookingDate: cookingDate,
          items: [],
          userId: "crystal",
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
  const dateForCooking = activeCookingPlan?.cookingDate
    ?.toDate()
    .toLocaleDateString("zh-TW");

  if (activeCookingPlan === null) {
    return;
  }
  const [loading, setLoading] = useState(true);

  const onChange = (checked: boolean) => {
    setLoading(!checked);
  };
  return (
    <Wrapper>
      <Switch checked={!loading} onChange={onChange} />
      <Card style={{ width: 300, marginTop: 16 }} loading={loading}>
        <Meta title="烹煮計畫" description="想好什麼時候要來下廚了嗎？" />
        <h3>烹煮日期：</h3>
        <Space direction="vertical">
          <DatePicker onChange={pickCookingDate} />
        </Space>
        <div>
          <p>烹飪區間：</p>
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
          <br />
          <br />
          <Button type="primary" onClick={handleClick}>
            確認烹煮計畫
          </Button>
        </div>
        <div>
          <Modal
            title="已新增烹煮行程"
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>要建立採購清單嗎？</p>
          </Modal>
        </div>
      </Card>
      <Card style={{ width: 300, marginTop: 16 }}>
        <Skeleton loading={loading} avatar active>
          <Meta title="預覽清單" description="This is the description" />
          <div>
            <h2>預計份量</h2>
            {combinedServingArray.map((meal, index) => (
              <div key={index}>
                <div>品項: {meal.name}</div>
                <div>份量: {meal.serving}</div>
                <div>單位: {meal.unit}</div>
                <hr />
              </div>
            ))}
          </div>
        </Skeleton>
      </Card>
      <Card style={{ width: 300, marginTop: 16 }} loading={loading}>
        <Meta title="還不知道要放什麼的計畫" />
        <div>
          <Divider orientation="right" orientationMargin={50}>
            烹煮日期：{dateForCooking}
          </Divider>

          {activeCookingPlan?.cookingItems.map((plan, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "row" }}>
              <div>品項: {plan.name}</div>
              <div>
                份量: {plan.serving} {plan.unit}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <>
          <ProCard
            style={{ width: 300, marginTop: 16 }}
            title="現有烹煮計畫"
            ghost
            gutter={8}
            collapsible
            type="inner"
          >
            <ProCard bordered>
              <div>
                <Divider orientation="left" orientationMargin={50}>
                  烹煮日期：{dateForCooking}
                </Divider>
                {activeCookingPlan?.cookingItems.map((plan, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <div>品項: {plan.name}</div>
                    <div>
                      份量: {plan.serving} {plan.unit}
                    </div>
                  </div>
                ))}
              </div>
            </ProCard>
          </ProCard>
        </>
      </div>
    </Wrapper>
  );
}

export default CookingSchedule;
