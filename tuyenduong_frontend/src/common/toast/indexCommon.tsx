import { CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'
import React from 'react'
import { FaCheck } from 'react-icons/fa'

type Props = {
  title: string
  content: string
  timer: number
}

const Toaster: React.FC<Props> = ({ title, content, timer }) => {
  return (
    <CToaster position='top-right'>
      <CToast title={title} autohide={timer} show={true}>
        <CToastHeader>
          <strong className='me-auto'>{title}</strong>
        </CToastHeader>
        <CToastBody
          style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <FaCheck color={'green'} />
          {content}
        </CToastBody>
      </CToast>
    </CToaster>
  )
}

export default Toaster
