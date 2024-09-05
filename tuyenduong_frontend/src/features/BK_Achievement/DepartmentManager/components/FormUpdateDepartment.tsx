import * as React from "react";

import { Formik, Form, FastField } from "formik";
import {
  CButton,
  CCardBody,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import CinputField from "../../../../common/input/CInput";
import * as yup from "yup";

let validationSchema = yup.object().shape({
  isCriteria: yup.string(),
  name: yup
    .string()
    .required("Bắt buộc nhập")
    .min(5, "tối thiểu 5 ký tự")
    .max(150, "tối thiểu 150 ký tự"),
  method: yup.string().when("isCriteria", {
    is: "true",
    then: yup.string().required(),
  }),
});

interface MyFormValues {
  name: string;
  codeDepartment: string;
  youthBranch: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const FormUpdateDepartment: React.FC<Props> = ({ isOpen, onClose }) => {
  const [initialValues, setInitialValues] = React.useState<MyFormValues>({
    codeDepartment: "",
    name: "",
    youthBranch: "",
  });


  const handleOnSubmit = async (values: any, actions: any) => {
    // end logic submit form
    onClose();
    actions.resetForm();
    actions.setSubmitting(false);
  };
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal show={isOpen} size="lg" color="info" onClosed={onClose}>
            <CModalHeader closeButton>
              <CModalTitle>Thêm đơn vị</CModalTitle>
            </CModalHeader>
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleOnSubmit}
            >
              {(formikProps) => {
                return (
                  <Form>
                    <CModalBody>
                      <CRow>
                        <CCol sm="4">
                          <FastField
                            name="codeDepartment"
                            component={CinputField}
                            placeholder="CK,..."
                            label="Mã đơn vị"
                          />
                        </CCol>
                        <CCol sm="8">
                          <FastField
                            name="name"
                            component={CinputField}
                            placeholder="Cơ Khí,..."
                            label="Tên đơn vị"
                          />
                        </CCol>
                      </CRow>
                    </CModalBody>
                    <CModalFooter>
                      <CButton color="secondary" onClick={onClose}>
                        Hủy bỏ
                      </CButton>
                      <CButton
                        color="info"
                        type="submit"
                        disabled={
                          !formikProps.isValid || formikProps.isSubmitting
                        }
                        onDoubleClick={(e) => e.preventDefault()}
                      >
                        Xác nhận
                      </CButton>
                    </CModalFooter>
                  </Form>
                );
              }}
            </Formik>
          </CModal>
        </CCardBody>
      </CCol>
    </CRow>
  );
};
