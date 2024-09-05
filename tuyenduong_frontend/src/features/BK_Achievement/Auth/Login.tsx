import React, { useState } from "react";

import {
  CCard,
  CCardBody,
  CCardGroup,
  CContainer,
  CRow,
} from "@coreui/react";

import GoogleButton from "./components/GoogleButton";
import { LoginFirstCommon } from "../../../components/Form/LoginFirstCommon";
import { LoginStudent } from "../../../components/Form/LoginStudent";
import StudentAsTeacherErrToaster from "../../../common/toast/StudentAsTeacherErr";
import TeacherAsStudentErrToaster from "../../../common/toast/TeacherAsStudentErr";
import UserBanned from "../../../common/toast/userBanned";
import bkbanner from "../../../assets/images/BK_banner.png";
const Login = () => {
  const [isStudentForm, setIsStudentForm] = useState(false);
  const [isTeacherForm, setIsTeacherForm] = useState(false);
  const [token, setToken] = useState("");
  const [teacherToken, setTeacherToken] = useState("");
  const [studentAsTeacherErr, setStudentAsTeacherErr] = useState(false);
  const [teacherAsStudentErr, setTeacherAsStudentErr] = useState(false);
  const [userBannedToast, setUserBannedToast] = useState(false);
  const showStudentForm = (token: string) => {
    setIsStudentForm(true);
    setToken(token);
  };
  const showTeacherForm = (token: string) => {
    setTeacherToken(token);
    setIsTeacherForm(true);
  };
  const showWrongAuthorizing1 = () => {
    setStudentAsTeacherErr(true);
    setTimeout(() => {
      setStudentAsTeacherErr(false);
    }, 5000);
  };
  const showWrongAuthorizing2 = () => {
    setTeacherAsStudentErr(true);
    setTimeout(() => {
      setTeacherAsStudentErr(false);
    }, 5000);
  };
  const showWrongAuthorizing3 = () => {
    setUserBannedToast(true);
    setTimeout(() => {
      setUserBannedToast(false);
    }, 5000);
  };
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          {/* <CCol md='8'> */}
          <CCardGroup>
            <CCard className="p-4">
              <CCardBody>
                <h3>ĐĂNG NHẬP</h3>
                <br />
                <GoogleButton
                  setShowStudentForm={showStudentForm}
                  setShowTeacherForm={showTeacherForm}
                  setWrongAuthorizing1={showWrongAuthorizing1}
                  setWrongAuthorizing2={showWrongAuthorizing2}
                  setUserBanned={showWrongAuthorizing3}
                />
              </CCardBody>
            </CCard>
            <CCard
              className="text-white py-5 d-md-down-none"
              style={{ backgroundColor: "rgb(38 57 136)" }}
            >
              <CCardBody className="text-center">
                <img src={bkbanner} alt="bk banner" style={{ width: "100%" }} />
              </CCardBody>
            </CCard>
          </CCardGroup>
          {/* </CCol> */}
        </CRow>
      </CContainer>
      {isStudentForm ? (
        // <LoginStudent token={token} />
        <LoginStudent token={token} />
      ) : isTeacherForm ? (
        <LoginFirstCommon token={teacherToken} />
      ) : (
        <></>
      )}
      <StudentAsTeacherErrToaster isShow={studentAsTeacherErr} />
      <TeacherAsStudentErrToaster isShow={teacherAsStudentErr} />
      <UserBanned isShow={userBannedToast} />
    </div>
  );
};

export default Login;
