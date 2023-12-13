import { ProCard, ProForm, ProFormText } from "@ant-design/pro-components";
import { Form, Space, message } from "antd";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firbase";
type SizeType = Parameters<typeof Form>[0]["size"];

const Parner: React.FC = () => {
  const [componentSize, setComponentSize] = useState<SizeType | "default">(
    "default"
  );

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
  interface Parner {
    parner1Name: string | null;
    parner1Email: string | null;
    parner2Name: string | null;
    parner2Email: string | null;
  }

  const handleParnerValue = async (values: Parner) => {
    const userCollection = collection(db, "user");

    try {
      const parners = {
        parners: [
          { name: values.parner1Name, email: values.parner1Email },
          { name: values.parner2Name, email: values.parner2Email },
        ],
      };
      await addDoc(userCollection, parners);

      console.log(values);
      console.log(values.parner2Name);
      message.success("成功新增");
      return true;
    } catch (error) {
      console.log(values);
      console.error("新增失败", error);
      message.error("新增失败");
    }
  };

  return (
    <>
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
          placeholder=""
        >
          <ProForm.Group>
            <ProFormText
              width="md"
              label="夥伴 1 信箱 "
              name="parner1Email"
              labelCol={{ span: 8 }} // 設置 label 的寬度
            />

            <ProFormText
              width="md"
              label="夥伴 1 名字 "
              name="parner1Name"
              labelCol={{ span: 8 }}
            />

            <ProFormText
              width="md"
              label="夥伴 2 信箱 "
              name="parner2Email"
              labelCol={{ span: 8 }}
            />

            <ProFormText
              width="md"
              label="夥伴 2 名字 "
              name="parner2Name"
              labelCol={{ span: 8 }}
            />
          </ProForm.Group>
        </ProForm>
      </ProCard>
    </>
  );
};
export default Parner;
