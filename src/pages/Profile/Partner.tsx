import { ProCard, ProForm, ProFormText } from "@ant-design/pro-components";
import { Form, Space, message } from "antd";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components";
import { auth, db } from "../../firbase";
import { PartnerType } from "../../types";

type SizeType = Parameters<typeof Form>[0]["size"];

const Partner: React.FC = () => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  const currentUser = auth.currentUser;
  const currentUid: string = currentUser?.uid ?? "";

  const handleParnerValue = async (values: PartnerType) => {
    if (!currentUid) {
      return false;
    }
    const userCollection = collection(db, "user");
    const q = query(userCollection, where("uid", "==", currentUid));

    try {
      if (
        !values.partner1Name ||
        !values.partner1Email ||
        !values.partner2Name ||
        !values.partner2Email
      ) {
        message.error("Missing partner details");
        return false;
      }
      const partners = [
        { name: values.partner1Name, email: values.partner1Email },
        { name: values.partner2Name, email: values.partner2Email },
      ];

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

  const PartnerContainer = styled.div`
    margin: 10 auto;
    width: 70%;
  `;

  return (
    <PartnerContainer>
      <ProCard style={{ maxWidth: 500, margin: 0 }} boxShadow>
        <Space></Space>
        <ProForm
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          initialValues={{ size: componentSize }}
          onValuesChange={onFormLayoutChange}
          size={componentSize as SizeType}
          style={{ maxWidth: 600 }}
          onFinish={handleParnerValue}
          submitter={{
            searchConfig: {
              submitText: "確認",
            },
          }}
        >
          <ProForm.Group>
            <ProFormText
              width="md"
              label="夥伴 1 信箱 "
              name="partner1Email"
              labelCol={{ span: 8 }}
            />
            <ProFormText
              width="md"
              label="夥伴 1 名字 "
              name="partner1Name"
              labelCol={{ span: 8 }}
            />

            <ProFormText
              width="md"
              label="夥伴 2 信箱 "
              name="partner2Email"
              labelCol={{ span: 8 }}
            />
            <ProFormText
              width="md"
              label="夥伴 2 名字 "
              name="partner2Name"
              labelCol={{ span: 8 }}
            />
          </ProForm.Group>
        </ProForm>
      </ProCard>
    </PartnerContainer>
  );
};
export default Partner;
