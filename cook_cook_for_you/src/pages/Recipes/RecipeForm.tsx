import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

import { Button, Form, Input, Space, Upload, message } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "firebase/database";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React from "react";
import styled from "styled-components";
import { db, storage } from "../../firbase";
import { Recipe } from "../../types";
const { TextArea } = Input;
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

const cookingTimeOption = [
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
];

const RecipeForm: React.FC = () => {
  const userInformation = useContext(AuthContext);
  const currentUserUid = userInformation?.user?.uid;

  const handleUpload = async (file: RcFile) => {
    try {
      // const storageRef = ref(storage);
      const imageRef = ref(storage, `images/${file.name + file.uid}.jpg`);
      const snapshot = await uploadBytes(imageRef, file);

      const downloadURL = await getDownloadURL(snapshot.ref);
      setMainPhoto(downloadURL);
    } catch (error) {
      message.error("新增照片失敗");
    }
  };

  const [mainPhoto, setMainPhoto] = useState("");
  const [form] = Form.useForm();

  const onFinish = async (values: Recipe) => {
    const recipesCollection = collection(db, "recipess");
    await waitTime(2000);
    try {
      const valuesWithImageURL = {
        ...values,
        mainPhoto: mainPhoto,
        userId: currentUserUid,
        time: Timestamp.now(),
      };

      const docRef = await addDoc(recipesCollection, valuesWithImageURL);

      const updatedData = { id: docRef.id };
      await setDoc(doc(recipesCollection, docRef.id), updatedData, {
        merge: true,
      });

      setMainPhoto("");
      message.success("成功新增");
      return true;
    } catch (error) {
      message.error("新增失败");
    }
  };

  interface FileListObject {
    fileList: any[];
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
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
        }}
        submitTimeout={2000}
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            submitText: "確認",
          },
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="name"
            label="食譜名稱"
            tooltip="最長為 24 位"
            placeholder="食譜名稱"
          />

          <ProFormTextArea
            width="lg"
            name="description"
            label="簡介料理"
            placeholder="料理簡介"
          />
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
                      message.error("Custom upload error");
                      onError?.(error);
                    });
                } else {
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
            options={[
              {
                value: 1,
                label: "1",
              },
            ]}
            width="xs"
            name="serving"
            label="烹煮份量"
            initialValue={1}
            fieldProps={{
              disabled: true,
            }}
          />
          <ProFormSelect
            options={cookingTimeOption}
            width="xs"
            name="cookingTime"
            label="烹煮時間"
          />
        </ProForm.Group>
        <ProFormRadio.Group
          label="類別"
          name="category"
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
