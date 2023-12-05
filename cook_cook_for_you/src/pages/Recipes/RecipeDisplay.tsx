import styled from "styled-components";

import { MoreOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Button, Drawer, Space } from "antd";
import "firebase/database";
import {
  Timestamp,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firbase";

const Wrapper = styled.div`
  margin: 40px;
  padding: 20px;
  border-radius: 20px;
`;

interface Recipe {
  category: string;
  cookingTime: number;
  description: string;
  name: string;
  note: string;
  searving: number;
  ingredients: {
    qty: number;
    name: string;
    unit: string;
  }[];
  steps: {
    stepDescription: string;
    stepPhoto: string;
  }[];
  mainPhoto: string;
  userId: string;
  time: Timestamp;
  recipeId: string;
}

interface CurrentItem {
  name: string;
  mainPhoto: string;
  searving: number;
  description: string;
  ingredients?: Ingredient[];
  steps?: Step[];
  note: string;
}

interface Ingredient {
  name: string;
  qty: number;
  unit: string;
}

interface Step {
  stepDescription: string;
  stepPhoto: string;
}

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
  //D
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
                mask
                maskClosable
                extra={
                  <Space>
                    <Button onClick={onClose}>編輯</Button>
                    <Button type="primary" onClick={onClose}>
                      OK
                    </Button>
                  </Space>
                }
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
                  </>
                )}
              </Drawer>
            </ProCard>
          ))
        ) : (
          <div>建立你的第一份食譜吧</div>
        )}

        <ProCard style={{ maxWidth: 300 }} hoverable bordered>
          未完待續
        </ProCard>
      </div>
    </Wrapper>
  );
};
export default RecipeDisplay;
