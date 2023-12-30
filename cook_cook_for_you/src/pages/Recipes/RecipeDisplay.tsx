import {
  ClockCircleOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  PushpinOutlined,
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
import {
  Button,
  Drawer,
  Form,
  Input,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
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
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { db, storage } from "../../firbase";
import { CurrentItem, Recipe } from "../../types";
import {
  CardContent,
  CardWrapper,
  Description,
  DescriptionText,
  Detail,
  ImageContainer,
  ImageDisplay,
  IngredientsContainer,
  IngredientsItem,
  IngredientsOrder,
  IngredientsWrapper,
  LinkContainer,
  LoadingSpinner,
  StepsContainer,
  StepsTag,
  TextContainer,
  TextLine,
  Tips,
  TipsContainer,
  TipsTitle,
  TitleContent,
} from "../Recipes/recipes.style";
const { Title } = Typography;
const { TextArea } = Input;
interface FileListObject {
  fileList: any[]; // Adjust the type of fileList according to your needs
}

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
  const userInformation = useContext(AuthContext);
  const currentUserUid = userInformation?.user?.uid;
  const [userRecipe, setUserRecipe] = useState<Recipe[]>([]);

  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<CurrentItem>();
  const [loading, setLoading] = useState(true);

  const showDrawer = (item: CurrentItem) => {
    setOpen(true);
    setCurrentItem(item);
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
        where("userId", "==", currentUserUid)
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
          setLoading(false);
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

  const [mainPhoto, setMainPhoto] = useState("");
  const handleUpload = async (file: RcFile) => {
    console.log(file);
    try {
      const imageRef = ref(storage, `images/${file.name + file.uid}.jpg`);

      const snapshot = await uploadBytes(imageRef, file);

      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Image uploaded:", downloadURL);

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
      const valuesWithImageURL = {
        ...values,
        mainPhoto: mainPhoto,
        userId: currentUserUid,
        time: Timestamp.now(),
      };
      console.log(valuesWithImageURL);
      const docRef = await addDoc(recipesCollection, valuesWithImageURL);

      const updatedData = { id: docRef.id };
      await setDoc(doc(recipesCollection, docRef.id), updatedData, {
        merge: true,
      });

      console.log("Document written successfully!", docRef.id);

      setMainPhoto("");
      message.success("成功新增");
      return true;
    } catch (error) {
      message.error("新增失败");
    }
  };

  const normFile = (e: any[] | FileListObject): any[] => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };

  return (
    <div>
      {loading && (
        <LoadingSpinner src="https://firebasestorage.googleapis.com/v0/b/cook-cook-for-you-test.appspot.com/o/loadingImg.gif?alt=media&token=2a7b0ccb-b90a-4caa-b8cc-ba0fe5f1bdcd" />
      )}
      <CardContent>
        {userRecipe.length > 0 ? (
          userRecipe?.map((item) => (
            <CardWrapper>
              <ProCard
                key={item.recipeId}
                style={{ maxWidth: "340px", minHeight: "390px" }}
                hoverable
                bordered
              >
                <>
                  <ImageContainer>
                    <img src={item.mainPhoto} alt="主要照片" />
                  </ImageContainer>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TitleContent>
                      <Title level={4}>{item.name}</Title>
                    </TitleContent>
                    <div>
                      <ModalForm<Recipe>
                        title="編輯食譜"
                        trigger={
                          <Button
                            style={{ margin: 5 }}
                            type="text"
                            icon={<EditOutlined />}
                          ></Button>
                        }
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
                          <ProFormText
                            width="md"
                            name="name"
                            label="食譜名稱"
                          />

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
                                      console.error(
                                        "Custom upload error:",
                                        error
                                      );
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
                                    <Form.Item
                                      {...restField}
                                      name={[name, "name"]}
                                    >
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
                                    <Form.Item
                                      {...restField}
                                      name={[name, "unit"]}
                                    >
                                      <Input placeholder="單位" />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                      onClick={() => remove(name)}
                                    />
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
                                      <TextArea
                                        rows={4}
                                        placeholder="步驟說明"
                                      />
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
                                          <div style={{ marginTop: 8 }}>
                                            Upload
                                          </div>
                                        </div>
                                      </Upload>
                                    </Form.Item>

                                    <MinusCircleOutlined
                                      onClick={() => remove(name)}
                                    />
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
                        <ProFormText
                          width="lg"
                          name="refLink"
                          label="參考連結"
                        />
                        <ProFormTextArea width="lg" name="note" label="備註" />
                      </ModalForm>
                    </div>
                  </div>
                  <TextContainer>
                    <div>
                      <TextLine>
                        <ClockCircleOutlined /> {item.cookingTime}分
                      </TextLine>
                    </div>
                    <div>
                      <TextLine>{item.category}</TextLine>
                    </div>
                  </TextContainer>

                  <div style={{ margin: 5 }}>
                    <Button type="primary" onClick={() => showDrawer(item)}>
                      查看食譜
                    </Button>
                  </div>
                  <Space />
                  <Drawer
                    title="食譜"
                    width={700}
                    onClose={onClose}
                    open={open}
                    maskStyle={{ backgroundColor: "rgba(0,0,0,.06)" }}
                    maskClosable={true}
                    contentWrapperStyle={{ boxShadow: "none" }}
                  >
                    {currentItem && (
                      <>
                        <Title level={3}>{currentItem.name}</Title>
                        <ImageDisplay>
                          <img
                            src={currentItem.mainPhoto}
                            alt={currentItem.name}
                          />
                        </ImageDisplay>
                        <Detail>
                          <div>份量：{currentItem.searving}人份</div>
                          <div>分類：{currentItem.category}</div>
                          <div>烹煮時間：{currentItem.cookingTime}</div>
                        </Detail>
                        <DescriptionText>簡介</DescriptionText>
                        <Description>{currentItem.description}</Description>

                        <hr />
                        <h3>食材</h3>
                        <IngredientsWrapper>
                          {currentItem?.ingredients?.map(
                            (ingredient, index) => (
                              <IngredientsContainer key={index}>
                                <IngredientsOrder>
                                  {index + 1}.
                                </IngredientsOrder>
                                <IngredientsItem>
                                  {ingredient.name}
                                </IngredientsItem>
                                <br />
                                <IngredientsItem>
                                  {ingredient.quantity}
                                  {ingredient.unit}
                                </IngredientsItem>
                              </IngredientsContainer>
                            )
                          )}
                        </IngredientsWrapper>
                        <hr />
                        <h3>步驟</h3>
                        {currentItem?.steps?.map((step, index) => (
                          <StepsContainer key={index}>
                            <StepsTag>第{index + 1}步：</StepsTag>
                            <div>{step?.stepDescription}</div>
                            <hr />
                          </StepsContainer>
                        ))}

                        <TipsContainer>
                          <TipsTitle>
                            <div>
                              <PushpinOutlined />
                            </div>

                            <div>
                              <Tips> Tips :</Tips>
                            </div>
                          </TipsTitle>
                          <div>{currentItem.note}</div>
                        </TipsContainer>
                        <div>
                          <LinkContainer>
                            <Link to={currentItem.refLink} target="_blank">
                              參考食譜連結
                            </Link>
                          </LinkContainer>
                        </div>
                      </>
                    )}
                  </Drawer>
                </>
              </ProCard>
            </CardWrapper>
          ))
        ) : (
          <div></div>
        )}
      </CardContent>
    </div>
  );
};
export default RecipeDisplay;
