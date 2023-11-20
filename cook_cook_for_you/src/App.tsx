import type { CalendarProps } from "antd";
import {
  Button,
  Calendar,
  DatePicker,
  DatePickerProps,
  Flex,
  Input,
  Space,
  Tag,
} from "antd";
import type { Dayjs } from "dayjs";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import "firebase/database";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
// The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

const getListData = (value: Dayjs) => {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: "meeting", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
        { type: "error", content: "This is error event." },
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "This is warning event" },
        { type: "success", content: "This is very long usual event......" },
        { type: "error", content: "This is error event 1." },
        { type: "error", content: "This is error event 2." },
        { type: "error", content: "This is error event 3." },
        { type: "error", content: "This is error event 4." },
      ];
      break;
    default:
  }
  return listData || [];
};

const firebaseConfig = {
  apiKey: "AIzaSyASak1RhNpksXuoa_xg4ibo5_NqLTMuYNE",
  authDomain: "cook-cook-for-you-test.firebaseapp.com",
  projectId: "cook-cook-for-you-test",
  storageBucket: "cook-cook-for-you-test.appspot.com",
  messagingSenderId: "200140396105",
  appId: "1:200140396105:web:858fccd67c7784cf6f5198",
  measurementId: "G-QC9P648LL8",
};

const App: React.FC = () => {
  const [mealItems, setmealItems] = useState();
  // const [mealItems, setmealItems] = useState([]);
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  console.log(analytics);
  const db = getFirestore();
  const recipesCollection = collection(db, "recipes");
  const docRef = doc(recipesCollection, "100");

  useEffect(() => {
    async function getRecipeName() {
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const recipeData = docSnap.data();
          // mealItems.push(recipeData.name);
          // const newMealItem = []

          // setmealItems([...recipeData.name, mealItems]);
          setmealItems(recipeData.name);
          console.log("Recipe Name:", mealItems);
          // return recipeName;
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    }
    // 呼叫函數來取得資料
    getRecipeName();
  }, []);
  const handleDateChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  /// 搜尋列
  const [searchInputValue, setSearchInputValue] = useState("");
  const { Search } = Input;
  // type OnSearchFunction = (value: any, _e: any, info: any) => void;
  // const onSearch: OnSearchFunction = (value, _e, info) =>
  //   console.log(info?.source, value);
  // setSearchInputValue(value);

  const onSearch = (value: string, _event: any) => {
    console.log("Search value:", value);
    setSearchInputValue(value);
  };
  console.log(searchInputValue);
  //// firebase 查找資料庫資訊
  const [searchResults, setSearchResults] = useState([]);

  // 在這裡執行副作用操作
  const handleSearch = async () => {
    // const recipesCollection = collection(db, "recipes");
    const q = query(recipesCollection, where("name", "==", searchInputValue));

    try {
      const querySnapshot = await getDocs(q);
      const results: string[] = [];

      querySnapshot.forEach((doc) => {
        results.push(doc.data().name);
      });

      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    handleSearch();
  }, [searchInputValue]);
  ///
  const preventDefault = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    console.log("Clicked! But prevent default.");
  };
  const dateCellRender = (value: Dayjs) => {
    // const listData = mealItems;
    const listData = getListData(value);

    return (
      <>
        <ul className="events">
          {listData.map((item) => (
            <li key={item.content}>
              <Tag closeIcon onClose={preventDefault}>
                {item.content}
              </Tag>
            </li>
          ))}
        </ul>
      </>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    console.log(mealItems);
    // if (info.type === "date") return dateCellRender(current, mealItems);
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <>
      <div style={{ width: "100%", height: "400px", padding: "50px" }}>
        <h1>食譜名稱：</h1>
        <h2>{mealItems}</h2>
        <Space direction="vertical">
          <DatePicker onChange={handleDateChange} />
        </Space>
        <br />
        <Space direction="vertical">
          <Search
            placeholder="input search text"
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            onSearch={onSearch}
            enterButton
          />
        </Space>
        <Flex gap="small" wrap="wrap">
          <Button type="primary" onClick={handleSearch}>
            新增規劃料理
          </Button>
          <h2>{searchResults}</h2>
        </Flex>
      </div>
      <Calendar
        cellRender={cellRender}
        onSelect={(date) => {
          console.log("selected Date", date);
        }}
        // fullCellRender={() => {
        //   if (new Date().getDate() === targetDate.getDate()) {
        //     return <h5>it's a good day !</h5>;
        //   }
        // }}
      />
    </>
  );
};

export default App;
