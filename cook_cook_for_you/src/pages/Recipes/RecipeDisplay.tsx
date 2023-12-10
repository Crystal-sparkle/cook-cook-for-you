import styled from "styled-components";

import {
  MinusCircleOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  ModalForm,
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Button, Drawer, Form, Input, Space, Upload, message } from "antd";
import "firebase/database";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { db, storage } from "../../firbase";
import { CurrentItem, Recipe } from "../../types";
const { TextArea } = Input;

const Wrapper = styled.div`
  margin: 40px;
  padding: 20px;
  border-radius: 20px;
`;
interface RcFile extends File {
  uid: string;
}
//
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const RecipeDisplay: React.FC = () => {
  const [userRecipe, setUserRecipe] = useState<Recipe[]>([]);
  //D
  const [open, setOpen] = useState(false);
  // const [placement, setPlacement] = useState<DrawerProps["placement"]>("right");
  const [currentItem, setCurrentItem] = useState<CurrentItem>();
  const showDrawer = (item: CurrentItem) => {
    setCurrentItem(item);
    console.log(item);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  console.log(currentItem);

  useEffect(() => {
    const getRecipes = async () => {
      const recipesCollection = collection(db, "recipess");
      const queryRef = query(
        recipesCollection,
        where("userId", "==", "crystal")
      );

      const unsubscribe = onSnapshot(
        queryRef,
        (querySnapshot) => {
          const results: Recipe[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();

            results.push(data as Recipe);
          });
          setUserRecipe(results);
        },
        (error) => {
          console.error("取得資料時發生錯誤:", error);
        }
      );

      return () => unsubscribe();
    };

    getRecipes();
  }, []);

  console.log(userRecipe);
  //這是要放編輯的表格互動方式

  //圖片的上傳func
  const [mainPhoto, setMainPhoto] = useState("");
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
  const [modalVisit, setModalVisit] = useState(false);
  //這是要放編輯的表格互動方式

  return (
    <Wrapper>
      <div>
        <h2>食譜列表</h2>
        {userRecipe.length > 0 ? (
          userRecipe?.map((item) => (
            <ProCard
              key={item.recipeId}
              style={{ maxWidth: 300 }}
              hoverable
              bordered
            >
              <img src={item.mainPhoto} alt="主要照片" style={{ width: 200 }} />
              <p>{item.name}</p>
              <p>烹煮時間：{item.cookingTime}分鐘</p>
              <p>類別：{item.category}</p>

              <Button
                type="primary"
                icon={<MoreOutlined />}
                onClick={() => showDrawer(item)}
              >
                See more
              </Button>

              <Drawer
                placement="right"
                title="食譜"
                width={500}
                onClose={onClose}
                open={open}
                forceRender={true}
                mask={false}
                maskClosable={true}
              >
                {currentItem && (
                  <>
                    <h3>{currentItem.name}</h3>
                    <img
                      src={currentItem.mainPhoto}
                      alt={currentItem.name}
                      style={{ width: 200 }}
                    />
                    <p>份量：{currentItem.searving}人份</p>
                    <p>簡介：{currentItem.description}</p>
                    <p>分類：{currentItem.category}</p>

                    <hr />
                    <h3>食材</h3>
                    {currentItem?.ingredients?.map((ingredient, index) => (
                      <div key={index}>
                        <h4>品項{index + 1}</h4>
                        <span>{ingredient.name}</span>
                        <br />
                        <span>{ingredient.qty}</span>
                        <span>{ingredient.unit}</span>
                      </div>
                    ))}
                    <hr />
                    <h3>步驟</h3>
                    {currentItem?.steps?.map((step, index) => (
                      <div key={index}>
                        <h4>第{index + 1}步：</h4>
                        <p>{step?.stepDescription}</p>
                        <span>還沒做好的照片</span>
                      </div>
                    ))}
                    <hr />
                    <p>備註：{currentItem.note}</p>
                    <p>參考網址：{currentItem.refLink}</p>
                  </>
                )}
              </Drawer>

              <ModalForm<Recipe>
                title="編輯食譜"
                trigger={<Button type="primary">編輯食譜</Button>}
                form={form}
                initialValues={{
                  name: item.name,
                  description: item.description,
                  searving: item.searving,
                  cookingTime: item.cookingTime,
                  category: item.category,
                  refLink: item.refLink,
                  note: item.note,
                }}
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
                  <ProFormText width="md" name="name" label="食譜名稱" />

                  <ProFormTextArea
                    width="lg"
                    name="description"
                    label="簡介料理"
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <Form.Item
                    label="上傳圖片"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    name="mainPhoto"
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
                              normalize={(value) =>
                                value ? Number(value) : undefined
                              }
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
                              <TextArea rows={4} placeholder="步驟說明" />
                            </Form.Item>
                            <Form.Item
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
            </ProCard>
          ))
        ) : (
          <div>建立你的第一份食譜吧</div>
        )}
      </div>
    </Wrapper>
  );
};
export default RecipeDisplay;
