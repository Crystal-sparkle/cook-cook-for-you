import { CarryOutOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Button, Card, Drawer, Select, Space, message } from "antd";
import "firebase/database";
import {
  Timestamp,
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
// import { styled } from "styled-components";
import { User } from "firebase/auth";
import styled from "styled-components";
import { db } from "../firbase";

interface PurchaseItem {
  isPurchased: boolean;
  name: string;
  quantity: number;
  responsible: string;
  unit: string;
}

interface PurchasePlan {
  cookingDate: Timestamp;
  items: PurchaseItem[] | [];
  mealsEndDate: Timestamp;
  mealsStartDate: Timestamp;
  test: string;
  userId: string;
}

interface PartnerList {
  name: string | null;
  email: string | null;
}

// styled

const Header = styled.div`
  display: flex;
  justify-content: space-around;

  @media screen and (max-width: 1279px) {
    border-bottom: 1px solid #3f3a3a;
    padding: 10px 0;
  }
`;

const Item = styled.div`
  width: 100px;
  font-size: 16px;
  text-align: center;

  @media screen and (max-width: 1279px) {
  }
`;
const ItemOrder = styled.div`
  width: 70px;
  font-size: 16px;
  text-align: center;
`;

const InputCheck = styled.input`
  margin: 0 3px;
  width: 16px;
  height: 16px;
`;

const TitleContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: nowrap;
  align-items: center;

  border: 2px dashed #33cfe0;
  font-size: 18px;
  line-height: 30px;
  font-weight: bold;
`;

// const currentUser = auth.currentUser;
// console.log(auth);
// console.log(currentUser);
// const currentUid: string = currentUser?.uid ?? "";

interface CookingPlanData {
  cookingDate: Timestamp;
  cookingItems: {
    id: string;
    name: string;
    serving: number;
    unit: string;
  }[];
  isActive: boolean;
  mealsStartDate: Timestamp;
  mealsEndDate: Timestamp;
  planId: string;
  userId: string;
}
interface PurchasePlanProps {
  activeCookingPlan: CookingPlanData | undefined;
  setActiveCookingPlan: (cookingPlanData?: CookingPlanData) => void;
  purchasePlanCollection: PurchasePlan[];
  user: User | null;
}

interface CookingPlanItem {
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  recipeId: string;
  serving: number;
}

const PurchasingPlan = ({
  setActiveCookingPlan,
  activeCookingPlan,
  purchasePlanCollection,
  user,
}: PurchasePlanProps) => {
  const [partnerList, setPartnerList] = useState<PartnerList[]>([]);

  useEffect(() => {
    const getParnerData = async () => {
      const userCollection = collection(db, "user");
      if (user !== null) {
        const q = query(userCollection, where("uid", "==", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.exists()) {
              const data = doc.data();

              if (data.partners) {
                setPartnerList(data.partners);
              }
            }
          });
        });

        return () => unsubscribe();
      }
    };

    getParnerData();
  }, [user]);

  const partners = [
    {
      label: "Crystal",
      key: "1",
    },
    {
      label: partnerList[0]?.name,
      key: "2",
    },
    {
      label: partnerList[1]?.name,
      key: "3",
    },
  ];

  const { Option } = Select;
  const [checkedItems, setCheckedItems] = useState<Array<Array<boolean>>>([]);

  const updateCheckboxStatus = async (
    planIndex: number,
    itemIndex: number,
    isChecked: boolean
  ) => {
    const purchaseCollection = collection(db, "purchasePlan");
    const q = query(purchaseCollection, where("isActive", "==", true));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;

        const docData = (await getDoc(docRef)).data();

        if (docData && docData.items && docData.items[itemIndex]) {
          docData.items[itemIndex].isPurchased = isChecked;

          // console.log(planIndex, itemIndex, isChecked);
          await updateDoc(docRef, {
            items: docData.items,
          });

          message.success(`已採購第${itemIndex + 1}項`);
        }
      });
    } catch (error) {
      message.error("存取失敗");
    }
  };

  const handleCheckboxChange = (planIndex: number, itemIndex: number) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = [...prevCheckedItems];
      newCheckedItems[planIndex] = [...(newCheckedItems[planIndex] || [])];
      newCheckedItems[planIndex][itemIndex] =
        !newCheckedItems[planIndex][itemIndex];
      updateCheckboxStatus(
        planIndex,
        itemIndex,
        newCheckedItems[planIndex][itemIndex]
      );

      return newCheckedItems;
    });
  };

  const handleSelectChange = async (
    value: string,
    // index: number,
    itemIndex: number
  ) => {
    const purchaseCollection = collection(db, "purchasePlan");
    const q = query(purchaseCollection, where("isActive", "==", true));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;

        const docData = (await getDoc(docRef)).data();

        if (docData && docData.items && docData.items[itemIndex]) {
          docData.items[itemIndex].responsible = value;

          await updateDoc(docRef, {
            items: docData.items,
          });

          message.success(`成功更改採買人員：${value}`);
        }
      });
    } catch (error) {
      message.error("修改失敗");
    }
  };

  const [activePlanIngredients, setActivePlanIngredients] = useState<
    CookingPlanItem[]
  >([]);

  useEffect(() => {
    const purchaseMeals = activeCookingPlan?.cookingItems;

    if (Array.isArray(purchaseMeals) && purchaseMeals.length > 0) {
      const getRecipesIngredients = async () => {
        const recipesCollection = collection(db, "recipess");

        try {
          const promises = purchaseMeals.map(async (meal) => {
            const queryRef = query(
              recipesCollection,
              where("id", "==", meal.id)
            );

            try {
              const querySnapshot = await getDocs(queryRef);

              if (!querySnapshot.empty) {
                const ingredients = querySnapshot.docs[0].data().ingredients;
                const serving = meal.serving;

                const newIngredients = {
                  recipeId: meal.id,
                  serving: meal.serving,
                  ingredients: ingredients,
                };

                console.log(
                  `Ingredients for meal ${meal.id} with serving ${serving}:`,
                  ingredients
                );
                return newIngredients;
              } else {
                console.log(`No matching documents found for meal ${meal.id}.`);
                return null;
              }
            } catch (error) {
              console.error(`Error fetching data for meal ${meal.id}:`, error);
              return null;
            }
          });

          const results = await Promise.all(promises);

          const newIngredients = results.filter(
            (result) => result !== null
          ) as CookingPlanItem[];

          setActivePlanIngredients((prevIngredients) => [
            ...prevIngredients,
            ...newIngredients,
          ]);
        } catch (error) {
          console.error("Error processing promises:", error);
        }
      };

      getRecipesIngredients();
    }
  }, [activeCookingPlan]);

  const [purchaseItems, setPurchaseItems] = useState<
    {
      name: string;
      quantity: number;
      unit: string;
      isPurchased: boolean;
      responsible: string;
    }[]
  >([]);

  useEffect(() => {
    const purchaseItemsArray = activePlanIngredients.reduce<
      {
        name: string;
        quantity: number;
        unit: string;
        isPurchased: boolean;
        responsible: string;
      }[]
    >((accumulator, item) => {
      item.ingredients.forEach((ingredient) => {
        const existingIngredient = accumulator.find(
          (accIngredient) =>
            accIngredient.name === ingredient.name &&
            accIngredient.unit === ingredient.unit
        );

        if (existingIngredient) {
          existingIngredient.quantity +=
            Number(ingredient.quantity) * Number(item.serving);
        } else {
          accumulator.push({
            name: ingredient.name,
            quantity: Number(ingredient.quantity) * Number(item.serving),
            unit: ingredient.unit,
            isPurchased: false,
            responsible: "",
          });
        }
      });
      return accumulator;
    }, []);

    setPurchaseItems(purchaseItemsArray);
  }, [activePlanIngredients]);

  useEffect(() => {
    const addPurchaseItems = async () => {
      const PurchasePlanCollection = collection(db, "purchasePlan");
      const q = query(PurchasePlanCollection, where("isActive", "==", true));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const docRef = doc.ref;

          await updateDoc(docRef, {
            items: purchaseItems,
          });
        });
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    };

    addPurchaseItems();
  }, [purchaseItems]);

  const handleClick = () => {
    const closePurchasePlan = async () => {
      const PurchasePlanCollection = collection(db, "purchasePlan");
      const q = query(PurchasePlanCollection, where("isActive", "==", true));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const docRef = doc.ref;

          await updateDoc(docRef, {
            isActive: false,
          });
        });
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    };
    const closeCookingSchedule = async () => {
      const CookingPlanCollection = collection(db, "cookingPlan");
      const q = query(CookingPlanCollection, where("isActive", "==", true));

      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const docRef = doc.ref;

          await updateDoc(docRef, {
            isActive: false,
          });
        });
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    };
    closeCookingSchedule();
    closePurchasePlan();
    setActiveCookingPlan();

    message.info("再開啟下一個烹煮計畫吧");
  };

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const dateForCooking = activeCookingPlan?.cookingDate
    ?.toDate()
    .toLocaleDateString("zh-TW");

  if (activeCookingPlan === undefined) {
    return <div>請先建立烹煮計畫</div>;
  }

  return (
    <div
      style={{
        width: " 100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0, auto",
        justifyContent: "space-around",
      }}
    >
      <Card>
        <div>
          <ProCard>
            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "12px",
                }}
              >
                烹煮日期：{dateForCooking}
              </div>

              {activeCookingPlan?.cookingItems.map((plan, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "5px",
                    fontSize: "16px",
                  }}
                >
                  <div style={{ marginRight: "4px" }}>
                    {index + 1}. {plan.name}
                  </div>
                  <div>
                    {plan.serving} {plan.unit}
                  </div>
                </div>
              ))}
            </div>
          </ProCard>
        </div>
        <div>
          <Button
            type="primary"
            style={{
              // backgroundColor: "#e9c148",
              width: "100%",
              fontSize: "18px",
              height: "40px",
            }}
            onClick={showDrawer}
            icon={<CarryOutOutlined />}
            block
          >
            購買清單
          </Button>
          <Drawer
            title="購買清單"
            width={700}
            onClose={onClose}
            open={open}
            styles={{
              body: {
                paddingBottom: 70,
              },
            }}
            extra={
              <Space>
                <Button
                  // style={{ backgroundColor: "#b7dbdf", color: "#4b4947" }}
                  onClick={onClose}
                >
                  Close
                </Button>
                {purchasePlanCollection.length > 0 ? (
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#FFE57A",
                      color: "#4b4947",
                    }}
                    onClick={handleClick}
                  >
                    完成計畫
                  </Button>
                ) : (
                  <div></div>
                )}
              </Space>
            }
          >
            {purchasePlanCollection.length > 0 ? (
              purchasePlanCollection.map((item, index) => (
                <div key={index} style={{ padding: "10px,20px" }}>
                  <TitleContainer>
                    <div style={{ fontSize: 18 }}>
                      烹煮計畫日期：
                      {item?.cookingDate?.toDate().toLocaleDateString()}
                    </div>
                    <div>共計 {item?.items?.length} 個</div>
                  </TitleContainer>
                  <Header>
                    <Item></Item>
                    <ItemOrder>項目</ItemOrder>
                    <Item>名稱</Item>
                    <Item>數量</Item>

                    <Item>負責人</Item>
                  </Header>

                  {item?.items?.map((purchaseItem, itemIndex) => (
                    <div key={itemIndex}>
                      <div
                        style={{
                          marginTop: 10,
                          marginBottom: 10,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-around",
                        }}
                      >
                        <Item>
                          <InputCheck
                            type="checkbox"
                            checked={
                              checkedItems[index]?.[itemIndex] ||
                              purchaseItem.isPurchased
                            }
                            onChange={() =>
                              handleCheckboxChange(index, itemIndex)
                            }
                          />
                        </Item>
                        <ItemOrder>{itemIndex + 1}</ItemOrder>
                        <Item>{purchaseItem.name}</Item>
                        <Item>
                          {purchaseItem.quantity}
                          {purchaseItem.unit}
                        </Item>
                        <Item>
                          <Select
                            defaultValue={purchaseItem.responsible}
                            style={{ width: 100 }}
                            onChange={(value) =>
                              handleSelectChange(value, itemIndex)
                            }
                          >
                            {partners?.map((partner) => (
                              <Option key={partner.key} value={partner.label}>
                                {partner.label}
                              </Option>
                            ))}
                          </Select>
                        </Item>
                      </div>
                      <hr />
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div>請先建立烹煮計畫唷</div>
            )}
            <br />
          </Drawer>
        </div>
      </Card>
    </div>
  );
};

export default PurchasingPlan;
