import React, { useEffect, useState } from 'react'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useHistory } from 'react-router-dom'
import achievementApi from '../../../../api/Achievement/achievementApi'
import Achievement from '../../../../types/Achievement'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import parse from 'html-react-parser'
import { freeSet } from '@coreui/icons'
import { RootState } from '../../../../store'
import { useSelector } from 'react-redux'
import { roles } from '../../../../common/roles'

const AchievementDetail = (props: any) => {
  const { achievementId } = props
  const user = useSelector((state: RootState) => state.user)
  const [data, setData] = useState<string>('')
  const [edit, setEdit] = useState(false)
  const [achievement, setAchievement] = useState<Achievement>()
  const history = useHistory()

  useEffect(() => {
    async function fetchAchievement() {
      try {
        const element: Achievement = await achievementApi.get(achievementId)
        setAchievement(element)
        setData(achievement?.description || '')
      } catch (error: any) {
        console.error(error.message)
        history.push('/loi-truy-cap')
      }
    }
    fetchAchievement()
  }, [achievement?.description, achievementId, history])

  const handleSubmit = async () => {
    try {
      const updateAchievement: Achievement = await achievementApi.update(
        achievementId,
        { ...achievement, description: data }
      )
      setEdit(false)
      setAchievement(updateAchievement)
    } catch (error: any) {
      console.error(error.message)
      history.push('/loi-truy-cap')
    }
  }

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <b>{achievement?.name}</b>
              {roles.MANAGER.includes(user.role) ? (
                <div className='card-header-actions'>
                  <CBadge className='float-right'>
                    {edit ? (
                      <>
                        <CButton size='sm'></CButton>
                        <CIcon
                          size='lg'
                          className='ml-1'
                          content={freeSet.cilSave}
                          onClick={handleSubmit}
                        />
                        <CIcon
                          size='lg'
                          content={freeSet.cilX}
                          onClick={() => {
                            setEdit(false)
                            setData('')
                          }}
                        />
                      </>
                    ) : (
                      <CIcon
                        size='lg'
                        content={freeSet.cilPencil}
                        onClick={() => setEdit(true)}
                      />
                    )}
                  </CBadge>
                </div>
              ) : undefined}
            </CCardHeader>
            {roles.MANAGER.includes(user.role) ? (
              <CCardBody>
                {edit ? (
                  <CKEditor
                    editor={ClassicEditor}
                    data={data}
                    onChange={(event: any, editor: any) => {
                      const data = editor.getData()
                      setData(data)
                    }}
                  />
                ) : (
                  parse(achievement?.description || '')
                )}
              </CCardBody>
            ) : (
              <CCardBody>{parse(achievement?.description || '')}</CCardBody>
            )}
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AchievementDetail
