import { CCol, CRow } from "@coreui/react";

import SubCrit from "../components/SubCrit";
import { Criteria } from "../../../../types/TieuChi";

import FileData from "../../../../types/FileData";

import { Submission } from "../../../../types/Submission";
import MainCrit from "./MainCrit";

const MainSubmission = (prop: {
  typeOb : string;
  mainCrit: Criteria;
  submitData: Submission[];
  onAddFileToSave: (f: FileData) => void;
  cancelSubmit: () => void;
  activateSubmit: () => void;
  onShowClicked: (fileName: string) => void;
  onPreviewClk: (s: string) => void;
}) => {
  return (
    <div style={{ width: '100%' }}>
      {/* <CCardHeader style={{ display: "inline", verticalAlign: "center" }}>
          <CContainer>
            <CRow>
              <CCol lg="8" className="py-1 d-flex align-items-center">
                {prop.mainCrit.name.toLocaleUpperCase()}
              </CCol>
              <CCol sm="4" className="py-1"></CCol>
            </CRow>
          </CContainer>
        </CCardHeader> */}
      <CRow>
        <CCol xl='12' className='pb-1'>
          <strong>
            Người nộp phải phù hợp với{' '}
            {prop.mainCrit.soft === prop.mainCrit.children.length
              ? 'tất cả các tiêu chí sau'
              : 'ít nhất ' +
                prop.mainCrit.soft.toString() +
                ' trong các tiêu chí sau'}
          </strong>
        </CCol>
      </CRow>
      {prop.mainCrit.note !== '' ? (
        <CRow>
          <CCol xl='12' className='pb-1'>
            <strong>
              <span style={{ color: 'red' }}>*</span>Lưu ý: {prop.mainCrit.note}
            </strong>
          </CCol>
        </CRow>
      ) : (
        <></>
      )}
      {prop.mainCrit.children.length > 0 ? (
        prop.mainCrit.children.map((item) =>
          item.isCriteria === false ? (
            <MainCrit
              typeOb={prop.typeOb}
              key={item.id}
              parentid={prop.mainCrit.id}
              item={item}
              submitData={prop.submitData}
              cancelSubmit={prop.cancelSubmit}
              activateSubmit={prop.activateSubmit}
              onShowClk={prop.onShowClicked}
              addSaveFile={prop.onAddFileToSave}
              onPreviewClk={prop.onPreviewClk}
            />
          ) : (
            <SubCrit
              typeOb={prop.typeOb}
              key={item.id}
              parentid={prop.mainCrit.id}
              item={item}
              submitData={prop.submitData}
              cancelSubmit={prop.cancelSubmit}
              activateSubmit={prop.activateSubmit}
              onShowClk={prop.onShowClicked}
              addSaveFile={prop.onAddFileToSave}
              onPreviewClk={prop.onPreviewClk}
            />
          )
        )
      ) : prop.mainCrit.isCriteria === false ? (
        <MainCrit
          typeOb={prop.typeOb}
          key={prop.mainCrit.id}
          parentid={prop.mainCrit.id}
          item={prop.mainCrit}
          submitData={prop.submitData}
          cancelSubmit={prop.cancelSubmit}
          activateSubmit={prop.activateSubmit}
          onShowClk={prop.onShowClicked}
          addSaveFile={prop.onAddFileToSave}
          onPreviewClk={prop.onPreviewClk}
        />
      ) : (
        <SubCrit
          typeOb={prop.typeOb}
          key={prop.mainCrit.id}
          parentid={prop.mainCrit.id}
          item={prop.mainCrit}
          submitData={prop.submitData}
          cancelSubmit={prop.cancelSubmit}
          activateSubmit={prop.activateSubmit}
          onShowClk={prop.onShowClicked}
          addSaveFile={prop.onAddFileToSave}
          onPreviewClk={prop.onPreviewClk}
        />
      )}
    </div>
  )
};

export default MainSubmission;
