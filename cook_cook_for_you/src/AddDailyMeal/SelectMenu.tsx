import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { ModalForm } from "@ant-design/pro-components";
import type { DatePickerProps, MenuProps } from "antd";
import { Button, DatePicker, Dropdown, Space, message } from "antd";
import "firebase/database";
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firbase";

interface MenuItem {
  label: string;
  key: string;
}
[];

// ///
const quantities: MenuProps["items"] = [
  { key: "1", label: "1" },
  { key: "2", label: "2" },
  { key: "3", label: "3" },
  { key: "4", label: "4" },
  { key: "5", label: "5" },
];

const SelectMenu: React.FC = () => {
  ////

  const [items, setItems] = useState<MenuItem[]>();

  useEffect(() => {
    const getRecipesName = async () => {
      const recipesCollection = collection(db, "recipes");

      // 監聽 'recipe' collection 中 'name' 欄位的資料變化
      const unsubscribe = onSnapshot(recipesCollection, (snapshot) => {
        const newOptions = snapshot.docs.map((doc, index) => ({
          key: `${index}`,
          label: doc.data().name,
        }));
        console.log("newOptions", newOptions);
        setItems(newOptions as MenuItem[]);
      });

      // 記得在組件卸載時取消訂閱以避免記憶體洩漏
      return () => unsubscribe();
    };
    getRecipesName();
  }, []); // 空的依賴陣列表示只在組件掛載時執行一次

  ////
  const [newMealPlan, setNewMealPlan] = useState<string | undefined>(
    "你要吃什麼？"
  );
  //newTime 的初始值為 undefined，並且可以接受 Timestamp 或 undefined。
  //這個錯誤表明 TypeScript 預期 setNewMealPlan 是一個函數，
  //它接受一個 undefined 的參數，但你卻嘗試將 string 類型的值賦給它。

  //為了解決這個問題，你需要明確指定 setNewMealPlan 的型別，以確保它可以接受
  // string 或 undefined。修改 useState 行如下：
  const [newTime, setNewTime] = useState<Timestamp | undefined>();
  const [newQty, setNewQty] = useState<string>("想要吃幾份");
  const handleDateChange: DatePickerProps["onChange"] = (date) => {
    // console.log(date, dateString);
    if (date !== null) {
      const timestamp = Timestamp.fromDate(date.toDate());

      setNewTime(timestamp);
    }
  };

  const onClick = ({ key }: { key: string }) => {
    const selectedItem = items?.find((item) => item?.key === key);
    if (selectedItem) {
      message.info(`You selected : ${selectedItem.label}`);
      setNewMealPlan(selectedItem.label);
      console.log(selectedItem);
    }
  };
  const handleQuantitySelection = ({ key }: { key: string }) => {
    console.log(`Selected Quantity: ${key}`);
    setNewQty(key);
  };

  // console.log(newTime);console
  // console.log(newMealPlan);
  // console.log(newQty);

  ///
  async function addMealPlan() {
    const DailymealPlanCollection = collection(db, "DailyMealPlan");
    const docRef = doc(DailymealPlanCollection);
    const newPlan = {
      mealPlan: [{ name: newMealPlan, serving: Number(newQty), unit: "份" }],
      planDate: newTime,
    };
    try {
      await setDoc(docRef, newPlan);
      console.log("addMealPlan Document written successfully!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }
  // 做modal
  const [modalVisit, setModalVisit] = useState(false);

  return (
    <>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            setModalVisit(true);
          }}
        >
          <PlusOutlined />
        </Button>
      </Space>
      <ModalForm
        title="開啟你的每日菜單"
        open={modalVisit}
        onFinish={async () => {
          message.success("提交成功");
          return true;
        }}
        onOpenChange={setModalVisit}
        submitter={{
          searchConfig: {
            submitText: "確認",
          },
        }}
        onClick={addMealPlan}
      >
        <h2>選取日期</h2>
        <Space direction="vertical">
          <DatePicker placeholder="選擇日期" onChange={handleDateChange} />
        </Space>
        <br />
        <h2>選取料理</h2>
        <Dropdown menu={{ items, onClick }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {newMealPlan}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
        <h2>選取份量</h2>
        <Dropdown
          menu={{ items: quantities, onClick: handleQuantitySelection }}
          placement="bottomLeft"
          arrow
        >
          <Button icon={<DownOutlined />}>{newQty}</Button>
        </Dropdown>
        {/* <Button onClick={addMealPlan}>新增菜單規劃</Button> */}
      </ModalForm>
    </>
  );
};

export default SelectMenu;
