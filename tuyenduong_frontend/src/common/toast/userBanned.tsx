import { CToast, CToastBody, CToaster, CToastHeader } from "@coreui/react";
import React from "react";
import { FaTimes } from "react-icons/fa";

const UserBanned = (props: any) => {
  const { isShow } = props;
  return (
    <CToaster position="top-right">
      <CToast title="CoreUI for React.js" autohide={5000} show={isShow}>
        <CToastHeader style={{ backgroundColor: "red", color: "white" }}>
          <strong className="me-auto">Thông báo</strong>
        </CToastHeader>
        <CToastBody
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <FaTimes color={"red"} />
          Bạn đã bị cấm bởi quản trị viên
        </CToastBody>
      </CToast>
    </CToaster>
  );
};

export default UserBanned;
