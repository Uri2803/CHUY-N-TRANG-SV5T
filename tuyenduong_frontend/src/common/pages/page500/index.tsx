import React from "react";
import {
  CCol,
  CContainer,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";

const Page500 = () => {
  return (
    <div className='c-app c-default-layout flex-row align-items-center'>
      <CContainer>
        <CRow className='justify-content-center'>
          <CCol md='6'>
            <span className='clearfix'>
              <h1 className='float-left display-3 mr-4'>401</h1>
              <h4 className='pt-3'>
                <CIcon size='xl' className='mr-1' content={freeSet.cilWarning} />
                Lỗi xảy ra
              </h4>
              <p className='text-muted float-left'>
                Trang bạn tìm kiếm hiện không truy cập được
              </p>
            </span>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
};

export default Page500;
