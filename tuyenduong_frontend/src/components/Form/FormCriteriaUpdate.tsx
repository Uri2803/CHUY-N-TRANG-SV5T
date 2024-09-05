// import * as React from "react";

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
import CinputField from "../../common/input/CInput";
import * as yup from "yup";
import CselectField from "../../common/input/Cselect";
import CradioField from "../../common/input/Cradio";
import CcheckboxField from "../../common/input/Ccheckbox";

let validationSchema = yup.object().shape({
  isCriteria: yup.string(),
});

interface MyFormValues {
  name: string;
  isCriteria: string;
  method: string;
  file: Array<string>;
  sign: string;
  upperPoint: number;
  lowerPoint: number;
  note: string;
  content: string;
  valueListString: string;
}

export const FormCriteriaUpdate = (props: any) => {
  const { isOpen, onClose, onSubmit, parentId, item } = props;

  let sign = ">",
    lowerPoint = 1,
    upperPoint = 0;
  let file = item.evidence ? ["evidence"] : [];
  if (item.upperPoint === 1) {
    sign = item.lowerSign;
    lowerPoint = item.lowerPoint;
  } else {
    if (item.lowerPoint < item.upperPoint) {
      sign = ">=and<=";
    } else {
      sign = ">=or<=";
    }
    lowerPoint = item.lowerPoint;
    upperPoint = item.upperPoint;
  }
  let initialValues: MyFormValues = {
    name: item.name,
    isCriteria: item.isCriteria ? "true" : "false",
    method: item.method,
    file,
    sign,
    upperPoint,
    lowerPoint,
    note: item.note,
    content: item.content,
    valueListString: item.valueListString,
  };

  const handleFormatData = (values: any) => {
    const type: string =
      values.file.includes("evidence") === true ? "hard" : "soft";
    const evidence: boolean =
      values.file.includes("evidence") === true ? true : false;

    const upperPoint = Number(values.upperPoint);
    const lowerPoint = Number(values.lowerPoint);
    const isCriteria: boolean = values.isCriteria === "true" ? true : false;
    const id = item.id;
    const note = values.note !== undefined ? values.note : "";
    const content = values.content !== undefined ? values.content : "";
    const valueListString =
      values.valueListString !== undefined ? values.valueListString : "";
    let upperSign: string = "",
      lowerSign: string = "";
    if ([">=and<=", ">=or<="].includes(values.sign)) {
      upperSign = "<=";
      lowerSign = ">=";
    } else {
      lowerSign = values.sign;
    }
    delete values.sign;
    return {
      parentId: parentId,
      item: {
        ...values,
        type,
        evidence, //check xem kiểu dữ liệu nhận được có phải boolean ko
        note,
        content,
        valueListString,
        upperPoint,
        lowerPoint,
        id,
        isCriteria,
        lowerSign,
        upperSign,
        soft: item.soft,
        children: item.children,
      },
    };
  };
  const handleOnSubmit = async (values: any, actions: any) => {
    // start logic submit form
    const Criteria = handleFormatData(values);
    onSubmit(Criteria);
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
              <CModalTitle>Thêm tiêu chí</CModalTitle>
            </CModalHeader>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleOnSubmit}
            >
              {(formikProps) => {
                const { values } = formikProps;
                return (
                  <Form>
                    <CModalBody>
                      <FastField
                        name="isCriteria"
                        component={CselectField}
                        values={[
                          { value: "", name: "Vui lòng chọn" },
                          { value: "true", name: "Tiêu chí" },
                          { value: "false", name: "Tập tiêu chí" },
                        ]}
                        label="Loại tiêu chí"
                      />
                      {values.isCriteria !== "" && (
                        <FastField
                          name="name"
                          component={CinputField}
                          placeholder="Danh hiệu sinh viên 5 tốt"
                          label="Tên tiêu chí"
                        />
                      )}
                      {values.isCriteria === "true" && (
                        <>
                          <FastField
                            name="method"
                            component={CradioField}
                            values={[
                              { value: "point", name: "Thang điểm" },
                              { value: "binary", name: "Nhị phân" },
                              {
                                value: "comment",
                                name: "Người nộp tự nhận xét",
                              },
                              {
                                value: "selectList",
                                name: "Dạng danh sách",
                              },
                            ]}
                            label="Phương thức tính kết quả: "
                          />
                          <FastField
                            name="file"
                            component={CcheckboxField}
                            values={[
                              { value: "evidence", name: "Nộp minh chứng" },
                            ]}
                          />
                        </>
                      )}
                      {values.method === "point" && (
                        <CRow>
                          <CCol md="2">
                            <FastField
                              name="sign"
                              component={CselectField}
                              values={[
                                { value: ">", name: ">" },
                                { value: "<", name: "<" },
                                { value: ">=", name: ">=" },
                                { value: "<=", name: "<=" },
                                { value: ">=and<=", name: ">= và <=" },
                                { value: ">=or<=", name: ">= hoặc <=" },
                              ]}
                            />
                          </CCol>
                          {[">=and<=", ">=or<="].includes(values.sign) ? (
                            <>
                              <CCol md="2">
                                <FastField
                                  name="sign1"
                                  component={CinputField}
                                  placeholder=">="
                                  disabled={true}
                                />
                              </CCol>
                              <CCol md="2">
                                <FastField
                                  name="lowerPoint"
                                  component={CinputField}
                                  placeholder="0,1,,2..."
                                />
                              </CCol>
                              <CCol md="2">
                                <FastField
                                  name="upperPoint"
                                  component={CinputField}
                                  placeholder="0,1,,2..."
                                />
                              </CCol>
                              <CCol md="2">
                                <FastField
                                  name="sign3"
                                  component={CinputField}
                                  value="<="
                                  placeholder="<="
                                  disabled={true}
                                />
                              </CCol>
                            </>
                          ) : (
                            <CCol md="2">
                              <FastField
                                name="lowerPoint"
                                component={CinputField}
                                placeholder="0,1,,2..."
                              />
                            </CCol>
                          )}
                        </CRow>
                      )}
                      {values.method === "selectList" && (
                        <FastField
                          name="valueListString"
                          component={CinputField}
                          placeholder="Danh sách lựa chọn"
                          label="Nhập các phần tử của danh sách, cách nhau bởi dấu phẩy"
                        />
                      )}
                      {values.isCriteria !== undefined ? (
                        values.isCriteria === "true" ? (
                          <FastField
                            name="content"
                            component={CinputField}
                            placeholder="Nội dung"
                            label="Nội dung"
                          />
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}
                      <FastField
                        name="note"
                        component={CinputField}
                        placeholder="Ghi chú"
                        label="Ghi chú"
                      />
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
                        onClick={() => {
                        }}
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
