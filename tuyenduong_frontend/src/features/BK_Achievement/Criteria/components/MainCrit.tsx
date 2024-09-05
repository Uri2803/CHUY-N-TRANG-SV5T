import {
  CContainer,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CCollapse,
  CButton,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import SubCrit from "./SubCrit";

import { Criteria } from "../../../../types/TieuChi";

import { FaTrash, FaEdit } from "react-icons/fa";

import { updateSoft } from "../../../../redux/TieuChi";

const MainCrit = (prop: {
  parentid: number | string;
  item: Criteria;
  onAddClk: (id: number | string, n: number) => void;
  onDelClk: (id: number | string) => void;
  onModClk: (item: Criteria, parentId: string | number) => void;
  cancelSubmit: () => void;
  activateSubmit: () => void;
}) => {
  const [collapse, setCollapse] = useState(false);

  const [numSoftOption, setNumSoftOption] = useState(
    prop.item.soft !== prop.item.children.length ? "atleast" : "all"
  );

  const [achivementNumOfSoft, setAchievementNumOfSoft] = useState(
    prop.item.soft.toString()
  );
  // const [achNumError, setAchNumError] = useState("");

  const dispatch = useDispatch();

  const toggle = (e: any) => {
    setCollapse(!collapse);
    e.preventDefault();
  };
  useEffect(() => {
    setAchievementNumOfSoft(prop.item.soft.toString());
  }, [prop.item.soft]);

  return (
    <CContainer fluid>
      <CCol>
        <CCard>
          <CCardHeader
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              toggle(e);
            }}
            color="light"
          >
            <CRow>
              <CCol md="10" className="pr-0">
                <strong>{prop.item.name.toLocaleUpperCase()}</strong>
              </CCol>
              <CCol
                md="2"
                className="pl-0 d-flex justify-content-center align-items-center"
              >
                <FaTrash
                  onClick={() => prop.onDelClk(prop.item.id)}
                  className="mx-1"
                />
                <FaEdit
                  onClick={() => prop.onModClk(prop.item, prop.parentid)}
                />
              </CCol>
            </CRow>
          </CCardHeader>
          <CCollapse show={collapse}>
            <CCardBody>
              <CContainer>
                <CRow className="px-3 ml-3 py-1 d-flex align-items-center">
                  {prop.item.children.length > 0 ? (
                    prop.item.children.length === 1 ? (
                      <CCol xl="12 px-0">
                        Người nộp phải phù hợp với tất cả những điều sau đây
                      </CCol>
                    ) : (
                      <>
                        <CCol md="auto" className="px-0">
                          Người nộp phải phù hợp với
                        </CCol>
                        <CCol md="auto" className="px-3">
                          <select
                            value={numSoftOption}
                            placeholder={"placeholder"}
                            className="form-control "
                            onChange={(event) => {
                              setNumSoftOption(event.target.value);
                              if (event.target.value === "all") {
                                const payload = {
                                  critId: prop.item.id,
                                  soft: prop.item.children.length,
                                };
                                dispatch(updateSoft(payload));
                              }
                            }}
                          >
                            <option value="all">tất cả</option>
                            <option value="atleast">ít nhất</option>
                          </select>
                        </CCol>
                        {numSoftOption === "atleast" ? (
                          <>
                            <CCol md="1" className="px-0">
                              <input
                                className="form-control"
                                type="text"
                                value={achivementNumOfSoft}
                                onChange={(e) => {
                                  setAchievementNumOfSoft(e.target.value);
                                  if (
                                    e.target.value === "" ||
                                    isNaN(e.target.value as any)
                                  ) {
                                    prop.cancelSubmit();
                                  } else if (
                                    parseInt(e.target.value) >
                                    prop.item.children.length
                                  ) {
                                    prop.cancelSubmit();
                                  } else {
                                    const payload = {
                                      critId: prop.item.id,
                                      soft: parseInt(e.target.value),
                                    };
                                    dispatch(updateSoft(payload));
                                    prop.activateSubmit();
                                  }
                                }}
                              />
                            </CCol>
                            <CCol md="auto" className="pl-3 pr-1">
                              trong
                            </CCol>
                          </>
                        ) : (
                          <></>
                        )}{" "}
                        <CCol md="auto" className="px-0">
                          những điều sau đây
                        </CCol>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </CRow>
                {isNaN(achivementNumOfSoft as any) ||
                parseInt(achivementNumOfSoft) > prop.item.children.length ? (
                  <CRow>
                    <CCol md="auto" className="px-5 pb-3">
                      {isNaN(achivementNumOfSoft as any) ? (
                        <span style={{ color: "red" }}>
                          Vui lòng nhập số hợp lệ
                        </span>
                      ) : parseInt(achivementNumOfSoft) >
                        prop.item.children.length ? (
                        <span style={{ color: "red" }}>
                          Số không được lớn hơn số tiêu chí con
                        </span>
                      ) : (
                        <></>
                      )}
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
                {prop.item.note !== "" ? (
                  <CRow className="px-3 ml-3 mb-1">
                    <CCol xl="12" className="py-1 px-0">
                      Ghi chú: {prop.item.note}
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
                <div>
                  {prop.item.children.filter(
                    (subItem) => subItem.isCriteria === true
                  ).length > 0 ? (
                    <div className="sub-crit-container">
                      <div>
                        {prop.item.children
                          .filter((subItem) => subItem.isCriteria === true)
                          .map((subItem) => (
                            <SubCrit
                              key={subItem.id}
                              parentid={prop.item.id}
                              item={subItem}
                              onDelClk={prop.onDelClk}
                              onModClk={prop.onModClk}
                            />
                          ))}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  {
                    <div className="sub-crit-container">
                      <div>
                        {prop.item.children.length > 0 ? (
                          prop.item.children
                            .filter((subItem) => subItem.isCriteria === false)
                            .map((subItem) => (
                              <MainCrit
                                key={subItem.id}
                                parentid={prop.item.id}
                                item={subItem}
                                onAddClk={prop.onAddClk}
                                onDelClk={prop.onDelClk}
                                onModClk={prop.onModClk}
                                cancelSubmit={prop.cancelSubmit}
                                activateSubmit={prop.activateSubmit}
                              />
                            ))
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  }
                </div>
                <CRow className="px-3 ml-3 py-1 d-flex align-items-center">
                  <CButton
                    color="info"
                    onClick={() => {
                      prop.onAddClk(prop.item.id, prop.item.children.length);
                    }}
                  >
                    Thêm tiêu chí
                  </CButton>
                </CRow>
              </CContainer>
            </CCardBody>
          </CCollapse>
        </CCard>
      </CCol>
    </CContainer>
  );
};

export default MainCrit;
