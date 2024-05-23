import { PlusOutlined } from "@ant-design/icons";
import { ModalForm } from "@ant-design/pro-components";
import { Form, message } from "antd";
import { Timestamp } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { addPlanAndIdToFirestore_Form } from "../../services/firebase";
import { Recipe } from "../../types";
import RecipeModalContent from "./RecipeModalContent";
import { AddRecipeButton } from "./recipeForm.style";

const RecipeForm: React.FC = () => {
  const userInformation = useContext(AuthContext);
  const currentUserUid = userInformation?.user?.uid;

  const [mainPhoto, setMainPhoto] = useState("");
  const [currentItem] = useState(undefined);
  const [form] = Form.useForm();

  const addRecipeInFirebase = async (values: Recipe) => {
    const updatedValues = {
      ...values,
      mainPhoto: mainPhoto,
      userId: currentUserUid,
      time: Timestamp.now(),
    };

    await addPlanAndIdToFirestore_Form(updatedValues, "recipess");
    message.success("提交成功");
    setMainPhoto("");
    return true;
  };

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
        onFinish={addRecipeInFirebase}
        submitter={{
          searchConfig: {
            submitText: "確認",
          },
        }}
      >
        <RecipeModalContent
          setMainPhoto={setMainPhoto}
          currentItem={currentItem}
        />
      </ModalForm>
    </div>
  );
};
export default RecipeForm;
