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
import CinputField from '../../common/input/CInput'
import * as yup from 'yup'
import CselectField from '../../common/input/Cselect'

import { v4 as uuid } from 'uuid'

let validationSchema = yup.object().shape({
  isCriteria: yup.string(),
  name: yup
    .string()
    .required('Bắt buộc nhập')
    .min(5, 'tối thiểu 5 ký tự')
    .max(150, 'tối thiểu 150 ký tự'),
  method: yup.string().when('isCriteria', {
    is: 'true',
    then: yup.string().required(),
  }),
})

interface MyFormValues {
  name: string
  isCriteria: string
  point: number
}

export const FormCriteria = (props: any) => {
  const { isOpen, onClose, onSubmit, parentId, item, onAddSuccess, cNumber } =
    props
  const [initialValues, setInitialValues] = React.useState<MyFormValues>({
    name: '',
    isCriteria: '',
    point: 0,
  })
  React.useEffect(() => {
    if (item !== undefined) {
      setInitialValues({
        name: item.name,
        isCriteria: item.isCriteria ? 'true' : 'false',
        point: item.point,
      })
    }
  }, [item])
  const handleFormatData = (values: any) => {
    const point = Number(values.point)
    const isCriteria: boolean = values.isCriteria === 'true' ? true : false
    const id = uuid()
    return {
      parentId: parentId,
      item: {
        ...values,
        point,
        id,
        isCriteria,
        soft: 0,
        children: [],
      },
    }
  }

  const handleOnSubmit = async (values: any, actions: any) => {
    // start logic submit form
    const Criteria = handleFormatData(values)
    onSubmit(Criteria)

    if (parentId === 0) {
      onAddSuccess('0', 1)
    } else {
      onAddSuccess(parentId, cNumber + 1)
    }
    // end logic submit form
    actions.resetForm()
    actions.setSubmitting(false)
    onClose()
  }
  return (
    <CRow>
      <CCol>
        <CCardBody>
          <CModal show={isOpen} size='lg' color='info' onClosed={onClose}>
            <CModalHeader closeButton>
              <CModalTitle>Thêm tiêu chí</CModalTitle>
            </CModalHeader>
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={handleOnSubmit}>
              {(formikProps) => {
                const { values } = formikProps
                return (
                  <Form>
                    <CModalBody>
                      <FastField
                        name='isCriteria'
                        component={CselectField}
                        values={[
                          { value: '', name: 'Vui lòng chọn' },
                          { value: 'true', name: 'Tiêu chí' },
                          { value: 'false', name: 'Tập tiêu chí' },
                        ]}
                        label='Loại tiêu chí'
                      />
                      {values.isCriteria !== '' && (
                        <>
                          <FastField
                            name='name'
                            component={CinputField}
                            placeholder='Danh hiệu sinh viên 5 tốt'
                            label='Tên tiêu chí'
                          />
                          <FastField
                            name='point'
                            component={CinputField}
                            label='Nhập số điểm'
                            placeholder='0,1,,2...'
                          />
                        </>
                      )}
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
