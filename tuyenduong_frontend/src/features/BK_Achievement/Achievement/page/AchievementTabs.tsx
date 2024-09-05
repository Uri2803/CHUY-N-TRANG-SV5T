import { CCard, CCardBody } from '@coreui/react'
import SubmissionUsers from '../../Auditor/components/submissionUsers'
import AuditorFinal from '../../Auditor/auditorFinal'
import { useEffect, useState } from 'react'
import AuditorApi from '../../../../api/Achievement/auditorApi'
import { RootState } from '../../../../store'
import { useSelector } from 'react-redux'

import { roles } from '../../../../common/roles'
import { useHistory } from 'react-router'
import UserApi from '../../../../api/Achievement/userApi'

const AchievementTabs = (props: any) => {
  const achievementId = props.match.params.id
  const [auditor, setAuditor] = useState([])
  const user = useSelector((state: RootState) => state.user)
  const history = useHistory()
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin()
      } catch {
        history.push('/login')
      }
    }
    async function getAuditorForAchievement() {
      try {
        const responses = await AuditorApi.getAuditorsForAchievement(
          achievementId
        )
        setAuditor(responses)
      } catch (error: any) {
        console.error(error.message)
        history.push('/loi-truy-cap')
      }
    }

    if ([roles.MANAGER, roles.PARTICIPANT].includes(user.role)) {
      getAuditorForAchievement()
    } else {
      verifyLogin()
      if (user.id !== 0) {
        history.push('/loi-truy-cap')
      }
    }
  }, [achievementId, user.role, user.id, history])

  return (
    <>
      {[roles.MANAGER, roles.PARTICIPANT].includes(user.role) && (
        <CCard>
          <CCardBody>
            {auditor.map(
              (aud: {
                id: number
                name: string
                email: string
                isFinal: boolean
              }) => {
                if (aud.id === user.id) {
                  if (aud.isFinal) {
                    return (
                      <AuditorFinal
                        key={aud.id}
                        achievementId={achievementId}
                      />
                    )
                  }
                  return (
                    <SubmissionUsers
                      key={aud.id}
                      seen={false}
                      lockForever={false}
                      achievementId={achievementId}
                    />
                  )
                }
                return undefined
              }
            )}
          </CCardBody>
        </CCard>
      )}
    </>
  )
}

export default AchievementTabs
