import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Button, Form, Input, Upload, message } from "antd";
import type { RcFile } from "antd/es/upload";
import "firebase/database";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../services/firebase";
import { FileListObject, RecipeModalPrps } from "../../types";
import { SpaceStyle } from "./recipeDisplay.style";

const cookingTimeOption = [5, 10, 15, 20, 25, 30, 45, 60, 90, 120].map(
  (minutes) => ({
    value: minutes,
    label: `${minutes}分鐘`,
  })
);

const RecipeModalContent = ({ currentItem, setMainPhoto }: RecipeModalPrps) => {
  const normFile = (e: string[] | FileListObject) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };

  const handleUpload = async (file: RcFile) => {
    try {
      const imageRef = ref(storage, `images/${file.name + file.uid}.jpg`);
      const snapshot = await uploadBytes(imageRef, file);

      const downloadURL = await getDownloadURL(snapshot.ref);
      setMainPhoto(downloadURL);
    } catch {
      message.error("新增照片失敗");
    }
  };

  const category = [
    "主餐",
    "肉類",
    "蔬菜類",
    "蛋、豆類",
    "海鮮",
    "烘焙類",
    "其他類",
  ];

  return (
    <div>
      <ProForm.Group>
        <ProFormText width="md" name="name" label="食譜名稱" />
        <ProFormTextArea width="lg" name="description" label="簡介料理" />
      </ProForm.Group>
      <ProForm.Group>
        <Form.Item
          label="上傳圖片"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          name="mainPhoto"
        >
          <Upload
            customRequest={({ file, onSuccess }) => {
              if (file) {
                handleUpload(file as RcFile)
                  .then(() => onSuccess?.(true))
                  .catch((error) => {
                    message.error("上傳失敗", error);
                  });
              } else {
                message.error("File is undefined");
              }
            }}
            listType="picture-card"
            accept="image/png, image/jpeg"
            maxCount={1}
            defaultFileList={
              typeof currentItem?.mainPhoto === "string"
                ? [
                    {
                      uid: "1",
                      name: "mainPhoto.jpg",
                      status: "done",
                      url: currentItem?.mainPhoto,
                    },
                  ]
                : []
            }
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
      <ProFormRadio.Group label="類別" name="category" options={category} />
      <ProForm.Group>
        <Form.List name="ingredients">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <SpaceStyle key={`${key}-${name}`} align="baseline">
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
                </SpaceStyle>
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
                <SpaceStyle key={`${key}-${name}`} align="center">
                  <Form.Item
                    label="說明"
                    {...restField}
                    name={[name, "stepDescription"]}
                  >
                    <ProFormTextArea width="lg" placeholder="步驟說明" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </SpaceStyle>
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
      <ProFormTextArea width="lg" name="refLink" label="參考連結" />
      <ProFormTextArea width="lg" name="note" label="備註" />
    </div>
  );
};

export default RecipeModalContent;
