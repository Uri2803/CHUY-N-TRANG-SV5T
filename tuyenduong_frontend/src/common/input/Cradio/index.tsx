import { CFormGroup, CInputRadio, CLabel } from '@coreui/react'
import React from 'react'

const CradioField = (props: any) => {
  const { field, label, values } = props
  const { name, value } = field

  return (
    <CFormGroup>
      <CLabel htmlFor={name}>
        {label}
      </CLabel>
      {values.map((item: { value: string; name: string }, index: number) => (
        <CFormGroup className='ml-3' variant='custom-radio' inline>
          <CInputRadio
            custom
            checked={item.value === value}
            key={index.toString()}
            id={index.toString()}
            {...field}
            value={item.value}
          />
          <CLabel variant='custom-checkbox' htmlFor={index.toString()}>
            {item.name}
          </CLabel>
        </CFormGroup>
      ))}
    </CFormGroup>
  )
}

CradioField.propTypes = {}

export default CradioField
