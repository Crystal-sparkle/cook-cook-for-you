import { DownOutlined } from "@ant-design/icons";
import { DatePicker, DatePickerProps, Dropdown, Space, message } from "antd";
import "firebase/database";
import React from "react";

interface MenuItem {
  label: string;
  key: string;
}

const handleDateChange: DatePickerProps["onChange"] = (date, dateString) => {
  console.log(date, dateString);
};
const onClick = ({ key }: { key: string }) => {
  const selectedItem = items.find((item) => item?.key === key);
  if (selectedItem) {
    message.info(`You selected : ${selectedItem.label}`);
    console.log(selectedItem.label);
  }
};
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
//  async function addArticle() {
//   const DailymealPlanCollection = collection(db, "DailymealPlan");
//   const docRef = doc(DailymealPlanCollection);
//   const newPlan = {
//     mealPlan: "",
//     planDate:Timestamp
//   };

//   newArticle.id = docRef.id;
//   await setDoc(docRef, newPlan);
// }

// ///

const SelectMenu: React.FC = () => {
  return (
    <>
      <Space direction="vertical">
        <DatePicker onChange={handleDateChange} />
      </Space>
      <br />
      <Dropdown menu={{ items, onClick }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Select menu item
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </>
  );
};

export default SelectMenu;
