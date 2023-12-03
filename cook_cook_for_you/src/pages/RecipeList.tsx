import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";

import { Button, Form, Input, Space, Upload, message } from "antd";
import "firebase/database";
import { addDoc, collection } from "firebase/firestore";
const { TextArea } = Input;
// const { TextArea } = Input;
// import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import React from "react";
import styled from "styled-components";
import { db } from "../firbase";
dayjs.locale("zh-cn");

const Wrapper = styled.div`
  margin: 40px;
  padding: 20px;
  border-radius: 20px;
`;

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const RecipeList: React.FC = () => {
  // const onFinish = (values: any) => {
  //   console.log("Received values of form:", values);
  // };
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const recipesCollection = collection(db, "recipess");
    try {
      const docRef = await addDoc(recipesCollection, values);
      console.log("Document written successfully!", docRef.id);
      message.success("成功新增", values.name);
    } catch (error) {
      console.error("新增失败", error);
      message.error("新增失败");
    }
  };
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  // const [form] = Form.useForm<{ name: string; company: string }>();
  return (
    <Wrapper>
      <p>hello</p>
      <ModalForm<{
        name: string;
        company: string;
      }>
        title="建立食譜"
        trigger={
          <Button type="primary">
            <PlusOutlined />
            新建食譜
          </Button>
        }
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log("run"),
        }}
        submitTimeout={2000}
        // onFinish={async (values) => {
        //   await waitTime(2000);
        //   console.log(values.name);
        //   message.success("提交成功");
        //   return true;
        // }}
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            submitText: "確認",
          },
        }}
        // onValuesChange={(changedValues, allValues) => {
        //   // changedValues 發生變化的表單單向的值
        //   // allValues 所有表單內容當前的值
        //   console.log("Changed Values:", changedValues);
        //   console.log("All Values:", allValues);
        // }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="name"
            label="食譜名稱"
            tooltip="最常為 24 位"
            placeholder="蛋沙拉三明治"
            initialValue="蛋沙拉三明治"
          />

          <ProFormTextArea
            width="lg"
            name="description"
            label="簡介料理"
            initialValue="冬天早上柔軟的蛋液與吐司間與熱紅茶的交織相容的三角愛情故事"
            placeholder="冬天早上柔軟的蛋液與吐司間與熱紅茶的交織相容的三角愛情故事"
          />
          {/* <ProFormDateRangePicker name="contractTime" label="合同生效时间" /> */}
        </ProForm.Group>
        <ProForm.Group>
          <Form.Item
            label="上傳圖片"
            name="mainPhoto"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload action="/upload.do" listType="picture-card" maxCount={1}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上傳</div>
              </div>
            </Upload>
          </Form.Item>
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            request={async () => [
              {
                value: "1",
                label: "1",
              },
            ]}
            width="xs"
            name="searving"
            label="烹煮份量"
          />
          <ProFormSelect
            options={[
              {
                value: "10 mins",
                label: "10分鐘",
              },
              {
                value: "15 mins",
                label: "15分鐘",
              },
              {
                value: "20 mins",
                label: "20分鐘",
              },
              {
                value: "25 mins",
                label: "25分鐘",
              },
              {
                value: "30 mins",
                label: "30分鐘",
              },
              {
                value: "45 mins",
                label: "45分鐘",
              },
              {
                value: "60 mins",
                label: "60分鐘",
              },
              {
                value: "90 mins",
                label: "90分鐘",
              },
              {
                value: "120 mins",
                label: "120分鐘",
              },
            ]}
            initialValue="15 mins"
            width="xs"
            name="cookingTime"
            label="烹煮時間"
          />
        </ProForm.Group>
        <ProFormRadio.Group
          label="類別"
          name="category"
          initialValue="主餐"
          options={[
            "主餐",
            "肉類",
            "蔬菜類",
            "蛋、豆類",
            "海鮮",
            "烘焙類",
            "其他類",
          ]}
        />
        <ProForm.Group>
          <Form.List name="ingredients">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item {...restField} name={[name, "name"]}>
                      <Input placeholder="食材" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "qty"]}>
                      <Input type="number" placeholder="數量" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "unit"]}>
                      <Input placeholder="單位" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ maxWidth: 600 }}
                  >
                    添加食材
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </ProForm.Group>
        <hr />
        <ProForm.Group>
          <Form.List name="steps">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="center"
                  >
                    <Form.Item
                      label="說明"
                      {...restField}
                      name={[name, "stepDescription"]}
                    >
                      <TextArea rows={4} placeholder="步驟說明" />
                    </Form.Item>
                    <Form.Item
                      label="上傳圖片"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      {...restField}
                      name={[name, "stepPhote"]}
                    >
                      <Upload action="/upload.do" listType="picture-card">
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      </Upload>
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加步驟
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </ProForm.Group>
        <hr />

        <ProFormText width="lg" name="refLink" label="參考連結" />
        <ProFormTextArea
          width="lg"
          name="note"
          label="備註"
          initialValue="很好吃唷"
        />
      </ModalForm>
    </Wrapper>
  );
};
export default RecipeList;
