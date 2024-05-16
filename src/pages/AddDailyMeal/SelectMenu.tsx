import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { ModalForm } from "@ant-design/pro-components";
import type { DatePickerProps, MenuProps } from "antd";
import { Button, DatePicker, Dropdown, Space, message } from "antd";
import "firebase/database";
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { db } from "../../firebase";
import { SelectedMenu } from "../../types";

const quantities: MenuProps["items"] = [
  { key: "1", label: "1" },
  { key: "2", label: "2" },
  { key: "3", label: "3" },
  { key: "4", label: "4" },
  { key: "5", label: "5" },
];

const SelectMenu: React.FC = () => {
  const { user } = useContext(AuthContext);
  const currentUserUid = user?.uid;
  const [modalVisit, setModalVisit] = useState(false);

  const [menuState, setMenuState] = useState<SelectedMenu>({
    selectedDish: "",
    selectedTime: null,
    selectedQty: "1",
    items: [],
    newMealId: "",
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipesCollection = collection(db, "recipess");

      const queryRef = query(
        recipesCollection,
        where("userId", "==", currentUserUid)
      );
      const unsubscribe = onSnapshot(queryRef, (snapshot) => {
        const items = snapshot.docs.map((doc, index) => ({
          key: `${index}`,
          label: doc.data().name,
        }));
        setMenuState((prev) => ({ ...prev, items }));
      });

      return () => unsubscribe();
    };

    fetchRecipes();
  }, [currentUserUid]);

  useEffect(() => {
    const fetchMealId = async () => {
      const recipesCollection = collection(db, "recipess");
      const q = query(
        recipesCollection,
        where("name", "==", menuState.selectedDish)
      );
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const docRef = doc.ref;

          if (!querySnapshot.empty) {
            const recipeId = docRef.id;
            setMenuState((prev) => ({ ...prev, newMealId: recipeId }));
          }
        });
      } catch (error) {
        message.error("獲取資料失敗");
      }
    };
    fetchMealId();
  }, [menuState.selectedDish]);

  const handleDateChange: DatePickerProps["onChange"] = (date) => {
    if (date !== null) {
      const timestamp = Timestamp.fromDate(date.toDate());
      setMenuState((prev) => ({ ...prev, selectedTime: timestamp }));
    }
  };

  const handleSelectItem = ({ key }: { key: string }) => {
    const selectedItem = menuState.items?.find((item) => item?.key === key);
    if (selectedItem) {
      message.info(`已選取 : ${selectedItem.label}`);
      setMenuState((prev) => ({
        ...prev,
        selectedDish: selectedItem ? selectedItem.label : "",
      }));
    }
  };

  const handleQuantitySelection = ({ key }: { key: string }) => {
    setMenuState((prev) => ({ ...prev, selectedQty: key }));
  };

  const addMealPlan = async () => {
    const collectionRef = collection(db, "DailyMealPlan");
    const newPlan = {
      mealPlan: [
        {
          name: menuState.selectedDish,
          serving: Number(menuState.selectedQty),
          unit: "份",
          id: menuState.newMealId,
        },
      ],
      planDate: menuState.selectedTime,
      userId: currentUserUid,
    };

    try {
      const docRef = await addDoc(collectionRef, newPlan);
      const updatedData = { mealId: docRef.id };
      await updateDoc(docRef, updatedData);
      message.success("提交成功");
      setMenuState((prev) => ({
        ...prev,
        selectedDish: "",
        selectedQty: "1",
        newMealId: "",
      }));
    } catch (error) {
      message.error("取得資料失敗");
    }
  };

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
          setModalVisit(false);
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
        <Dropdown
          overlayStyle={{ maxHeight: "200px", overflowY: "auto" }}
          placement="topLeft"
          menu={{
            items: menuState.items,
            selectable: true,
            onClick: handleSelectItem,
          }}
        >
          <Space>
            {menuState.selectedDish}
            <DownOutlined />
          </Space>
        </Dropdown>
        <h2>選取份量</h2>
        <Dropdown
          menu={{ items: quantities, onClick: handleQuantitySelection }}
          placement="bottomLeft"
          arrow
        >
          <Button icon={<DownOutlined />}>{menuState.selectedQty}</Button>
        </Dropdown>
      </ModalForm>
    </>
  );
};

export default SelectMenu;
