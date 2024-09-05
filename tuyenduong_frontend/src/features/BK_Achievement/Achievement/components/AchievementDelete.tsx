import React, { useEffect, useState } from "react";
import { CModalBody, CModalTitle } from "@coreui/react";
import Modal from "../../../../common/Modal";
import achievementApi from "../../../../api/Achievement/achievementApi";
import { useHistory } from "react-router";

export const AchievementDelete = (props: any) => {
  const {
    isOpen,
    handleClose,
    title,
    handleSubmit,
    item,
    btnSubmit,
    colorBtnSubmit,
  } = props;
  const [data, setData] = useState({ id: 0 });
  const history = useHistory();

  useEffect(() => setData(item.id), [item]);

  const handleSubmitForm = async () => {
    try {
      await achievementApi.delete(
        data.toString()
      );
      handleSubmit(data);
    } catch (error: any) {
      console.log(error.message);
      history.push("/loi-truy-cap");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      title={title}
      btnSubmit={btnSubmit}
      colorBtnSubmit={colorBtnSubmit}
      handleSubmit={handleSubmitForm}
    >
      <CModalBody>
        <CModalTitle>
          Bạn có chắc chắn muốn xóa danh hiệu
          <strong>{" " + item.name + " "}</strong>
          không?
        </CModalTitle>
      </CModalBody>
    </Modal>
  );
};
