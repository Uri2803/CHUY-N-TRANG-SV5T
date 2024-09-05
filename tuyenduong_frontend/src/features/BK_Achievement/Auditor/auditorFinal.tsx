import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CTooltip,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { AuditorForAchievement } from '../../../types/Auditor'
import AuditorApi from '../../../api/Achievement/auditorApi'
import achievementApi from '../../../api/Achievement/achievementApi'
import { RootState } from '../../../store'
import { useSelector } from 'react-redux'
import SubmissionUsers from './components/submissionUsers'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import UserApi from '../../../api/Achievement/userApi'
import { useHistory } from 'react-router-dom'

const AuditorFinal = (props: any) => {
  const { achievementId } = props
  const [users, setUsers] = useState<AuditorForAchievement[]>([])
  const [textInfo, setTextInfo] = useState<String>('')
  const [textError, setTextError] = useState('')
  const [typeObject, setTypeObject] = useState<String>('ACHIEVEMENT')
  const [lockModal, setLockModal] = useState(false)
  const [powerModal, setPowerModal] = useState(false)
  const [lock, setLock] = useState<boolean>()
  const [lockForever, setLockForever] = useState<boolean>(false)
  const history = useHistory()
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin()
      } catch {
        history.push('/login')
      }
    }
    async function getStatus() {
      const { lock, type } = await achievementApi.get(achievementId)
      setTypeObject(type || 'ACHIEVEMENT')
      if (lock === 'temporary') setLock(true)
      else if (lock === 'forever') setLockForever(true)
      setLock(false)
    }
    verifyLogin()
    getStatus()
  }, [achievementId, history])

  const userId = useSelector((state: RootState) => state.user.id)
  useEffect(() => {
    async function getUsers() {
      try {
        const auditors: AuditorForAchievement[] =
          await AuditorApi.getAuditorsForAchievement(achievementId)
        if (auditors.length === 0) {
          setTextInfo('Chưa phân công người chấm')
        } else {
          const userList = auditors.filter((user) => user.id !== userId)
          const userNew = auditors.find((user) => user.id === userId)
          if (userNew) {
            setUsers([userNew, ...userList])
          } else {
            setUsers(userList)
          }
        }
      } catch (error: any) {
        console.error(error)
      }
    }
    getUsers()
  }, [userId, achievementId])

  useEffect(() => {
    if (!lockModal || !powerModal) setTextError('')
  }, [lockModal, powerModal])

  const handleUnLock = async () => {
    try {
      await achievementApi.setStatus('UNLOCK', achievementId)
      setLock(false)
    } catch (error: any) {
      if (error?.response.data.statusCode === 400)
        setTextError(error?.response.data.message)
      else {
        console.error(error)
      }
    }
  }

  const handleLock = async (status: string) => {
    try {
      if (status === 'TEMPORARY') {
        await achievementApi.setStatus(status, achievementId)
        setLock(true)
        setLockModal(false)
      } else if (status === 'FOREVER') {
        const result = await achievementApi.setStatus(status, achievementId)
        if (result) setLockForever(true)
        setPowerModal(false)
      }
    } catch (error: any) {
      if (error?.response.data.statusCode === 400)
        setTextError(error?.response.data.message)
      else {
        console.error(error)
      }
    }
  }

  return (
    <>
      <div className='d-flex justify-content-center'>{textInfo}</div>
      <CTabs>
        <CNav variant='tabs' className='d-flex align-items-center'>
          {users.map((user) => {
            return (
              <CNavItem key={user.id}>
                <CNavLink>
                  {user.id === userId ? 'Bài duyệt' : user.name}
                </CNavLink>
              </CNavItem>
            )
          })}
          {lockForever ||
            (lock ? (
              <>
                <CTooltip content={`Khóa tạm thời`}>
                  <CButton
                    size='sm'
                    className='ml-1'
                    color='secondary'
                    onClick={handleUnLock}>
                    <CIcon size='lg' content={freeSet.cilLockLocked} />
                  </CButton>
                </CTooltip>
              </>
            ) : (
              <CTooltip content={`Khóa đang mở`}>
                <CButton
                  className='ml-1'
                  size='sm'
                  color='secondary'
                  onClick={() => setLockModal(true)}>
                  <CIcon size='lg' content={freeSet.cilLockUnlocked} />
                </CButton>
              </CTooltip>
            ))}
          {lockForever ? undefined : (
            <CTooltip content={`Kết thúc thẩm định hồ sơ`}>
              <CButton
                style={{ marginLeft: 'auto', cursor: 'pointer' }}
                size='sm'
                color='danger'
                onClick={() => setPowerModal(true)}>
                <CIcon size='lg' content={freeSet.cilPowerStandby} />
              </CButton>
            </CTooltip>
          )}
        </CNav>
        <CTabContent>
          {users.map((user) => {
            if (user.id === userId) {
              return (
                <CTabPane key={user.id}>
                  <SubmissionUsers
                    typeOb={typeObject}
                    isFinal={true}
                    lockForever={lockForever}
                    achievementId={achievementId}
                    seen={false}
                  />
                </CTabPane>
              )
            } else {
              return (
                <CTabPane key={user.id}>
                  <SubmissionUsers
                    typeOb={typeObject}
                    achievementId={achievementId}
                    auditorId={user.id}
                    seen={false}
                  />
                </CTabPane>
              )
            }
          })}
        </CTabContent>
      </CTabs>
      <CModal
        show={lockModal}
        className='mt-5'
        onClose={() => setLockModal(false)}
        color='warning'>
        <CModalHeader closeButton>
          <CModalTitle>Khóa tạm thời</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div style={{ color: 'red', marginBottom: '10px' }}>{textError}</div>
          Thành viên hội đồng thẩm định hồ sơ sẽ <b>
            {' '}
            không thể thẩm định hồ sơ{' '}
          </b>{' '}
          cho tới khi khóa được mở
        </CModalBody>

        <CModalFooter>
          <CButton color='info' onClick={() => handleLock('TEMPORARY')}>
            Xác nhận
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        show={powerModal}
        className='mt-5'
        onClose={() => setPowerModal(false)}
        color='danger'>
        <CModalHeader closeButton>
          <CModalTitle>Kết thúc thẩm định hồ sơ</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div style={{ color: 'red', marginBottom: '10px' }}>{textError}</div>
          Thẩm định hồ sơ sẽ <b> kết thúc ngay lập tức </b>
        </CModalBody>

        <CModalFooter>
          <CButton color='info' onClick={() => handleLock('FOREVER')}>
            Xác nhận
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AuditorFinal
