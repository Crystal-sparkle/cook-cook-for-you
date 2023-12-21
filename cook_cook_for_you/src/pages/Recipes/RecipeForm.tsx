import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { useState } from "react";

import { Button, Form, Input, Space, Upload, message } from "antd";
import "firebase/database";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
const { TextArea } = Input;
// const { TextArea } = Input;
// import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React from "react";
import styled from "styled-components";
import { db, storage } from "../../firbase";
import { Recipe } from "../../types";
dayjs.locale("zh-cn");

const StyledButton = styled(Button)`
  background: rgba(252, 208, 57, 0.7);
  font-size: 20px;
  color: #000000;
  height: 44px;
  transition: all 0.2s;

  &:hover {
    background: rgba(252, 208, 57, 1) !important;
  }
`;

const Wrapper = styled.div`
  margin: 10px;
  padding: 100px;
  border-radius: 20px;
`;

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

interface RcFile extends File {
  uid: string;
}

const RecipeForm: React.FC = () => {
  //  上傳圖片

  const handleUpload = async (file: RcFile) => {
    console.log(file);
    try {
      // const storageRef = ref(storage);
      const imageRef = ref(storage, `images/${file.name + file.uid}.jpg`);

      // 上傳圖片文件
      const snapshot = await uploadBytes(imageRef, file);

      //獲取url
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Image uploaded:", downloadURL);

      // 圖片的 URL 設置到表單中
      setMainPhoto(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const [mainPhoto, setMainPhoto] = useState("");

  //上傳圖片

  const [form] = Form.useForm();

  const onFinish = async (values: Recipe) => {
    const recipesCollection = collection(db, "recipess");
    await waitTime(2000);
    try {
      // 將圖片的 URL 添加到表單值
      // const formValues = form.getFieldsValue();
      const valuesWithImageURL = {
        ...values,
        mainPhoto: mainPhoto,
        userId: "crystal",
        time: Timestamp.now(),
      };
      console.log(valuesWithImageURL);
      const docRef = await addDoc(recipesCollection, valuesWithImageURL);
      // 將 docRef.id 放入recipess裡
      const updatedData = { id: docRef.id };
      await setDoc(doc(recipesCollection, docRef.id), updatedData, {
        merge: true,
      });

      console.log("Document written successfully!", docRef.id);

      //將狀態清空
      setMainPhoto("");
      message.success("成功新增");
      return true;
    } catch (error) {
      console.error("新增失败", error);
      message.error("新增失败");
    }
  };

  interface FileListObject {
    fileList: any[]; // Adjust the type of fileList according to your needs
  }
  const normFile = (e: any[] | FileListObject): any[] => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };

  return (
    <Wrapper>
      <ModalForm<Recipe>
        title="建立食譜"
        trigger={
          <StyledButton type="primary">
            <PlusOutlined />
            新增食譜
          </StyledButton>
        }
        form={form}
        // initialValues={{
        //   name: "12",
        //   description: "good",
        // }}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => console.log("run"),
        }}
        submitTimeout={2000}
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            submitText: "確認",
          },
        }}
        onValuesChange={(changedValues) => {
          //   // changedValues 發生變化的表單單向的值
          //   // allValues 所有表單內容當前的值
          console.log("Changed Values:", changedValues);
          //   console.log("All Values:", allValues);
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="name"
            label="食譜名稱"
            tooltip="最長為 24 位"
            placeholder="蛋沙拉三明治"
          />

          <ProFormTextArea
            width="lg"
            name="description"
            label="簡介料理"
            placeholder="暖心暖胃，冬天暖心選擇"
          />
          {/* <ProFormDateRangePicker name="contractTime" label="合同生效时间" /> */}
        </ProForm.Group>
        <ProForm.Group>
          <Form.Item
            label="上傳圖片"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              customRequest={({ file, onSuccess, onError }) => {
                if (file) {
                  handleUpload(file as RcFile)
                    .then(() => onSuccess?.(true))
                    .catch((error) => {
                      console.error("Custom upload error:", error);
                      onError?.(error);
                    });
                } else {
                  // 處理 file 為 undefined 的情況
                  console.error("File is undefined");
                  onError?.(new Error("File is undefined"));
                }
              }}
              listType="picture-card"
              accept="image/png, image/jpeg"
              maxCount={1}
            >
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
                value: 1,
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
                value: 10,
                label: "10分鐘",
              },
              {
                value: 15,
                label: "15分鐘",
              },
              {
                value: 20,
                label: "20分鐘",
              },
              {
                value: 25,
                label: "25分鐘",
              },
              {
                value: 30,
                label: "30分鐘",
              },
              {
                value: 45,
                label: "45分鐘",
              },
              {
                value: 60,
                label: "60分鐘",
              },
              {
                value: 90,
                label: "90分鐘",
              },
              {
                value: 120,
                label: "120分鐘",
              },
            ]}
            width="xs"
            name="cookingTime"
            label="烹煮時間"
            initialValue=""
          />
        </ProForm.Group>
        <ProFormRadio.Group
          label="類別"
          name="category"
          initialValue="飲品"
          options={[
            "主餐",
            "肉類",
            "蔬菜類",
            "蛋、豆類",
            "海鮮",
            "烘焙類",
            "其他類",
            "飲品",
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
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[
                        {
                          type: "number",
                          /*transform: (value) =>
                              value ? Number(value) : undefined,*/
                          message: "請輸入有效的數字",
                        },
                        {
                          required: true,
                          message: "請輸入數量",
                        },
                      ]}
                      normalize={(value) => (value ? Number(value) : undefined)}
                    >
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
                      <TextArea rows={6} placeholder="步驟說明" />
                    </Form.Item>
                    {/* <Form.Item
                      label="上傳圖片"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      {...restField}
                      name={[name, "stepPhote"]}
                    >
                      <Upload listType="picture-card">
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      </Upload>
                    </Form.Item> */}

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
        <ProFormTextArea width="lg" name="note" label="備註" />
      </ModalForm>
    </Wrapper>
  );
};
export default RecipeForm;
