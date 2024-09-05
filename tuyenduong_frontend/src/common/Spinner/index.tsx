import { CSpinner } from '@coreui/react'
import React from 'react'
import './spinner.css'

const Spinner = () => {
  return (
    <div className='Spinner'>
      <CSpinner
        className='elementSpinner'
        color='info'
        style={{ width: '4rem', height: '4rem', marginBottom: '30px' }}
      />
    </div>
  )
}

export default Spinner
