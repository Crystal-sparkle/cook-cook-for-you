import {
  ClockCircleOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import {
  ModalForm,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Button, Drawer, Form, Input, Space, Upload, message } from "antd";
import type { RcFile, UploadFile } from "antd/es/upload";
import "firebase/database";
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  orderBy,
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
  ContainerText,
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
  RecipeButton,
  RecipeCard,
  StepsContainer,
  StepsTag,
  TextContainer,
  TextLine,
  Tips,
  TipsContainer,
  TipsTitle,
  Title,
  TitleWrapper,
} from "./recipeDisplay.style";

interface FileListObject {
  fileList: UploadFile[];
}

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

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

  useEffect(() => {
    const getRecipes = async () => {
      const recipesCollection = collection(db, "recipess");
      const queryRef = query(
        recipesCollection,
        where("userId", "==", currentUserUid),
        orderBy("time", "desc")
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
        () => {
          message.error("發生錯誤");
        }
      );

      return () => unsubscribe();
    };

    getRecipes();
  }, []);

  const [mainPhoto, setMainPhoto] = useState("");
  const handleUpload = async (file: RcFile) => {
    try {
      const imageRef = ref(storage, `images/${file.name + file.uid}.jpg`);

      const snapshot = await uploadBytes(imageRef, file);

      const downloadURL = await getDownloadURL(snapshot.ref);

      setMainPhoto(downloadURL);
    } catch {
      message.error("Error uploading image");
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
          userRecipe?.map((item) => {
            const UpdatRecipe = async (values: Recipe) => {
              const recipesCollection = collection(db, "recipess");

              await waitTime(1000);
              try {
                const docRef = doc(recipesCollection, item.id);
                const valuesWithImageURL = {
                  ...values,
                  mainPhoto: mainPhoto,
                  userId: currentUserUid,
                  time: Timestamp.now(),
                };

                await setDoc(docRef, valuesWithImageURL);
                const updatedData = { id: docRef.id };
                await setDoc(doc(recipesCollection, docRef.id), updatedData, {
                  merge: true,
                });

                setMainPhoto("");
                message.success("新增成功");
                return true;
              } catch (error) {
                message.error("新增失敗");
              }
            };

            return (
              <CardWrapper>
                <RecipeCard key={item.recipeId} hoverable bordered>
                  <>
                    <ImageContainer>
                      <img src={item.mainPhoto} alt="主要照片" />
                    </ImageContainer>
                    <ContainerText>
                      <TitleWrapper>
                        <div>
                          <Title>{item.name}</Title>
                        </div>
                        <div>
                          <ModalForm<Recipe>
                            title="編輯食譜"
                            trigger={
                              <Button
                                style={{ margin: 5 }}
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => setMainPhoto(item.mainPhoto)}
                              ></Button>
                            }
                            initialValues={{
                              name: item.name,
                              description: item.description,
                              cookingTime: item.cookingTime,
                              ingredients: item.ingredients,
                              steps: item.steps,
                              category: item.category,
                              refLink: item.refLink,
                              note: item.note,
                            }}
                            autoFocusFirstInput
                            modalProps={{
                              destroyOnClose: true,
                            }}
                            submitTimeout={1000}
                            onFinish={UpdatRecipe}
                            submitter={{
                              searchConfig: {
                                submitText: "編輯完成",
                              },
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
                                  customRequest={({
                                    file,
                                    onSuccess,
                                    onError,
                                  }) => {
                                    if (file) {
                                      handleUpload(file as RcFile)
                                        .then(() => onSuccess?.(true))
                                        .catch((error) => {
                                          message.error("上傳失敗", error);
                                          onError?.(error);
                                        });
                                    } else {
                                      message.error("File is undefined");
                                      onError?.(new Error("File is undefined"));
                                    }
                                  }}
                                  listType="picture-card"
                                  accept="image/png, image/jpeg"
                                  maxCount={1}
                                  defaultFileList={[
                                    {
                                      uid: "1",
                                      name: "mainPhoto.jpg",
                                      status: "done",
                                      url: item.mainPhoto,
                                    },
                                  ]}
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
                              ]}
                            />
                            <ProForm.Group>
                              <Form.List name="ingredients">
                                {(fields, { add, remove }) => (
                                  <>
                                    {fields.map(
                                      ({ key, name, ...restField }) => (
                                        <Space
                                          key={`${key}-${name}`}
                                          style={{
                                            display: "flex",
                                            marginBottom: 8,
                                          }}
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
                                            <Input
                                              type="number"
                                              placeholder="數量"
                                            />
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
                                      )
                                    )}
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
                                    {fields.map(
                                      ({ key, name, ...restField }) => (
                                        <Space
                                          key={`${key}-${name}`}
                                          style={{
                                            display: "flex",
                                            marginBottom: 8,
                                          }}
                                          align="center"
                                        >
                                          <Form.Item
                                            label="說明"
                                            {...restField}
                                            name={[name, "stepDescription"]}
                                          >
                                            <ProFormTextArea
                                              width="lg"
                                              placeholder="步驟說明"
                                            />
                                          </Form.Item>
                                          <MinusCircleOutlined
                                            onClick={() => remove(name)}
                                          />
                                        </Space>
                                      )
                                    )}
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
                            <ProFormTextArea
                              width="lg"
                              name="refLink"
                              label="參考連結"
                            />
                            <ProFormTextArea
                              width="lg"
                              name="note"
                              label="備註"
                            />
                          </ModalForm>
                        </div>
                      </TitleWrapper>
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

                      <div>
                        <RecipeButton
                          type="primary"
                          onClick={() => showDrawer(item)}
                        >
                          查看食譜
                        </RecipeButton>
                      </div>
                    </ContainerText>
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
                          <Title>{currentItem.name}</Title>
                          <ImageDisplay>
                            <img
                              src={currentItem.mainPhoto}
                              alt={currentItem.name}
                            />
                          </ImageDisplay>
                          <Detail>
                            <div>份量：{currentItem.serving}人份</div>
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
                                <IngredientsContainer
                                  key={`${index}-${ingredient}`}
                                >
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
                            <StepsContainer key={`${index}-${step}`}>
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
                </RecipeCard>
              </CardWrapper>
            );
          })
        ) : (
          <></>
        )}
      </CardContent>
    </div>
  );
};
export default RecipeDisplay;
