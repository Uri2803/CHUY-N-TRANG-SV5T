import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
} from "@coreui/react";
import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Criteria } from "../../../../types/TieuChi";

const SubCrit = (prop: {
  parentid: number | string;
  item: Criteria;
  onDelClk: (id: number | string) => void;
  onModClk: (item: Criteria, parentId: string | number) => void;
}) => {
  const [collapse, setCollapse] = useState(false);
  const toggle = (e: any) => {
    setCollapse(!collapse);
    e.preventDefault();
  };

  const well = {
    boxShadow: "0px 4px 4px 4px rgba(23,28,255,0.24)",
  };
  return (
    <CContainer>
      <CCol>
        <CCard style={well}>
          <CCardHeader
            onClick={(e) => {
              toggle(e);
            }}
            color="light"
          >
            <CContainer>
              <CRow>
                <CCol md="10">
                  <strong>{prop.item.name.toLocaleUpperCase()}</strong>
                </CCol>
                <CCol
                  md="2"
                  className="d-flex justify-content-center align-items-center"
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
            </CContainer>
          </CCardHeader>

          <CCardBody>
            <div className="information-display">
              {prop.item.method === "point" ? (
                <ul>
                  <li>Loại tiêu chí: Thang điểm</li>
                  {prop.item.upperSign !== "" ? (
                    prop.item.upperPoint > prop.item.lowerPoint ? (
                      <li>
                        {" "}
                        Điều kiện : {prop.item.lowerSign} {prop.item.upperPoint}{" "}
                        Và {prop.item.upperSign} {prop.item.lowerPoint}
                      </li>
                    ) : (
                      <li>
                        {" "}
                        Điều kiện : {prop.item.lowerSign} {prop.item.lowerPoint}{" "}
                        Hoặc {prop.item.upperSign} {prop.item.upperPoint}
                      </li>
                    )
                  ) : (
                    <>
                      <li>
                        Điều kiện: {prop.item.lowerSign} {prop.item.lowerPoint}
                      </li>
                    </>
                  )}
                  {prop.item.content !== "" ? (
                    <li>Nội dung: {prop.item.content}</li>
                  ) : (
                    <></>
                  )}
                  {prop.item.note !== "" ? (
                    <li>Ghi chú: {prop.item.note}</li>
                  ) : (
                    <></>
                  )}
                </ul>
              ) : prop.item.method === "binary" ? (
                <ul>
                  <li>Loại tiêu chí: Nhị phân</li>
                  {prop.item.content !== "" ? (
                    <li>Nội dung: {prop.item.content}</li>
                  ) : (
                    <></>
                  )}
                  {prop.item.note !== "" ? (
                    <li>Ghi chú: {prop.item.note}</li>
                  ) : (
                    <></>
                  )}
                </ul>
              ) : prop.item.method === "comment" ? (
                <ul>
                  <li>Loại tiêu chí: Người nộp tự nhận xét</li>
                  {prop.item.content !== "" ? (
                    <li>Nội dung: {prop.item.content}</li>
                  ) : (
                    <></>
                  )}
                  {prop.item.note !== "" ? (
                    <li>Ghi chú: {prop.item.note}</li>
                  ) : (
                    <></>
                  )}
                </ul>
              ) : (
                <ul>
                  <li>Loại tiêu chí: Dạng danh sách</li>
                  <li>Danh sách phần tử: {prop.item.valueListString}</li>
                  {prop.item.content !== "" ? (
                    <li>Nội dung: {prop.item.content}</li>
                  ) : (
                    <></>
                  )}
                  {prop.item.note !== "" ? (
                    <li>Ghi chú: {prop.item.note}</li>
                  ) : (
                    <></>
                  )}
                </ul>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CContainer>
  );
};

export default SubCrit;
