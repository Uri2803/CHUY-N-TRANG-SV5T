import React from 'react'
import {
  CButton,
} from '@coreui/react'
import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import UserApi from '../../api/Achievement/userApi'
import { setUser } from '../../redux/user'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { setUnAuthorized } from '../../redux/unAuthorized'

const TheHeaderDropdown = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const handleLogout = async () => {
    try {
      await UserApi.logout()
      dispatch(setUser({ name: '' }))
      dispatch(setUnAuthorized(false))
      history.push('/login')
    } catch (error: any) {
      if ([401, 409].includes(error?.response?.status)) {
        dispatch(setUnAuthorized(false))
        history.push('/login')
      }
      console.log(error.message)
    }
  }
  return (
    <CButton
      color='light'
      className='d-flex justify-content-center align-items-center'
      onClick={handleLogout}>
      Đăng xuất
      <CIcon size='sm' className='ml-1' content={freeSet.cilAccountLogout} />
    </CButton>
  )
}

export default TheHeaderDropdown
