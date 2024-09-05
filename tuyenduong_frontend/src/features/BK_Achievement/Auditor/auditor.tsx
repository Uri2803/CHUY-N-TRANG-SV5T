import {
  CButton,
  CCol,
  CContainer,
  CFormGroup,
  CLabel,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CTextarea,
} from "@coreui/react";
import React, { useCallback, useEffect, useState, memo } from "react";
import Card from "./components/Collapse";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import UserApi from "../../../api/Achievement/userApi";
import { useHistory } from "react-router-dom";
import Loading from "../../../assets/images/loading.gif";

const Auditor = (props: any) => {
  const {
    typeOb,
    dataParent,
    dataSubmission,
    achievementId,
    examerId,
    isFinal,
    seen,
  } = props;

  const [data, setData] = useState<any[]>([]);
  const [review, setReview] = useState(false);
  const auditor = useSelector((state: RootState) => state.auditor);
  const history = useHistory();

  console.log(examerId, isFinal, auditor);
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    verifyLogin();
    setData(dataSubmission?.criterias || []);
  }, [dataSubmission, history]);



  const getChildNode = useCallback((data: Array<any>, parentNode: any) => {
    return data.filter((item) => parentNode.children.includes(item.idCriteria));
  }, []);



  return (
    <CContainer>
      <CRow style={{ height: "100%" }}>
        {dataParent ? (
          <>
            <CCol
              xl="12"
              className="mt-2 d-flex justify-content-between align-items-center"
            >
              <div>
                {dataParent.soft
                  ? `Phải đạt ít nhất ${dataParent.soft} tiêu chí`
                  : `Phải đạt tất cả tiêu chí`}
              </div>
              <CButton color="primary" onClick={() => setReview(true)}>
                Xem nhận xét
              </CButton>
            </CCol>
            <CCol xl="12" className="mt-2">
              {}
              {dataParent.criterias.map((item: any) =>
                item.isRoot ? (
                  <Card
                    typeOb={typeOb}
                    key={item.id}
                    isRoot={true}
                    getChildren={getChildNode}
                    data={item}
                    disabled={true}
                    dataTotal={dataParent.criterias}
                  />
                ) : undefined
              )}
              {dataParent.criterias.map((item: any) =>
                item.description ? (
                  <div style={{ visibility: "hidden" }} key={item.id}>
                    <CFormGroup>
                      <CLabel htmlFor={item.id}>{item.name}</CLabel>
                      <CTextarea
                        name={item.name}
                        id={item.id}
                        disabled={true}
                        value={item.description}
                      />
                    </CFormGroup>
                  </div>
                ) : undefined
              )}
            </CCol>
            <CModal
              show={review}
              className="mt-5"
              size="lg"
              onClose={() => setReview(false)}
              color="info"
            >
              <CModalHeader closeButton>
                <CModalTitle>Xem nhận xét</CModalTitle>
              </CModalHeader>
              <CModalBody>
                {dataParent.criterias.map((item: any) =>
                  item.description ? (
                    <CFormGroup key={item.id}>
                      <CLabel htmlFor={item.id}>{item.nameCriteria}</CLabel>
                      <CTextarea
                        name={item.nameCriteria}
                        id={item.id}
                        disabled={true}
                        value={item.description}
                      />
                    </CFormGroup>
                  ) : undefined
                )}
              </CModalBody>
            </CModal>
          </>
        ) : data.length === 0 ? (
          <CCol
            xl="12"
            className="mt-2 d-flex align-items-center justify-content-center"
          >
            <img src={Loading} alt="Girl in a jacket" />
          </CCol>
        ) : (
          <>
            <CCol xl="12" className="mt-2 d-flex align-items-center">
              <div>
                {dataSubmission?.soft
                  ? `Phải đạt ít nhất ${dataSubmission?.soft} tiêu chí`
                  : `Phải đạt tất cả tiêu chí`}
              </div>
            </CCol>
            <CCol xl="12" className="mt-2">
              {data.map((item: any) =>
                item.isRoot ? (
                  <Card
                    typeOb={typeOb}
                    key={item.id}
                    isRoot={true}
                    achievementId={achievementId}
                    isFinal={isFinal}
                    seen={seen}
                    getChildren={getChildNode}
                    data={item}
                    dataTotal={data}
                    examerId={examerId}
                  />
                ) : undefined
              )}
            </CCol>
          </>
        )}
      </CRow>

    </CContainer>
  );
};

export default memo(Auditor);
