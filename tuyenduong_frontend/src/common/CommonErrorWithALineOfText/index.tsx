import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";
import React from "react";

const ErrorModelWithAText = (prop: {
  message: string;
  show: boolean;
  modelClose: () => void;
}) => {
  return (
    <CModal show={prop.show} onClose={prop.modelClose} size="lg" color="danger">
      <CModalHeader closeButton>
        <strong>Lỗi</strong>
      </CModalHeader>
      <CModalBody>
        <strong>{prop.message}</strong>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={prop.modelClose}>
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ErrorModelWithAText;
