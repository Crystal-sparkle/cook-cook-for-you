import { PlusOutlined } from "@ant-design/icons";
import { ModalForm } from "@ant-design/pro-components";
import { Form, message } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "firebase/database";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { db } from "../../firbase";
import { Recipe } from "../../types";
import RecipeModalContent from "./RecipeModalContent";
import { AddRecipeButton } from "./recipeForm.style";

dayjs.locale("zh-cn");

// interface FileListObject {
//   fileList: UploadFile[];
// }

// const cookingTimeOption = [5, 10, 15, 20, 25, 30, 45, 60, 90, 120].map(
//   (minutes) => ({
//     value: minutes,
//     label: `${minutes}分鐘`,
//   })
// );

const RecipeForm: React.FC = () => {
  const userInformation = useContext(AuthContext);
  const currentUserUid = userInformation?.user?.uid;

  const [mainPhoto, setMainPhoto] = useState("");
  const [currentItem, setCurrentItem] = useState(undefined);
  const [form] = Form.useForm();
  const temprary = () =>{
    setCurrentItem(undefined)
  }
  temprary()

  // const handleUpload = async (file: RcFile) => {
  //   try {
  //     const imageRef = ref(storage, `images/${file.name + file.uid}.jpg`);
  //     const snapshot = await uploadBytes(imageRef, file);

  //     const downloadURL = await getDownloadURL(snapshot.ref);
  //     setMainPhoto(downloadURL);
  //   } catch (error) {
  //     message.error("新增照片失敗");
  //   }
  // };

  const onFinish = async (values: Recipe) => {
    const recipesCollection = collection(db, "recipess");

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

  // const normFile = (e: string[] | FileListObject) => {
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e?.fileList || [];
  // };

  return (
    <div>
      <ModalForm<Recipe>
        title="建立食譜"
        trigger={
          <AddRecipeButton type="primary">
            <PlusOutlined />
            新增食譜
          </AddRecipeButton>
        }
        form={form}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
        }}
        submitTimeout={1000}
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            submitText: "確認",
          },
        }}
      >
        {/* <ProForm.Group>
          <ProFormText
            width="md"
            name="name"
            label="食譜名稱"
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
            name="mainPhoto"
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
                <UploadText>上傳</UploadText>
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
                    key={`${key}-${name}`}
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
                    key={`${key}-${name}`}
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
        <ProFormTextArea width="lg" name="note" label="備註" /> */}
        <RecipeModalContent
          setMainPhoto={setMainPhoto}
          currentItem={currentItem}
        />
      </ModalForm>
    </div>
  );
};
export default RecipeForm;
