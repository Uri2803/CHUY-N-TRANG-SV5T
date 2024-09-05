import { CFormGroup, CInputCheckbox, CLabel } from '@coreui/react'
import React from 'react'

const CcheckboxField = (props: any) => {
  const { field, values } = props
  const {value } = field

  return (
    <CFormGroup>
      {values.map((item: { value: string; name: string }, index: number) => (
        <CFormGroup key={index} variant='checkbox' className='checkbox'>
          <CInputCheckbox
            id={index.toString()}
            key={index.toString()}
            {...field}
            checked={value.includes(item.value)}
            value={item.value}
          />
          <CLabel
            key={item.name}
            variant='checkbox'
            className='form-check-label'
            htmlFor={index.toString()}>
            {item.name}
          </CLabel>
        </CFormGroup>
      ))}
    </CFormGroup>
  )
}

CcheckboxField.propTypes = {}

export default CcheckboxField
