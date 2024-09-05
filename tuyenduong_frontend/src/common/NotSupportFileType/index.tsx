import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";
import React from "react";

const NotSupportedViewer = (prop: {
  show: boolean;
  notSpClose: () => void;
}) => {
  return (
    <CModal show={prop.show} onClose={prop.notSpClose} size="xl">
      <CModalHeader closeButton>
        <strong>Xem lại</strong>
      </CModalHeader>
      <CModalBody>
        <div>Hiện không hỗ trợ xem trước loại tệp này</div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={prop.notSpClose}>
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default NotSupportedViewer;
