import React, { FC, ChangeEvent } from 'react'

const SheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'xml',
  'csv',
  'txt',
  'ods',
  'fods',
  'uos',
  'sylk',
  'dif',
  'dbf',
  'prn',
  'qpw',
  '123',
  'wb*',
  'wq*',
  'html',
  'htm',
]
  .map(function (x) {
    return '.' + x
  })
  .join(',')

type Props = {
  handleFile: (file: any) => void
}

const labelStyle = {
  cursor: 'pointer',
  padding: '10px 15px',
  backgroundColor: '#39f',
  borderRadius: '5px',
  color: 'white',
}

const DataInput: FC<Props> = ({ handleFile }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) handleFile(files[0])
  }
  return (
    <form className='form-inline'>
      <div className='form-group'>
        <label style={labelStyle} htmlFor='file'>
          Nhập file
        </label>
        <input
          type='file'
          style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
          className='form-control'
          id='file'
          accept={SheetJSFT}
          onChange={handleChange}
        />
      </div>
    </form>
  )
}

export default DataInput
