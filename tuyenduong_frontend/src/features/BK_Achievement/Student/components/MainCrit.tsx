import {
  CContainer,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CCollapse,
  CRow,
} from "@coreui/react";
import React, { useState } from "react";

import SubCrit from "./SubCrit";

import { Criteria } from "../../../../types/TieuChi";

import { Submission } from "../../../../types/Submission";
import FileData from "../../../../types/FileData";

const MainCrit = (prop: {
  typeOb : string;
  parentid: number | string;
  item: Criteria;
  submitData: Submission[];
  cancelSubmit: () => void;
  activateSubmit: () => void;
  onShowClk: (s: string) => void;
  addSaveFile: (f: FileData) => void;
  onPreviewClk: (s: string) => void;
}) => {
  const [collapse, setCollapse] = useState(true);
  // useEffect(() => {
  // }, [prop.submitData]);
  const toggle = (e: any) => {
    setCollapse(!collapse);
    e.preventDefault();
  };

  return (
    <CCol className='px-0'>
      <CCard>
        <CCardHeader
          style={{
            cursor: 'pointer',
          }}
          color='secondary'
          onClick={(e) => {
            toggle(e)
          }}>
          <CRow>
            <CCol md='auto' className='pb-2'>
              <strong> {prop.item.name.toLocaleUpperCase()} </strong>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCollapse show={collapse}>
          <CCardBody>
            <CContainer>
              <CRow>
                <CCol lg='12' className='px-0 pb-2 d-flex align-items-center'>
                  <strong>
                    {prop.item.children.length > 0 ? (
                      prop.item.children.length === 1 ? (
                        <>
                          Người nộp phải phù hợp với tất cả những điều sau đây
                        </>
                      ) : prop.item.soft !== prop.item.children.length ? (
                        <>
                          Người nộp phải phù hợp với ít nhất {prop.item.soft}{' '}
                          trong những điều sau đây
                        </>
                      ) : (
                        <>
                          Người nộp phải phù hợp với tất cả những điều sau đây
                        </>
                      )
                    ) : (
                      <>Không</>
                    )}
                  </strong>
                </CCol>
              </CRow>
              {prop.item.note !== '' ? (
                <CRow>
                  <CCol xl='12' className='pb-1'>
                    <span style={{ color: 'red' }}>*</span>Lưu ý:{' '}
                    {prop.item.note}
                  </CCol>
                </CRow>
              ) : (
                <></>
              )}
            </CContainer>
            <div>
              {prop.item.children.filter(
                (subItem) => subItem.isCriteria === true
              ).length > 0 ? (
                <div>
                  <div>
                    {prop.item.children
                      .filter((subItem) => subItem.isCriteria === true)
                      .map((subItem) => (
                        <SubCrit
                          typeOb={prop.typeOb}
                          key={subItem.id}
                          parentid={prop.item.id}
                          item={subItem}
                          submitData={prop.submitData}
                          cancelSubmit={prop.cancelSubmit}
                          activateSubmit={prop.activateSubmit}
                          onShowClk={prop.onShowClk}
                          addSaveFile={prop.addSaveFile}
                          onPreviewClk={prop.onPreviewClk}
                        />
                      ))}
                  </div>
                </div>
              ) : (
                <></>
              )}
              {
                <div className='sub-crit-container'>
                  <div>
                    {prop.item.children.length > 0 ? (
                      prop.item.children
                        .filter((subItem) => subItem.isCriteria === false)
                        .map((subItem) => (
                          <MainCrit
                            typeOb={prop.typeOb}
                            key={subItem.id}
                            parentid={prop.item.id}
                            item={subItem}
                            submitData={prop.submitData}
                            cancelSubmit={prop.cancelSubmit}
                            activateSubmit={prop.activateSubmit}
                            onShowClk={prop.onShowClk}
                            addSaveFile={prop.addSaveFile}
                            onPreviewClk={prop.onPreviewClk}
                          />
                        ))
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              }
            </div>
          </CCardBody>
        </CCollapse>
      </CCard>
    </CCol>
  )
};

export default MainCrit;
