import { CarryOutOutlined } from "@ant-design/icons";
import { Button, Space, message } from "antd";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import { db } from "../../../firbase";
import { PurchaseDrawerProps } from "../../../types";
import ShoppingList from "../ShoppingList";
import {
  DrawerStyle,
  ExportOutlinedIconStyle,
  SharingButton,
  ShoppingListButtonStyle,
} from "./PurchasingPlan.style";
import { useDrawerControl } from "./hook/useDrawerControl";

const PurchasingDrawer = ({
  planId,
  purchasePlanCollection,
  setPurchasePlanCollection,
}: PurchaseDrawerProps) => {
  const userInformation = useContext(AuthContext);
  const currentUserUid = userInformation?.user?.uid;

  const { open, showDrawer, onClose } = useDrawerControl();

  const closePlan = () => {
    const closePurchasePlan = async () => {
      const PurchasePlanCollection = collection(db, "purchasePlan");
      const q = query(PurchasePlanCollection, where("isActive", "==", true));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const docRef = doc.ref;

          await updateDoc(docRef, {
            isActive: false,
          });
        });
      } catch (error) {
        message.error("取得資料失敗");
      }
    };
    const closeCookingSchedule = async () => {
      const CookingPlanCollection = collection(db, "cookingPlan");
      const q = query(CookingPlanCollection, where("isActive", "==", true));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const docRef = doc.ref;

          await updateDoc(docRef, {
            isActive: false,
          });
        });
      } catch (error) {
        message.error("取得資料失敗");
      }
    };
    closeCookingSchedule();
    closePurchasePlan();

    message.info("開啟下一個烹煮計畫吧");
  };

  return (
    <>
      <ShoppingListButtonStyle
        type="primary"
        onClick={showDrawer}
        icon={<CarryOutOutlined />}
        block
      >
        購買清單
      </ShoppingListButtonStyle>
      <DrawerStyle
        title="購買清單"
        onClose={onClose}
        open={open}
        width={700}
        extra={
          <Space>
            <Link to={`/shopping/${currentUserUid}/${planId}`} target="_blank">
              <SharingButton
                type="text"
                icon={<ExportOutlinedIconStyle />}
              ></SharingButton>
            </Link>
            <Button onClick={onClose}>Close</Button>
            {purchasePlanCollection.length > 0 ? (
              <Button type="primary" onClick={closePlan}>
                完成計畫
              </Button>
            ) : (
              <div></div>
            )}
          </Space>
        }
      >
        {purchasePlanCollection.length > 0 ? (
          purchasePlanCollection.map((item, index) => (
            <ShoppingList key={index} purchasePlan={item} index={index} />
          ))
        ) : (
          <div>請先建立烹煮計畫唷</div>
        )}
        <br />
      </DrawerStyle>
    </>
  );
};

export default PurchasingDrawer;
