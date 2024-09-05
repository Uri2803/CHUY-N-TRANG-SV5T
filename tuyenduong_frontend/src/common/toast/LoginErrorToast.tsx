import { CToast, CToastBody, CToaster, CToastHeader } from "@coreui/react";
import React from "react";
import { FaTimes } from "react-icons/fa";

const ErrToaster = (props: any) => {
  const { isShow } = props;
  return (
    <CToaster position="top-right">
      <CToast title="CoreUI for React.js" autohide={3000} show={isShow}>
        <CToastHeader>
          <strong className="me-auto">Thông báo</strong>
        </CToastHeader>
        <CToastBody
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <FaTimes color={"red"} />
          Cập nhật thông tin bị lỗi, vui lòng thử lại
        </CToastBody>
      </CToast>
    </CToaster>
  );
};

export default ErrToaster;
