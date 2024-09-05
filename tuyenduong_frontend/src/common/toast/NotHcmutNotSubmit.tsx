import { CToast, CToastBody, CToaster, CToastHeader } from "@coreui/react";
import React from "react";
import { FaTimes } from "react-icons/fa";

const NotHcmutNotSubmit = (props: any) => {
  const { isShow } = props;
  return (
    <CToaster position="top-right">
      <CToast title="CoreUI for React.js" autohide={4000} show={isShow}>
        <CToastHeader>
          <strong className="me-auto">Thông báo</strong>
        </CToastHeader>
        <CToastBody
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <FaTimes color={"red"} />
          Bạn chỉ có thể đăng kí hồ sơ với tài khoản BKNetID@hcmut.edu.vn
        </CToastBody>
      </CToast>
    </CToaster>
  );
};

export default NotHcmutNotSubmit;
