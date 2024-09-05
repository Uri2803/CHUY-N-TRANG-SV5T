import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";
import React from "react";

const PdfViewer = (prop: {
  file: any;
  show: boolean;
  pdfViewClose: () => void;
}) => {
  return (
    <CModal show={prop.show} onClose={prop.pdfViewClose} size="xl">
      <CModalHeader closeButton>
        <strong>Xem lại</strong>
      </CModalHeader>
      <CModalBody>
        <div>
          <object
            style={{ height: "70vh" }}
            data={prop.file}
            type="application/pdf"
            width="100%"
            height="100%"
          >
            Không thể mở tệp
          </object>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={prop.pdfViewClose}>
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default PdfViewer;
