import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { ModalForm } from "@ant-design/pro-components";
import type { DatePickerProps, MenuProps } from "antd";
import { Button, DatePicker, Dropdown, Space, message } from "antd";
import "firebase/database";
import { Timestamp } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
  addPlanAndIdToFirestore,
  fetchId,
  subscribeToRecipes,
} from "../../services/firebase";
import { SelectedMenu, SetMenuStateFunction } from "../../types";

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
    const unsubscribe = subscribeToRecipes(
      "recipess",
      "userId",
      currentUserUid,
      (items) => {
        setMenuState((prev) => ({ ...prev, items }));
      }
    );

    return () => unsubscribe();
  }, [currentUserUid]);

  useEffect(() => {
    if (menuState.selectedDish) {
      fetchId("recipess", "name", menuState.selectedDish, (Id) => {
        setMenuState((prev) => ({ ...prev, newMealId: Id }));
      });
    }
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

  const getMealPlanData = (menuState: SelectedMenu) => {
    const { selectedDish, selectedQty, newMealId, selectedTime } = menuState;
    return {
      mealPlan: [
        {
          name: selectedDish,
          serving: Number(selectedQty),
          unit: "份",
          id: newMealId,
        },
      ],
      planDate: selectedTime,
      userId: currentUserUid,
    };
  };

  const resetMenuState = (setMenuState: SetMenuStateFunction): void => {
    setMenuState((prev) => ({
      ...prev,
      selectedDish: "",
      selectedQty: "1",
      newMealId: "",
      selectedTime: null,
    }));
  };

  const addMealPlan = async (): Promise<void> => {
    const newPlan = getMealPlanData(menuState);

    try {
      await addPlanAndIdToFirestore(newPlan, "DailyMealPlan");
      message.success("提交成功");
      resetMenuState(setMenuState);
    } catch (error) {
      message.error("取得資料失敗");
    }
  };

  const handleSubmit = async () => {
    if (!menuState.selectedTime) {
      message.error("請選擇日期");
      return false;
    }
    if (!menuState.selectedDish) {
      message.error("請選擇料理");
      return false;
    }
    if (!menuState.selectedQty) {
      message.error("請選擇份量");
      return false;
    }
    await addMealPlan();
    setModalVisit(false);

    return true;
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
        onFinish={handleSubmit}
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
