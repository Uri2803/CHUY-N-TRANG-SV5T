import {
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { AuditorForAchievement } from '../../../../types/Auditor'
import AuditorApi from '../../../../api/Achievement/auditorApi'
import { RootState } from '../../../../store'
import { useSelector } from 'react-redux'
import SubmissionUsers from './Test'

const AuditorFinal = (props: any) => {
  const { id: achievementId, mssv: mssvParam } = props?.match?.params
  const [users, setUsers] = useState<AuditorForAchievement[]>([])
  const [textInfo, setTextInfo] = useState<String>('')

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

  return (
    <>
      <div className='d-flex justify-content-center'>{textInfo}</div>
      <CTabs activeTab={userId}>
        <CNav variant='pills' className='d-flex align-items-center'>
          {users.map((user) => {
            return (
              <CNavItem key={user.id}>
                <CNavLink>
                  {user.id === userId ? 'Bài duyệt' : user.name}
                </CNavLink>
              </CNavItem>
            )
          })}
        </CNav>
        <CTabContent>
          {users.map((user) => {
            if (user.id === userId) {
              return (
                <CTabPane key={user.id}>
                  <SubmissionUsers
                    // isFinal={true}
                    auditorId={user.id}
                    achievementId={achievementId}
                    mssvProp={mssvParam}
                  />
                </CTabPane>
              )
            } else {
              return (
                <CTabPane key={user.id}>
                  <SubmissionUsers
                    achievementId={achievementId}
                    auditorId={user.id}
                    mssvProp={mssvParam}
                  />
                </CTabPane>
              )
            }
          })}
        </CTabContent>
      </CTabs>
    </>
  )
}

export default AuditorFinal
