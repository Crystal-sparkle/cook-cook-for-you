import { Select, message } from "antd";
import "firebase/database";
import {
  collection,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FC, useContext, useState } from "react";

import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { db } from "../../firbase";
import { PartnerList, PurchasePlan, ShoppingListProps } from "../../types";
import useGetPartnerList from "./PurchasingPlan/Shopping/hooks/useGetPartnerList";
import {
  Header,
  InputCheck,
  Item,
  ItemOrder,
  ShoppingItems,
  ShoppingListTitle,
  TitleContainer,
  Wrapper,
} from "./ShoppingList.style";

const { Option } = Select;

const ShoppingList: FC<ShoppingListProps> = ({ purchasePlan, index }) => {
  const params = useParams();
  const userIdFromURL = params.userId;
  const userInformation = useContext(AuthContext);
  const currentUserUid = userInformation?.user?.uid;
  const userId = userIdFromURL || currentUserUid;

  const partners: PartnerList[] = useGetPartnerList(userId);

  const { cookingDate, items } = purchasePlan;
  const [checkedItems, setCheckedItems] = useState<Array<Array<boolean>>>([]);
  async function updateCollectionItems(
    collectionName: string,
    itemIndex: number,
    updateFunction: (docData: PurchasePlan) => void
  ) {
    const purchaseCollection = collection(db, collectionName);
    const q = query(purchaseCollection, where("isActive", "==", true));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
        const docData = (await getDoc(docRef)).data();
        console.log(docData);

        if (docData && docData.items && docData.items[itemIndex]) {
          updateFunction(docData as PurchasePlan);
          await updateDoc(docRef, {
            items: docData.items,
          });
        }
      });
    } catch (error) {
      message.error("操作失敗");
    }
  }

  const updateCheckboxStatus = async (
    planIndex: number,
    itemIndex: number,
    isChecked: boolean
  ) => {
    updateCollectionItems("purchasePlan", itemIndex, (docData) => {
      docData.items[itemIndex].isPurchased = isChecked;
    }).catch(() => {
      message.error("存取失敗", planIndex);
    });
  };

  const handleSelectChange = async (value: string, itemIndex: number) => {
    updateCollectionItems("purchasePlan", itemIndex, (docData) => {
      docData.items[itemIndex].responsible = value;
    })
      .then(() => {
        message.success(`成功更改採買人員：${value}`);
      })
      .catch(() => {
        message.error("更改失敗");
      });
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


  return (
    <Wrapper>
      <TitleContainer>
        <ShoppingListTitle>
          烹煮計畫日期：
          {cookingDate?.toDate().toLocaleDateString()}
        </ShoppingListTitle>
        <div>共計 {items?.length} 個</div>
      </TitleContainer>
      <Header>
        <Item></Item>
        <ItemOrder>項目</ItemOrder>
        <Item>名稱</Item>
        <Item>數量</Item>
        <Item>負責人</Item>
      </Header>

      {items?.map((purchaseItem, itemIndex) => (
        <div key={`${itemIndex}-${purchaseItem}`}>
          <ShoppingItems>
            <Item>
              <InputCheck
                type="checkbox"
                checked={
                  checkedItems[index]?.[itemIndex] || purchaseItem.isPurchased
                }
                onChange={() => handleCheckboxChange(index, itemIndex)}
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
                style={{ maxWidth: "100px" }}
                onChange={(value) => handleSelectChange(value, itemIndex)}
              >
                {partners?.map((partner) => (
                  <Option key={partner.key} value={partner.label}>
                    {partner.label}
                  </Option>
                ))}
              </Select>
            </Item>
          </ShoppingItems>
          <hr />
        </div>
      ))}
    </Wrapper>
  );
};

export default ShoppingList;
