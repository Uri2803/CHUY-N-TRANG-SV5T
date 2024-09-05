import React, { useState, useRef } from 'react'
import { CInput } from '@coreui/react'

type props = {
  onSubmit: (form: any) => void
}

const InputSearch: React.FC<props> = ({ onSubmit }) => {
  const [value, setValue] = useState('')
  const typingTimeoutRef = useRef<any>(null)

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueInput = e.target.value
    setValue(e.target.value)
    if (!onSubmit) return

    if(typingTimeoutRef.current){
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      const formValue = {
        text: valueInput,
      }
      onSubmit(formValue)
    }, 500)
  }

  return (
    <CInput value={value} placeholder='Tìm kiếm...' onChange={handleOnchange} />
  )
}

export default InputSearch
