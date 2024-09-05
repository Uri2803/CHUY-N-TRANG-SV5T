import {
  CButton,
  CCallout,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CContainer,
  CRow,
} from "@coreui/react";
import { FastField, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import DepartmentApi from "../../../../api/Achievement/departmentApi";
import UserApi from "../../../../api/Achievement/userApi";
import CinputField from "../../../../common/input/CInput";
import CselectField from "../../../../common/input/Cselect";
import { setUser } from "../../../../redux/user";
import Department from "../../../../types/Department";
import { roles } from "../../../../common/roles";
import * as yup from "yup";

import InputDatePicker from "../../../../common/input/CInput/InputDatePicker";
import Toaster from "../../../../common/toast";
import { RootState } from "../../../../store";
import ErrToaster from "../../../../common/toast/LoginErrorToast";
import moment from "moment";
import ImageAvatar from "../../../../assets/images/avatar.jpg";
import ReactSelect from "../../../../common/input/Cselect/reactSelect";

let validationSchema = yup.object().shape({
  mssv: yup.string().typeError("Bắt buộc nhập").required("Bắt buộc nhập"),
  surname: yup
    .string()
    .typeError("Bắt buộc nhập")
    .required("Bắt buộc nhập")
    .trim("Không được để khoảng trắng 2 đầu")
    .strict(true)
    .max(50, "Không được vượt quá 50 ký tự"),
  name: yup
    .string()
    .typeError("Bắt buộc nhập")
    .required("Bắt buộc nhập")
    .trim("Không được để khoảng trắng 2 đầu")
    .strict(true)
    .max(20, "Không được vượt quá 20 ký tự"),
  emailPersonal: yup
    .string()
    .typeError("Bắt buộc nhập")
    .required("Bắt buộc nhập")
    .trim("Không được để khoảng trắng 2 đầu")
    .strict(true)
    .email("Bắt buộc là email")
    .max(50, "Không được vượt quá 50 ký tự"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Chỉ được nhập số và phải đủ 10 số"),

  CMND: yup
    .string()
    .trim("Không được để khoảng trắng 2 đầu")
    .strict(true)
    .max(50, "Không được vượt quá 50 ký tự")
    .nullable(),
  nation: yup
    .string()
    .trim("Không được để khoảng trắng 2 đầu")
    .strict(true)
    .max(50, "Không được vượt quá 50 ký tự")
    .nullable(),
  religion: yup
    .string()
    .trim("Không được để khoảng trắng 2 đầu")
    .strict(true)
    .max(50, "Không được vượt quá 50 ký tự")
    .nullable(),
  homeTown: yup
    .string()
    .trim("Không được để khoảng trắng 2 đầu")
    .strict(true)
    .max(100, "Không được vượt quá 100 ký tự")
    .nullable(),
  resident: yup
    .string()
    .trim("Không được để khoảng trắng 2 đầu")
    .strict(true)
    .max(100, "Không được vượt quá 100 ký tự")
    .nullable(),
  placeUnion: yup
    .string()
    .trim("Không được để khoảng trắng 2 đầu")
    .strict(true)
    .max(100, "Không được vượt quá 100 ký tự")
    .nullable(),
  placeCommunistParty: yup
    .string()
    .trim("Không được để khoảng trắng 2 đầu")
    .strict(true)
    .max(100, "Không được vượt quá 100 ký tự")
    .nullable(),
});

interface Props {
  token: string;
}

const Manager: React.FC<Props> = (props) => {
  const [depData, setDepData] = useState<Department[]>([]);

  const [isErrToast, setIsErrToast] = useState(false);
  const [data, setData] = useState<any>(null);
  const [userDepdata, setUserDepdata] = useState<any>(null);

  const [collapseUser, setCollapseUser] = useState(true);

  // const handleClose = () => {};
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const initialValues = {
    name: user.name,
    email: user.email,
    mssv: user.mssv,
    surname: user.surName,
    CMND: data !== null ? data.CMND : "",
    gender: data !== null ? data.gender : "",
    phone: data !== null ? data.phone : "",
    homeTown: data !== null ? data.homeTown : "",
    religion: data !== null ? data.religion : "",
    nation: data !== null ? data.nation : "",
    resident: data !== null ? data.resident : "",
    birthday:
      data !== null
        ? data.birthday === null
          ? null
          : moment(data.birthday).toDate()
        : null,
    dateAtUnion:
      data === null
        ? null
        : data.dateAtUnion === null
        ? null
        : moment(data.dateAtUnion).toDate(),
    dateAtCommunistParty:
      data === null
        ? null
        : data.dateAtCommunistParty === null
        ? null
        : moment(data.dateAtCommunistParty).toDate(),
    studentAssociation:
      data === null
        ? null
        : data.studentAssociation === null
        ? null
        : moment(data.studentAssociation).toDate(),
    placeCommunistParty: data === null ? null : data.placeCommunistParty,
    placeUnion: data === null ? null : data.placeUnion,
    emailPersonal: data === null ? null : data.emailPersonal,
    department:
      userDepdata !== null
        ? userDepdata.department !== undefined &&
          userDepdata.department !== null
          ? userDepdata.department.id
          : ""
        : "",
    youthBranch:
      userDepdata !== null
        ? userDepdata.youthUnion !== undefined &&
          userDepdata.youthUnion !== null
          ? userDepdata.youthUnion.id
          : ""
        : "",
  };
  const history = useHistory();
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    const getDepData = async () => {
      const data = await DepartmentApi.getAll();
      setDepData(data);
    };
    async function getData() {
      if (user.id !== undefined) {
        const fetchData = await UserApi.getUserInfo(user.id.toString());
        setData(fetchData);
        if (true) {
          const FetchDepData = await UserApi.getUserDepartmentAndYouthUnion(
            user.id.toString()
          );
          setUserDepdata(FetchDepData);
        }
      }
    }
    if (["admin", "manager", "department"].includes(user.role)) {
      getData();
      getDepData();
    } else {
      verifyLogin();
      if (user.id !== 0) {
        history.push("/loi-truy-cap");
      }
    }
  }, [props.token, user.id, user.role, history, user.name]);

  const [isToast, setIsToast] = useState(false);

  return (
    <>
      {user.id !== 0 ? (
        <CContainer style={{ backgroundColor: "white" }}>
          <CRow>
            <CCol sm="3" className="pt-3">
              <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                <img
                  className="rounded-circle mt-5"
                  width="150px"
                  alt="avatar"
                  src={ImageAvatar}
                />
                <span className="font-weight-bold">
                  {user.surName} {user.name}
                </span>
                <span className="text-black-50">{user.email}</span>
                <span> </span>
              </div>
            </CCol>
            <CCol sm="9" className="mt-3">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values: any, actions) => {
                  if (true) {
                    const info = {
                      id: data.id,
                      CMND: values.CMND !== undefined ? values.CMND : "",
                      phone: values.phone !== undefined ? values.phone : "",
                      homeTown:
                        values.homeTown !== undefined ? values.homeTown : "",
                      religion:
                        values.religion !== undefined ? values.religion : "",
                      nation: values.nation !== undefined ? values.nation : "",
                      gender: values.gender !== undefined ? values.gender : "",
                      resident:
                        values.resident !== undefined ? values.resident : "",
                      birthday:
                        values.birthday !== undefined ? values.birthday : "",
                      dateAtUnion:
                        values.dateAtUnion === undefined
                          ? null
                          : values.dateAtUnion,
                      dateAtCommunistParty:
                        values.dateAtCommunistParty === undefined
                          ? null
                          : values.dateAtCommunistParty,
                      placeCommunistParty:
                        values.placeCommunistParty === undefined
                          ? null
                          : values.placeCommunistParty,
                      placeUnion:
                        values.placeUnion === undefined
                          ? ""
                          : values.placeUnion,
                      emailPersonal: values.emailPersonal,
                      studentAssociation:
                        values.studentAssociation === undefined
                          ? null
                          : values.studentAssociation,
                    };
                    const senduser = {
                      id: user.id,
                      mssv: values.mssv === undefined ? null : values.mssv,
                      youthUnionId: null,
                      updateAt: new Date(),
                      department: values.department,
                      name: values.name === undefined ? null : values.name,
                      surName:
                        values.surname === undefined ? null : values.surname,
                      isUpdatedInformation: true,
                    };
                    actions.setSubmitting(true);
                    try {
                      const updatedUser = await UserApi.updateUser(
                        senduser,
                        info
                      );
                      const newUser = {
                        id: user.id,
                        email: user.email,
                        isRegisteredWithGoogle: user.isRegisteredWithGoogle,
                        role: user.role,
                        name: updatedUser.name,
                        mssv: updatedUser.mssv,
                        youthUnion: updatedUser.youthUnionId,
                        surName: updatedUser.surName,
                        isUpdatedInformation: true,
                      };
                      dispatch(setUser(newUser));
                      setIsToast(true);
                      setTimeout(() => {
                        if (user.role === roles.MANAGER) {
                          history.push("/danh-hieu");
                        }
                        if (user.role === roles.ADMIN) {
                          history.push("/quan-li-nguoi-dung");
                        }
                        if (user.role === roles.DEPARTMENT) {
                          history.push("/quan-ly-danh-hieu-cap-don-vi");
                        }
                      }, 1000);
                    } catch (e: any) {
                      console.log(e.message);
                      setIsErrToast(true);
                    }
                    actions.setSubmitting(false);
                  }
                }}
                enableReinitialize
              >
                {(formikProps) => {
                  return (
                    <Form>
                      {!user.isUpdatedInformation ? (
                        <CCallout color="danger" className={"bg-white"}>
                          <small className="text-muted">Lưu ý</small>
                          <br />
                          <strong className="h5">
                            Các thông tin có chữ <b>IN ĐẬM</b> sẽ không thể thay
                            đổi hoặc chỉnh sửa sau lần cập nhật thông tin lần
                            đầu tiên
                            <hr />
                          </strong>
                        </CCallout>
                      ) : (
                        <>
                          <CCallout color="info" className={"bg-white"}>
                            <small className="text-muted">Lưu ý</small>
                            <br />
                            <strong className="h5">
                              Nếu muốn thay đổi các thông tin có chữ{" "}
                              <b>IN ĐẬM</b> xin vui lòng liên hệ quản trị hệ
                              thống để được quyền cập nhật lại.
                              <hr />
                            </strong>
                          </CCallout>
                        </>
                      )}
                      <CCard>
                        <CCardHeader color="light">
                          <CButton
                            block
                            className="text-left m-0 p-0"
                            onClick={() => setCollapseUser(!collapseUser)}
                          >
                            <h4>Thông tin cá nhân</h4>
                          </CButton>
                        </CCardHeader>
                        <CCollapse show={collapseUser}>
                          <CCardBody>
                            <CRow>
                              <CCol sm="8">
                                <FastField
                                  name="surname"
                                  component={CinputField}
                                  placeholder="Nguyễn Văn..."
                                  label="Họ và tên đệm"
                                  bold={true}
                                  required="*"
                                  onChange={formikProps.handleChange}
                                  disabled={user.isUpdatedInformation}
                                />
                              </CCol>
                              <CCol sm="4">
                                <FastField
                                  name="name"
                                  component={CinputField}
                                  placeholder="Hải"
                                  bold={true}
                                  required="*"
                                  label="Tên"
                                  onChange={formikProps.handleChange}
                                  disabled={user.isUpdatedInformation}
                                />
                              </CCol>
                              <CCol sm="8">
                                <FastField
                                  name="emailPersonal"
                                  component={CinputField}
                                  placeholder="cb@gmail.com"
                                  label="Email cá nhân"
                                  required="*"
                                  onChange={formikProps.handleChange}
                                />
                              </CCol>
                              <CCol sm="4">
                                <FastField
                                  name="mssv"
                                  component={CinputField}
                                  placeholder="007"
                                  bold={true}
                                  required="*"
                                  label="MSCB/ MSSV"
                                  onChange={formikProps.handleChange}
                                  disabled={user.isUpdatedInformation}
                                />
                              </CCol>
                              <CCol sm="6">
                                <FastField
                                  name="phone"
                                  component={CinputField}
                                  placeholder="Nhập số điện thoại"
                                  label="Số điện thoại di động"
                                  required="*"
                                  onChange={formikProps.handleChange}
                                />
                              </CCol>
                              <CCol sm="2">
                                <FastField
                                  name="gender"
                                  component={CselectField}
                                  values={[
                                    { value: "", name: "Vui lòng chọn" },
                                    { value: "Male", name: "Nam" },
                                    { value: "Female", name: "Nữ" },
                                    { value: "Other", name: "Khác" },
                                  ]}
                                  label="Giới tính"
                                />
                              </CCol>
                              <CCol sm="4">
                                <FastField
                                  name="birthday"
                                  component={InputDatePicker}
                                  placeholder="Ngày/Tháng/Năm"
                                  maxDate={moment().toDate()}
                                  label="Ngày sinh"
                                  onChange={formikProps.handleChange}
                                />
                              </CCol>

                              <CCol sm="4">
                                <FastField
                                  name="CMND"
                                  component={CinputField}
                                  placeholder="007"
                                  label="Số CMND/CCCD"
                                  onChange={formikProps.handleChange}
                                />
                              </CCol>
                              <CCol sm="4">
                                <FastField
                                  name="nation"
                                  component={CinputField}
                                  placeholder="..."
                                  label="Dân tộc"
                                  onChange={formikProps.handleChange}
                                />
                              </CCol>
                              <CCol sm="4">
                                <FastField
                                  name="religion"
                                  component={CinputField}
                                  placeholder="..."
                                  label="Tôn giáo"
                                  onChange={formikProps.handleChange}
                                />
                              </CCol>
                              <CCol sm="12">
                                <FastField
                                  name="homeTown"
                                  component={CinputField}
                                  placeholder="Xã/Phường/Thị trấn...., Quận/Huyện...., Tỉnh/TP.... "
                                  label="Quê quán"
                                  onChange={formikProps.handleChange}
                                />
                              </CCol>
                              <CCol sm="12">
                                <FastField
                                  name="resident"
                                  component={CinputField}
                                  placeholder="Xã/Phường/Thị trấn...., Quận/Huyện...., Tỉnh/TP.... "
                                  label="Thường trú"
                                  onChange={formikProps.handleChange}
                                />
                              </CCol>
                              <CCol sm="12">
                                <Field
                                  name="department"
                                  component={ReactSelect}
                                  disabled={user.isUpdatedInformation}
                                  values={depData.map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                  }))}
                                  label="Đơn vị"
                                  bold={true}
                                  required="*"
                                />
                              </CCol>
                            </CRow>
                          </CCardBody>
                        </CCollapse>
                      </CCard>

                      <CButton
                        color="primary"
                        type="submit"
                        style={{ float: "right", marginBottom: "30px" }}
                        disabled={
                          !formikProps.isValid || formikProps.isSubmitting
                        }
                        onDoubleClick={(e) => e.preventDefault()}
                      >
                        Xác nhận
                      </CButton>
                    </Form>
                  );
                }}
              </Formik>
            </CCol>
          </CRow>
          <Toaster isShow={isToast} />
          <ErrToaster isShow={isErrToast} />
        </CContainer>
      ) : (
        <></>
      )}
    </>
  );
};

export default Manager;
