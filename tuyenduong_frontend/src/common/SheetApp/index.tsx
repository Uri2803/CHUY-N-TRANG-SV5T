import { cilWarning } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CAlert } from '@coreui/react'
import React, { useState } from 'react'
import XLSX from 'xlsx'
import DataInput from './components/DataInput'
import DragDropFile from './components/DragDropFile'

type Props = {
  handleSubmitFile: (data: any[]) => void
}

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

const SheetApp: React.FC<Props> = ({ handleSubmitFile }) => {
  const [showAlert, setShowAlert] = useState(false)
  const handleFile = (file: any) => {
    try {
      const fileTail = file.name.split('.').pop()
      if (SheetJSFT.includes(fileTail)) {
        // /* Boilerplate to set up FileReader */
        const reader = new FileReader()
        const rABS = !!reader.readAsBinaryString
        reader.onload = (e: any) => {
          /* Parse data */
          const bstr = e.target.result
          const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' })
          /* Format data */
          const data = Object.values(wb.SheetNames).map((name) =>
            XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1 })
          )
          handleSubmitFile(data)
        }
        if (rABS) reader.readAsBinaryString(file)
        else reader.readAsArrayBuffer(file)
      } else {
        setShowAlert(true)
        setTimeout(() => {
          setShowAlert(false)
        }, 5000);
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {showAlert ? (
        <CAlert
          color='warning'
          className='d-flex align-items-center'
          closeButton>
          <CIcon
            content={cilWarning}
            className='flex-shrink-0 me-2'
            width={24}
            height={24}
          />

          <div> File không đúng định dạng</div>
        </CAlert>
      ) : undefined}
      <DragDropFile handleFile={handleFile}>
            <DataInput handleFile={handleFile} />
      </DragDropFile>
    </>
  )
}

export default SheetApp
