import * as React from 'react'
import { Formik, Form, FastField } from 'formik'
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
import CinputField from '../../../../common/input/CInput'
import * as yup from 'yup'
import DepartmentApi from '../../../../api/Achievement/departmentApi'

let validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Bắt buộc nhập')
    .min(2, 'tối thiểu 2 ký tự')
    .max(150, 'tối thiểu 150 ký tự'),
  code: yup
    .string()
    .required('Bắt buộc nhập')
    .min(2, 'tối thiểu 2 ký tự')
    .max(150, 'tối thiểu 150 ký tự'),
})

interface MyFormValues {
  name: string
  code: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  isAdd: boolean
  onAddDepartment: (value: any) => void
  onUpdateDepartment: (value: any) => void
  value: { id: number; code: string; name: string }
}

export const FormAddDepartment: React.FC<Props> = ({
  isOpen,
  onClose,
  isAdd,
  onAddDepartment,
  onUpdateDepartment,
  value,
}) => {
  const [textError, setTextError] = React.useState('')
  const [initialValues, setInitialValues] = React.useState<MyFormValues>({
    code: value.code,
    name: value.name,
  })

  React.useEffect(() => {
    if (!isOpen) setTextError('')
  }, [isOpen])

  React.useEffect(() => {
    setInitialValues({
      code: value.code,
      name: value.name,
    })
  }, [value])

  const handleOnSubmit = async (values: any, actions: any) => {
    try {
      if (isAdd) {
        const newDepartment = await DepartmentApi.createDepartment({
          code: values.code,
          name: values.name,
        })
        onAddDepartment(newDepartment)
      } else {
        const updateDepartment = await DepartmentApi.updateDepartment(
          value.id,
          {
            code: values.code,
            name: values.name,
          }
        )
        onUpdateDepartment(updateDepartment)
      }

      // end logic submit form
      onClose()
      actions.resetForm()
      actions.setSubmitting(false)
    } catch (error: any) {
      if (error?.response.data.statusCode === 400) {
        setTextError(error?.response.data.message)
      } else {
        console.error(error)
      }
    }
  }
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal show={isOpen} size='lg' color='info' onClosed={onClose}>
            <CModalHeader closeButton>
              <CModalTitle>
                {isAdd ? 'Thêm đơn vị' : 'Cập nhập đơn vị'}
              </CModalTitle>
            </CModalHeader>
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleOnSubmit}>
              {(formikProps) => {
                return (
                  <Form>
                    <CModalBody>
                      <CRow>
                        <CCol style={{ color: 'red' }} sm='12'>
                          {textError}
                        </CCol>
                        <CCol sm='3'>
                          <FastField
                            name='code'
                            component={CinputField}
                            placeholder='CK,...'
                            label='Mã đơn vị'
                          />
                        </CCol>

                        <CCol sm='9'>
                          <FastField
                            name='name'
                            component={CinputField}
                            placeholder='Cơ Khí,...'
                            label='Tên đơn vị'
                          />
                        </CCol>
                      </CRow>
                    </CModalBody>
                    <CModalFooter>
                      <CButton color='secondary' onClick={onClose}>
                        Hủy bỏ
                      </CButton>
                      <CButton
                        color='info'
                        type='submit'
                        disabled={
                          !formikProps.isValid || formikProps.isSubmitting
                        }
                        onDoubleClick={(e) => e.preventDefault()}>
                        Xác nhận
                      </CButton>
                    </CModalFooter>
                  </Form>
                )
              }}
            </Formik>
          </CModal>
        </CCardBody>
      </CCol>
    </CRow>
  )
}
