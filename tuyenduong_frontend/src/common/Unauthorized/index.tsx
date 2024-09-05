import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/user'
import UserApi from '../../api/Achievement/userApi'
import { RootState } from '../../store'
import { useHistory } from 'react-router'
import { CAlert, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import achievementApi from '../../api/Achievement/achievementApi'
import { setAchievementSideBar } from '../../redux/achievementSideBar'
import { setUnAuthorized } from '../../redux/unAuthorized'

const UnAuthorized = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const unAuthorized = useSelector((state: RootState) => state.unAuthorized)

  async function getSidebar() {
    try {
      const { count } = await achievementApi.getAllWithFilter(
        { limit: 10, page: 1, search: '' },
        true
      )
      if (count) dispatch(setAchievementSideBar(count))
    } catch (error) {
      console.error(error)
    }
  }
  async function getRefreshToken() {
    try {
      const userRefresh : any = await UserApi.refreshToken()
      dispatch(setUser(userRefresh))
      dispatch(setUnAuthorized(false))
      getSidebar()
      switch (userRefresh.role) {
        case 'participant':
          history.push('/thong-tin')
          break;
        case 'manager':
          history.push('/thong-tin-can-bo')
          break;
          case 'admin':
          history.push('/thong-tin-can-bo')
          break;
      
        default:
          history.push('/login')
          break;
        }
    } catch (error: any) {
      if ([401,409].includes(error?.response?.status) ) {
        dispatch(setUser({ name: '' }))
        dispatch(setUnAuthorized(false))
        history.push('login')
      }
      console.log(error.message)
    }
  }

  return (
    <>
      {unAuthorized && (
        <CAlert
          show={true}
          className='d-flex justify-content-center align-items-center'
          color='danger'>
          <CIcon size='xl' className='mr-1' content={freeSet.cilWarning} />
          Có thể phiên đăng nhập của bạn hết hạn!!!.Bạn vui lòng
          <CIcon
            size='xl'
            className='mr-1 ml-1'
            content={freeSet.cilHandPointRight}
          />
          <CButton color='info' className='mr-1 ml-1' onClick={getRefreshToken}>
            <CIcon size='sm' className='mr-1' content={freeSet.cilReload} />
            Cập nhật phiên mới
          </CButton>
        </CAlert>
      )}
    </>
  )
}

export default UnAuthorized
