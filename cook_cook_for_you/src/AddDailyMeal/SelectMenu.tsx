import { DownOutlined } from "@ant-design/icons";
import type { DatePickerProps, MenuProps } from "antd";
import { Button, DatePicker, Dropdown, Space, message } from "antd";
import "firebase/database";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firbase";

interface MenuItem {
  label: string;
  key: string;
}

const items: MenuItem[] = [
  {
    label: "歐姆蛋",
    key: "1",
  },
  {
    label: "烏龍麵",
    key: "2",
  },
  {
    label: "大阪燒",
    key: "3",
  },
  {
    label: "海鮮鍋燒麵",
    key: "4",
  },
  {
    label: "湯咖哩",
    key: "5",
  },
  {
    label: "紅醬牛肉千層麵",
    key: "6",
  },
  {
    label: "可頌",
    key: "7",
  },
  {
    label: "南瓜濃湯",
    key: "8",
  },
  {
    label: "芋頭西米露",
    key: "9",
  },
];

// ///
const quantities: MenuProps["items"] = [
  { key: "1", label: "1" },
  { key: "2", label: "2" },
  { key: "3", label: "3" },
  { key: "4", label: "4" },
  { key: "5", label: "5" },
];

const SelectMenu: React.FC = () => {
  const [newMealPlan, setNewMealPlan] = useState();
  const [newTime, setNewTime] = useState();
  const [newQty, setNewQty] = useState();
  const handleDateChange: DatePickerProps["onChange"] = (date) => {
    // console.log(date, dateString);
    const timestamp = Timestamp.fromDate(date.toDate());
    console.log("Timestamp:", timestamp);
    setNewTime(timestamp);
  };

  const onClick = ({ key }: { key: string }) => {
    const selectedItem = items.find((item) => item?.key === key);
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

  console.log(newTime);
  console.log(newMealPlan);
  console.log(newQty);

  ///
  async function addMealPlan() {
    const DailymealPlanCollection = collection(db, "DailyMealPlan");
    const docRef = doc(DailymealPlanCollection);
    const newPlan = {
      mealPlan: [{ name: newMealPlan, serving: newQty, unit: "份" }],
      planDate: newTime,
    };
    try {
      await setDoc(docRef, newPlan);
      console.log("Document written successfully!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  return (
    <>
      <h2>選取日期</h2>
      <Space direction="vertical">
        <DatePicker onChange={handleDateChange} />
      </Space>
      <br />
      <h2>選取料理</h2>
      <Dropdown menu={{ items, onClick }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Select menu item
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>

      <Dropdown
        menu={{ items: quantities, onClick: handleQuantitySelection }}
        placement="bottomLeft"
        arrow
      >
        <Button>Choose Quantity</Button>
      </Dropdown>
      <Button onClick={addMealPlan}>寫入資料庫</Button>
    </>
  );
};

export default SelectMenu;
