import { Select, message } from "antd";
import "firebase/database";
import {
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FC, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../../context/authContext";
import { db } from "../../firbase";
import { PartnerList, ShoppingListProps } from "../../types";
const { Option } = Select;

const Header = styled.div`
  display: flex;
  justify-content: space-around;

  @media screen and (max-width: 1279px) {
    border-bottom: 1px solid #3f3a3a;
    padding: 10px 0;
  }
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

const ShoppingList: FC<ShoppingListProps> = ({ purchasePlan, user, index }) => {
const ShoppingList: FC<ShoppingListProps> = ({ purchasePlan, index }) => {
  const userInformation = useContext(AuthContext);

  const currentUserUid = userInformation?.user?.uid;

  const [partnerList, setPartnerList] = useState<PartnerList[]>([]);

  useEffect(() => {
    const getPartnerData = async () => {
      const userCollection = collection(db, "user");
      if (currentUserUid !== null) {
        const q = query(userCollection, where("uid", "==", currentUserUid));
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

    getPartnerData();
  }, [currentUserUid]);

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

  const { cookingDate, items } = purchasePlan;

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

          console.log(planIndex);
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

  return (
    <div style={{ padding: "10px,20px" }}>
      <TitleContainer>
        <div style={{ fontSize: 18 }}>
          烹煮計畫日期：
          {cookingDate?.toDate().toLocaleDateString()}
        </div>
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
                style={{ width: 100 }}
                onChange={(value) => handleSelectChange(value, itemIndex)}
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
  );
};

export default ShoppingList;
