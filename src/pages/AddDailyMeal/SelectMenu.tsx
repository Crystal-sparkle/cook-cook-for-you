import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { ModalForm } from "@ant-design/pro-components";
import type { DatePickerProps, MenuProps } from "antd";
import { Button, DatePicker, Dropdown, Space, message } from "antd";
import "firebase/database";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { db } from "../../firbase";
import { MenuItem } from "../../types";

// ///
const quantities: MenuProps["items"] = [
  { key: "1", label: "1" },
  { key: "2", label: "2" },
  { key: "3", label: "3" },
  { key: "4", label: "4" },
  { key: "5", label: "5" },
];

const SelectMenu: React.FC = () => {
  const userInformation = useContext(AuthContext);
  const currentUserUid = userInformation?.user?.uid;

  const [items, setItems] = useState<MenuItem[]>();

  useEffect(() => {
    const getRecipesName = async () => {
      const recipesCollection = collection(db, "recipess");

      const queryRef = query(
        recipesCollection,
        where("userId", "==", currentUserUid)
      );
      const unsubscribe = onSnapshot(queryRef, (snapshot) => {
        const newOptions = snapshot.docs.map((doc, index) => ({
          key: `${index}`,
          label: doc.data().name,
        }));
        setItems(newOptions as MenuItem[]);
      });

      return () => unsubscribe();
    };

    getRecipesName();
  }, []);

  ////
  const [newMealPlan, setNewMealPlan] = useState<string | undefined>("");
  //newTime 的初始值為 undefined，並且可以接受 Timestamp 或 undefined。
  //這個錯誤表明 TypeScript 預期 setNewMealPlan 是一個函數，
  //它接受一個 undefined 的參數，但你卻嘗試將 string 類型的值賦給它。

  //為了解決這個問題，你需要明確指定 setNewMealPlan 的型別，以確保它可以接受
  // string 或 undefined。修改 useState 行如下：
  const [newTime, setNewTime] = useState<Timestamp | undefined>();
  const [newQty, setNewQty] = useState<string>("1");
  const handleDateChange: DatePickerProps["onChange"] = (date) => {
    if (date !== null) {
      const timestamp = Timestamp.fromDate(date.toDate());

      setNewTime(timestamp);
    }
  };

  const handleSelectItem = ({ key }: { key: string }) => {
    const selectedItem = items?.find((item) => item?.key === key);
    if (selectedItem) {
      message.info(`已選取 : ${selectedItem.label}`);
      setNewMealPlan(selectedItem.label);
    }
  };

  const handleQuantitySelection = ({ key }: { key: string }) => {
    setNewQty(key);
  };

  const [newMealId, setNewMealId] = useState("");
  useEffect(() => {
    const handleMealId = async () => {
      const recipesCollection = collection(db, "recipess");
      const q = query(recipesCollection, where("name", "==", newMealPlan));
      try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const recipeId = docSnap.id;

          setNewMealId(recipeId);
        }
      } catch {
        message.error("獲取資料失敗");
      }
    };
    handleMealId();
  }, [newMealPlan]);

  async function addMealPlan() {
    const DailymealPlanCollection = collection(db, "DailyMealPlan");
    const docRef = doc(DailymealPlanCollection);
    const newPlan = {
      mealPlan: [
        {
          name: newMealPlan,
          serving: Number(newQty),
          unit: "份",
          id: newMealId,
        },
      ],
      planDate: newTime,
      userId: currentUserUid,
    };

    try {
      await setDoc(docRef, newPlan);
      const updatedData = { mealId: docRef.id };
      await setDoc(doc(DailymealPlanCollection, docRef.id), updatedData, {
        merge: true,
      });
    } catch (error) {
      message.error("取得資料失敗");
    }
  }

  const [modalVisit, setModalVisit] = useState(false);

  return (
    <>
      <Space>
        <Button
          type="primary"
          style={{ backgroundColor: "#b7dbdf", color: "#4b4947" }}
          onClick={() => {
            setModalVisit(true);
          }}
        >
          <PlusOutlined />
          菜單規劃
        </Button>
      </Space>
      <ModalForm
        title="開啟你的每日菜單"
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={async () => {
          await addMealPlan();
          message.success("提交成功");
          setNewMealPlan("");
          return true;
        }}
        open={modalVisit}
        onOpenChange={setModalVisit}
        submitter={{
          searchConfig: {
            submitText: "確認",
          },
        }}
      >
        <h2>選取日期</h2>
        <Space direction="vertical">
          <DatePicker placeholder="選擇日期" onChange={handleDateChange} />
        </Space>
        <br />
        <h2>選取料理</h2>
        <Dropdown menu={{ items, onClick: handleSelectItem }}>
          <Space>
            {newMealPlan}
            <DownOutlined />
          </Space>
        </Dropdown>
        <h2>選取份量</h2>
        <Dropdown
          menu={{ items: quantities, onClick: handleQuantitySelection }}
          placement="bottomLeft"
          arrow
        >
          <Button icon={<DownOutlined />}>{newQty}</Button>
        </Dropdown>
      </ModalForm>
    </>
  );
};

export default SelectMenu;
