import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";
import React from "react";

const ImageViewer = (prop: {
  file: any;
  show: boolean;
  imgViewClose: () => void;
}) => {

  return (
    <CModal show={prop.show} onClose={prop.imgViewClose} size="xl">
      <CModalHeader closeButton>
        <strong>Xem lại</strong>
      </CModalHeader>
      <CModalBody>
        <div>
          <object
            style={{ height: "60vh" }}
            data={prop.file}
            width="100%"
            height="100%"
          >
            alt
          </object>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={prop.imgViewClose}>
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ImageViewer;
