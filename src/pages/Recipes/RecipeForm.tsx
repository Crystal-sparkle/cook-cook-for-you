import { PlusOutlined } from "@ant-design/icons";
import { ModalForm } from "@ant-design/pro-components";
import { Form, message } from "antd";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { db } from "../../services/firebase";
import { Recipe } from "../../types";
import RecipeModalContent from "./RecipeModalContent";
import { AddRecipeButton } from "./recipeForm.style";

const RecipeForm: React.FC = () => {
  const userInformation = useContext(AuthContext);
  const currentUserUid = userInformation?.user?.uid;

  const [mainPhoto, setMainPhoto] = useState("");
  const [currentItem] = useState(undefined);
  const [form] = Form.useForm();

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
        <RecipeModalContent
          setMainPhoto={setMainPhoto}
          currentItem={currentItem}
        />
      </ModalForm>
    </div>
  );
};
export default RecipeForm;
