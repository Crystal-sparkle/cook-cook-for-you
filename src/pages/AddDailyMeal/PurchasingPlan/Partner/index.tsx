import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Button, message } from "antd";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React from "react";
import { auth, db } from "../../../../services/firebase";
import { PartnerType } from "../../../../types";
import { UserOutlinedIconStyle } from "../PurchasingPlan.style";
import { PartnerContainer, PartnerProCard } from "./partner.style";

const Partner: React.FC = () => {
  const currentUser = auth.currentUser;
  const currentUid: string = currentUser?.uid ?? "";

  const handleParnerList = async (values: PartnerType) => {
    if (!currentUid) {
      return false;
    }
    const userCollection = collection(db, "user");
    const q = query(userCollection, where("uid", "==", currentUid));

    try {
      if (!values.partner1Name) {
        message.error("Missing partner details");
        return false;
      }
      const partners = [values.partner1Name, values.partner2Name];

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        message.error("找不到資料");
        return false;
      }
      querySnapshot.forEach(async (doc: { ref: any }) => {
        const docRef = doc.ref;

        await updateDoc(docRef, {
          partners,
        });
      });

      message.success("成功加入夥伴");
      return true;
    } catch (error) {
      message.error("夥伴名單更新失敗");
      return false;
    }
  };

  return (
    <>
      <ModalForm
        title="編輯夥伴清單"
        trigger={
          <Button type="text">
            <UserOutlinedIconStyle />
          </Button>
        }
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleParnerList}
      >
        <PartnerContainer>
          <PartnerProCard>
            <ProFormText
              width="md"
              label="夥伴 1 名字 "
              name="partner1Name"
              labelCol={{ span: 8 }}
            />

            <ProFormText
              width="md"
              label="夥伴 2 名字 "
              name="partner2Name"
              labelCol={{ span: 8 }}
            />
          </PartnerProCard>
        </PartnerContainer>
      </ModalForm>
    </>
  );
};
export default Partner;
