import { Button, Modal } from "antd";
import React, { useState } from "react";
import { UserOutlinedIconStyle } from "../AddDailyMeal/PurchasingPlan/PurchasingPlan.style";
import Partner from "./Partner";

const PatnerModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        type="text"
        onClick={showModal}
        icon={<UserOutlinedIconStyle />}
      ></Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Partner />
      </Modal>
    </>
  );
};

export default PatnerModal;
