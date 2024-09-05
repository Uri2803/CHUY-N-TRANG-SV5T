import { CToast, CToastBody, CToaster, CToastHeader } from "@coreui/react";
import React from "react";
import { FaTimes } from "react-icons/fa";

const NotBKNetIDToaster = (props: any) => {
  const { isShow } = props;
  return (
    <CToaster position="top-right" color="danger">
      <CToast title="CoreUI for React.js" autohide={5000} show={isShow}>
        <CToastHeader style={{ backgroundColor: "red", color: "white" }}>
          <strong className="me-auto">Thông báo</strong>
        </CToastHeader>
        <CToastBody
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <FaTimes color={"red"} />
          Bạn phải dùng tài khoản BKNetID@hcmut.edu.vn để truy cập vào hệ thống
        </CToastBody>
      </CToast>
    </CToaster>
  );
};

export default NotBKNetIDToaster;
