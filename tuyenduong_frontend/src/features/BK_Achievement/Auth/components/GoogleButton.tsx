import React from 'react'
import GoogleLogin from 'react-google-login'
// import useGoogleAuthentication from "./useGoogleAuthentication";
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import UserApi from '../../../../api/Achievement/userApi'
import { setUser } from '../../../../redux/user'
import { roles as UserRole } from '../../../../common/roles'
import { setUnAuthorized } from '../../../../redux/unAuthorized'
import { setAchievementSideBar } from '../../../../redux/achievementSideBar'
import achievementApi from '../../../../api/Achievement/achievementApi'

function GoogleButton(prop: {
  setShowStudentForm: (token: string) => void
  setShowTeacherForm: (token: string) => void
  setWrongAuthorizing1: () => void
  setWrongAuthorizing2: () => void
  setUserBanned: () => void
}) {
  const clientId = process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID || ''

  const dispatch = useDispatch()
  const history = useHistory()

  const handleUpdateSideBar = async () => {
    try {
      Promise.all([
        achievementApi.getAllWithFilter(
          { limit: 10, page: 1, search: '' },
          true
        ),
        achievementApi.getAllWithFilter(
          { limit: 10, page: 1, search: '' },
          true,
          'COMPETITION'
        ),
      ])
        .then((response) => {
          dispatch(setAchievementSideBar(response[0].count))
        })
        .catch((error) => {
          console.error(error)
        })
    } catch (error) {
      console.error(error)
    }
  }

  const handleSuccess = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if ('accessToken' in response) {
      const accessToken = response.accessToken
      try {
        const res = await UserApi.loginGoogle(accessToken)
        if (res === 'Hệ thống chưa sẵn sàng') {
          prop.setWrongAuthorizing2()
          return
        }
        if (res.user !== null) {
          const updatedUser = res.user
          const newUser = {
            id: updatedUser.id,
            email: updatedUser.email,
            isRegisteredWithGoogle: updatedUser.isRegisteredWithGoogle,
            role: updatedUser.role,
            name: updatedUser.name,
            surName: updatedUser.surName,
            mssv: updatedUser.mssv,
            youthUnion: updatedUser.youthUnionId,
            isUpdatedInformation: updatedUser.isUpdatedInformation,
          }
          dispatch(setUser(newUser))
          dispatch(setUnAuthorized(false))
          if (updatedUser.role === UserRole.PARTICIPANT)
            await handleUpdateSideBar()
          if (res.isFirstTimeLogin) {
            switch (res.user.role) {
              case UserRole.PARTICIPANT:
                history.push('/thong-tin')
                break

              default:
                history.push('/thong-tin-can-bo')
                break
            }
          } else {
            switch (res.user.role) {
              case UserRole.PARTICIPANT:
                history.push('/de-cu')
                break
              case UserRole.MANAGER:
                history.push('/danh-hieu')
                break
              case UserRole.ADMIN:
                history.push('/quan-li-nguoi-dung')
                break
              case UserRole.DEPARTMENT:
                  history.push('/quan-ly-danh-hieu-cap-don-vi')
                  break
              default:
                history.push('/loi-truy-cap')
                break
            }
          }
        } else {
          if (res.isFirstTimeLogin) {
            prop.setWrongAuthorizing1()
          } else {
            prop.setUserBanned()
          }
        }
      } catch (error: any) {
        console.log(error.message)
      }
    }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <GoogleLogin
        clientId={clientId}
        buttonText='Đăng nhập với Google'
        prompt='consent'
        onSuccess={handleSuccess}
      />
    </div>
  )
}

export default GoogleButton
