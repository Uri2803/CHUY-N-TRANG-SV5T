import React, { useEffect, useState, useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CCardHeader,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import UserApi from '../../../../api/Achievement/userApi'
import Select from 'react-select'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { roles } from '../../../../common/roles'
import achievementApi from '../../../../api/Achievement/achievementApi'
import DepartmentApi from '../../../../api/Achievement/departmentApi'

const fields = [
  {
    key: 'name',
    label: 'Tên',
    _style: { width: '25%', textAlign: 'center' },
  },
  {
    key: 'email',
    label: 'Email',
    _style: { width: '25%', textAlign: 'center' },
  },
  {
    key: 'manageUnit',
    label: 'Đơn vị quản lý',
    _style: { width: '25%', textAlign: 'center' },
  },
  {
    key: 'action',
    label: 'Thao tác',
    _style: { width: '15%', textAlign: 'center' },
    sorter: false,
    filter: false,
  },
]

interface TParam {
  id: string
}

const ManageDepartment = ({ match }: RouteComponentProps<TParam>) => {
  const idAchievement = match.params.id
  const [users, setUsers] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [openRemove, setOpenRemove] = useState({
    open: false,
    str: '',
  })
  const [user, setUser] = useState<any[]>([])
  const [displayDepartment, setDisplayDepartment] = useState<any>()
  const [depData, setDepData] = useState<any[]>([])
  const [auditorFinal, setAuditorFinal] = useState<{
    value: number
    label: string
  }>()
  const [displaySelect, setDisplaySelect] = useState(0)
  const [spinner, setSpinner] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
  })
  const timeoutSearchRef = useRef<any>(null)
  const [messageError, setMessageError] = useState('')

  const history = useHistory()

  const currentUser = useSelector((state: RootState) => state.user)

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin()
      } catch {
        history.push('/login')
      }
    }
    async function getManageUnits() {
      const response = await achievementApi.getManageUnit(idAchievement)
      setUsers(response)
    }
    const getDepData = async () => {
      const data = await DepartmentApi.getAll()

      setDepData(data.map((item) => ({ value: item.code, label: item.name })))
    }
    getDepData()
    verifyLogin()
    getManageUnits()
  }, [idAchievement, history])

  useEffect(() => {
    async function getUserAll() {
      try {
        const data = await UserApi.getAll(filters)
        setTimeout(() => {
          setSpinner(false)
        }, 500)
        setUser(
          data.map((res) => ({
            value: res.id,
            label: res.email,
          }))
        )
      } catch (error) {
        console.error(error)
      }
    }
    if (roles.MANAGER.includes(currentUser.role)) {
      getUserAll()
    } else {
      if (currentUser.id !== 0) {
        history.push('loi-truy-cap')
      }
    }
  }, [filters, currentUser.role, currentUser.id, history])

  const handleChangeDepartment = (newValue: any, actionMeta: any) => {
    if (actionMeta.action === 'clear') {
      setDisplaySelect(0)
    } else {
      setDisplaySelect(1)
      setDisplayDepartment(newValue.value)
    }
  }

  const handleInputChange = (value: string) => {
    const temp = value
    if (timeoutSearchRef.current) {
      clearTimeout(timeoutSearchRef.current)
    }

    timeoutSearchRef.current = setTimeout(() => {
      setSpinner(true)
      setFilters({ search: temp || '' })
    }, 1500)
  }

  const handleChangeSingle = (newValue: any, actionMeta: any) => {
    if (actionMeta.action === 'clear') {
      setDisplaySelect(0)
    } else {
      setDisplaySelect(1)
      setAuditorFinal(newValue)
    }
  }

  const handleSubmit = async () => {
    try {
      if (displaySelect === 1) {
        await achievementApi.updateManageUnit(
          idAchievement,
          {
            email: auditorFinal?.label || '',
            codeDepartment: displayDepartment,
          }
        )

       const responseUser = await achievementApi.getManageUnit(idAchievement)
       setUsers(responseUser)
        setOpen(false)
        setDisplaySelect(0)
      }
      setMessageError('')
    } catch (error: any) {
      if (error?.response.status === 400) {
        setMessageError(error.response.data.message)
        setTimeout(() => {
          setMessageError('')
        }, 3000)
      }
      console.error(error)
    }
  }

  const handleRemove = async (str: string) => {
    try {
      await achievementApi.deleteManageUnit(idAchievement, str)
      const response = await achievementApi.getManageUnit(idAchievement)
      setUsers(response)
      setOpenRemove({ open: false, str: '' })
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <>
      {roles.MANAGER.includes(currentUser.role) && (
        <CCard>
          <CCardHeader>
            <strong>QUẢN LÝ ĐƠN VỊ</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xl='12'>
                <CRow className='mt-2 mb-2 mr-1 d-flex justify-content-end'>
                  <CButton color='info' onClick={() => setOpen(true)}>
                    Thêm
                  </CButton>
                </CRow>
              </CCol>
              <CCol xl='12'>
                <CCard>
                  <CCardBody>
                    <CDataTable
                      items={users}
                      fields={fields}
                      noItemsView={{
                        noResults: 'Không có kết quả tìm kiếm',
                        noItems: 'Quản lý đơn vị chưa được phân công',
                      }}
                      scopedSlots={{
                        name: (item: any) => {
                          return (
                            <td className='text-center'>
                              {item.surName} {item.name}
                            </td>
                          )
                        },
                        email: (item: any) => {
                          return (
                            <td className='text-center'>
                              <div className='d-flex justify-content-center align-items-center'>
                                {item.email}
                              </div>
                            </td>
                          )
                        },
                        manageUnit: (item: any) => {
                          return (
                            <td className='text-center'>
                              <div className='d-flex justify-content-center align-items-center'>
                                {item.department}
                              </div>
                            </td>
                          )
                        },
                        action: (item: any) => (
                          <td
                            className='text-center'
                            style={{ cursor: 'pointer' }}>
                            <CButton
                              size='sm'
                              color='danger'
                              onClick={() =>
                                setOpenRemove({
                                  open: true,
                                  str: `${item.email},${item.code}`,
                                })
                              }>
                              <CIcon size='sm' content={freeSet.cilTrash} />
                            </CButton>
                          </td>
                        ),
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CModal
              show={open}
              onClose={() => {
                setOpen(false)
              }}
              size='lg'
              color='info'>
              <CModalHeader closeButton>
                <CModalTitle>Thêm quản lý đơn vị</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CRow>
                  <CCol sm='12'>
                    <div style={{ color: 'red', marginBottom: '5px' }}>
                      {messageError}
                    </div>
                  </CCol>
                  <CCol sm='8'>
                    <Select
                      isSearchable={true}
                      isClearable={true}
                      onChange={handleChangeSingle}
                      onInputChange={handleInputChange}
                      options={user}
                      placeholder='Vui lòng nhập Email để tìm kiếm...'
                    />
                    {spinner ? (
                      <CSpinner
                        className='align-self-center'
                        color='info'
                        size='sm'
                      />
                    ) : undefined}
                  </CCol>
                  <CCol className='d-flex' sm='4'>
                    <Select
                      className='mb-3'
                      placeholder='Vui lòng chọn'
                      name='color'
                      isClearable={true}
                      onChange={handleChangeDepartment}
                      options={depData}
                    />
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter>
                <CButton
                  color='info'
                  disabled={displaySelect === 0}
                  onClick={handleSubmit}>
                  Gửi
                </CButton>
              </CModalFooter>
            </CModal>
            <CModal
              show={openRemove.open}
              onClose={() => {
                setOpenRemove({ open: false, str: '' })
              }}
              color='danger'>
              <CModalHeader closeButton>
                <CModalTitle>Xóa đơn vị quản lý</CModalTitle>
              </CModalHeader>
              <CModalBody>
                Bạn có chắc chắn muốn xóa {openRemove.str}
              </CModalBody>
              <CModalFooter>
                <CButton
                  color='danger'
                  onClick={() => handleRemove(openRemove.str)}>
                  Xóa
                </CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </CCard>
      )}
    </>
  )
}

export default ManageDepartment
