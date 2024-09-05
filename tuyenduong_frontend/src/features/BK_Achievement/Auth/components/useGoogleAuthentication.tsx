import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import { useHistory } from 'react-router'
import UserApi from '../../../../api/Achievement/userApi'
import { useDispatch } from 'react-redux'
import { setUser } from '../../../../redux/user'

function useGoogleAuthentication(showForm: () => void) {
  const history = useHistory()
  const dispatch = useDispatch()
  const handleSuccess = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if ('accessToken' in response) {
      const accessToken = response.accessToken

      try {
        const res = await UserApi.loginGoogle(accessToken)
        if (res.isFirstTimeLogin) {

        } else {
          dispatch(setUser(res.user))
          history.push('/danh-hieu')
        }
      } catch (error: any) {
        console.log(error.message)
      }

      history.push('/danh-hieu')
    }
  }

  return {
    handleSuccess,
  }
}

export default useGoogleAuthentication
