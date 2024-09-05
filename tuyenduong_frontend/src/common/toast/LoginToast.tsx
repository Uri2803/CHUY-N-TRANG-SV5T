import { CToast, CToastBody, CToaster, CToastHeader } from "@coreui/react";
import React from "react";
import { FaCheck } from "react-icons/fa";

const Toaster = (props: any) => {
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
          <FaCheck color={"green"} />
          Lưu thành công, vui lòng đăng nhập lại để tiếp tục
        </CToastBody>
      </CToast>
    </CToaster>
  );
};

export default Toaster;
