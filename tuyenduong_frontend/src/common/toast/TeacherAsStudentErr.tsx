import { CToast, CToastBody, CToaster, CToastHeader } from "@coreui/react";
import React from "react";
import { FaTimes } from "react-icons/fa";

const TeacherAsStudentErrToaster = (props: any) => {
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
          Hệ thống chưa sẵn sàng, vui lòng quay lại sau
        </CToastBody>
      </CToast>
    </CToaster>
  );
};

export default TeacherAsStudentErrToaster;
