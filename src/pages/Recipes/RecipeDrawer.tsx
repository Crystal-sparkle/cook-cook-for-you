import { PushpinOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import "firebase/database";
import { Link } from "react-router-dom";
import {
  Description,
  DescriptionText,
  Detail,
  ImageDisplay,
  IngredientsContainer,
  IngredientsItem,
  IngredientsOrder,
  IngredientsWrapper,
  LinkContainer,
  StepsContainer,
  StepsTag,
  Tips,
  TipsContainer,
  TipsTitle,
  Title,
} from "./recipeDisplay.style";

import { RecipeDawerPrps } from "../../types";

const RecipeDrawer = ({ currentItem, setOpen, open }: RecipeDawerPrps) => {
  const onClose = () => {
    setOpen(false);
  };

  return (
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
            <img src={currentItem.mainPhoto} alt={currentItem.name} />
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
            {currentItem?.ingredients?.map((ingredient, index) => (
              <IngredientsContainer key={`${index}-${ingredient}`}>
                <IngredientsOrder>{index + 1}.</IngredientsOrder>
                <IngredientsItem>{ingredient.name}</IngredientsItem>
                <br />
                <IngredientsItem>
                  {ingredient.quantity}
                  {ingredient.unit}
                </IngredientsItem>
              </IngredientsContainer>
            ))}
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
  );
};

export default RecipeDrawer;
