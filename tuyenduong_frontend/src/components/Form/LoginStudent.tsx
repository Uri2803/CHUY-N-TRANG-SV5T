import React, { useEffect, useState } from "react";

import { Formik, Form, FastField, Field } from "formik";
import {
  CButton,
  CCardBody,
  CCol,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import CinputField from "../../common/input/CInput";
import CselectField from "../../common/input/Cselect";
import * as yup from "yup";
import DepartmentApi from "../../api/Achievement/departmentApi";
import Department from "../../types/Department";

import Toaster from "../../common/toast/LoginToast";

let validationSchema = yup.object().shape({
  mssv: yup
    .number()
    .required("Bắt buộc nhập")
    .positive("Mã không hợp lệ")
    .integer("Mã không hợp lệ"),
});

interface Props {
  token: string;
}

export const LoginStudent: React.FC<Props> = (props) => {
  const initialValues = {
    department: "",
  };
  const [depData, setDepData] = useState<Department[]>([]);

  useEffect(() => {
    const getDepData = async () => {
      const data = await DepartmentApi.getAll();
      setDepData(data);
    };
    getDepData();
  }, [props.token]);
  // eslint-disable-next-line
  const [isToast, setIsToast] = useState(false);
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal show={true} size="lg" className="show d-block" color="info">
            <CModalHeader>
              <CModalTitle>Thông tin cần thiết</CModalTitle>
            </CModalHeader>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values: any, actions) => {}}
              enableReinitialize
            >
              {(formikProps) => {
                const { values } = formikProps;
                return (
                  <Form>
                    <CModalBody>
                      <h2>Thông tin cá nhân</h2>
                      <FastField
                        name="mssv"
                        component={CinputField}
                        placeholder="007"
                        label="Mã số sinh viên"
                        onChange={formikProps.handleChange}
                      />
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
                      <FastField
                        name="nation"
                        component={CinputField}
                        placeholder="007"
                        label="Dân tộc"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="religion"
                        component={CinputField}
                        placeholder="Phật giáo,..."
                        label="Tôn giáo"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="birthday"
                        component={CinputField}
                        label="Ngày sinh"
                        type="Date"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="CMND"
                        component={CinputField}
                        placeholder="007"
                        label="Số CMND"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="homeTown"
                        component={CinputField}
                        placeholder="Xã/Phường/Thị trấn...., Quận/Huyện...., Tỉnh/TP.... "
                        label="Quê quán"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="resident"
                        component={CinputField}
                        placeholder="Xã/Phường/Thị trấn...., Quận/Huyện...., Tỉnh/TP.... "
                        label="Thường trú"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="phone"
                        component={CinputField}
                        placeholder="113"
                        label="Số điện thoại di động"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="email"
                        component={CinputField}
                        placeholder="abcXYZ@gmail.com"
                        label="Email cá nhân"
                        onChange={formikProps.handleChange}
                      />
                      <h2>Thông tin về Đơn vị</h2>
                      <CLabel htmlFor={"department"}>Chọn đơn vị</CLabel>
                      <Field
                        name="department"
                        as="select"
                        onChange={formikProps.handleChange}
                        className="form-control"
                      >
                        <option value="">Vui lòng chọn</option>
                        {depData.map((item) => (
                          <>
                            <option value={item.id}>{item.name}</option>
                          </>
                        ))}
                      </Field>
                      <FastField
                        name="dateAtUnion"
                        component={CinputField}
                        placeholder="abc@hcmut.edu.vn"
                        label="Ngày vào Đoàn (nếu có)"
                        type="Date"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="placeUnion"
                        component={CinputField}
                        placeholder="Trường THPT....- tỉnh..."
                        label="Nơi vào Đoàn"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="dateAtCommunistParty"
                        component={CinputField}
                        label="Ngày vào Đảng (nếu có)"
                        type="Date"
                        onChange={formikProps.handleChange}
                      />
                      <FastField
                        name="placeCommunistParty"
                        component={CinputField}
                        // placeholder='abc@hcmut.edu.vn'
                        label="Nơi vào Đảng"
                        onChange={formikProps.handleChange}
                      />
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        color="info"
                        type="submit"
                        disabled={formikProps.isSubmitting}
                      >
                        Xác nhận
                      </CButton>
                    </CModalFooter>
                    <pre>{JSON.stringify(values, null, 2)}</pre>
                  </Form>
                );
              }}
            </Formik>
          </CModal>
        </CCardBody>
      </CCol>
      <Toaster isShow={isToast} />
    </CRow>
  );
};
