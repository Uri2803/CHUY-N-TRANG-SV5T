import { CFormGroup, CInput, CLabel } from '@coreui/react'
import React from 'react'

const CinputField = (props: any) => {
  const {
    field,
    form,
    label,
    placeholder,
    type = 'text',
    disabled = false,
    required,
    bold,
  } = props
  const { name } = field
  const { errors, touched } = form
  const showError: boolean = !!(errors[name] && touched[name])

  return (
    <CFormGroup>
      <CLabel htmlFor={name}>
        {bold ? (
          <div>
            <b>{label}</b> <span style={{ color: 'red' }}>{required}</span>
          </div>
        ) : (
          <div>
            {label} <span style={{ color: 'red' }}>{required}</span>
          </div>
        )}
      </CLabel>
      <CInput
        id={name}
        {...field}
        invalid={showError && true}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
      />
      <p style={{ color: 'red' }}>{showError && errors[name]}</p>
    </CFormGroup>
  )
}

CinputField.propTypes = {}

export default CinputField
