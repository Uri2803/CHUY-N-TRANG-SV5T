import React, { useEffect, useState } from 'react'
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
} from '@coreui/react'

const Modal = (props: any) => {
  const { isOpen, handleClose, children, title, handleSubmit,btnSubmit,colorBtnSubmit } = props
  const [open, setOpen] = useState(false)
  useEffect(() => {setOpen(isOpen)}, [isOpen])

  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal
            show={open}
            onClose={() => {
              handleClose()
              setOpen(!open)
            }}
            color={colorBtnSubmit}>
            <CModalHeader closeButton>
              <CModalTitle>{title}</CModalTitle>
            </CModalHeader>
            <CModalBody>{children}</CModalBody>
            <CModalFooter>
              <CButton
                color='secondary'
                onClick={() => {
                  handleClose()
                  setOpen(!open)
                }}>
                Hủy bỏ
              </CButton>
              <CButton color={colorBtnSubmit} onClick={handleSubmit}>
                {btnSubmit}
              </CButton>{' '}
            </CModalFooter>
          </CModal>
        </CCardBody>
      </CCol>
    </CRow>
  )
}

export default Modal
