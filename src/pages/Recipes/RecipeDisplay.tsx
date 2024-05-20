import { ClockCircleOutlined, EditOutlined } from "@ant-design/icons";
import { ModalForm } from "@ant-design/pro-components";
import { Button, Space, message } from "antd";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
  fetchAndsubscribeToRecipes,
  updateRecipeInFirebase,
} from "../../services/firebase";
import { CurrentItem, Recipe } from "../../types";
import RecipeDrawer from "./RecipeDrawer";
import RecipeModalContent from "./RecipeModalContent";
import {
  CardContent,
  CardWrapper,
  ContainerText,
  ImageContainer,
  LoadingSpinner,
  RecipeButton,
  RecipeCard,
  TextContainer,
  TextLine,
  Title,
  TitleWrapper,
} from "./recipeDisplay.style";

const RecipeDisplay: React.FC = () => {
  const userInformation = useContext(AuthContext);
  const currentUserUid = userInformation?.user?.uid;
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<CurrentItem>();
  const [loading, setLoading] = useState(true);
  const [mainPhoto, setMainPhoto] = useState("");

  const showDrawer = (item: CurrentItem) => {
    setOpen(true);
    setCurrentItem(item);
  };

  const showModal = (item: CurrentItem) => {
    setCurrentItem(item);
    setMainPhoto(item.mainPhoto);
  };

  useEffect(() => {
    const unsubscribe = fetchAndsubscribeToRecipes(
      "recipess",
      "userId",
      currentUserUid,
      (results) => setUserRecipes(results),
      (error) => message.error(`發生錯誤: ${error.message}`),
      setLoading
    );

    return () => unsubscribe();
  }, [currentUserUid]);

  const updateRecipe = async (item: CurrentItem, values: Recipe) => {
    try {
      const result = await updateRecipeInFirebase(
        item.id,
        values,
        mainPhoto,
        currentUserUid
      );
      if (result) {
        setMainPhoto(item.mainPhoto);
        message.success("新增成功");
      }
    } catch (error) {
      message.error("新增失敗");
    }
  };

  return (
    <div>
      {loading && (
        <LoadingSpinner src="https://firebasestorage.googleapis.com/v0/b/cook-cook-for-you-test.appspot.com/o/loadingImg.gif?alt=media&token=2a7b0ccb-b90a-4caa-b8cc-ba0fe5f1bdcd" />
      )}
      <CardContent>
        {userRecipes.length > 0 ? (
          userRecipes?.map((item) => {
            return (
              <CardWrapper>
                <RecipeCard key={item.recipeId} hoverable bordered>
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
                              onClick={() => showModal(item)}
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
                          onFinish={async (values) => {
                            await updateRecipe(item, values);
                            return true;
                          }}
                          submitter={{
                            searchConfig: {
                              submitText: "編輯完成",
                            },
                          }}
                        >
                          <RecipeModalContent
                            currentItem={currentItem}
                            setMainPhoto={setMainPhoto}
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
                </RecipeCard>
              </CardWrapper>
            );
          })
        ) : (
          <></>
        )}
        <RecipeDrawer currentItem={currentItem} setOpen={setOpen} open={open} />
      </CardContent>
    </div>
  );
};
export default RecipeDisplay;
