import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPagination,
  CRow,
  CSelect,
  CTooltip,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import UserApi from '../../../../api/Achievement/userApi'
import RolesList from '../components/rolesList'
import Select from 'react-select'
import InputSearch from '../../../../common/InputFilterSearch'
import { roles as UserRole } from '../../../../common/roles'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import Department from '../../../../types/Department'
import DepartmentApi from '../../../../api/Achievement/departmentApi'

const roles = [
  { value: UserRole.PARTICIPANT, label: 'Người dùng' },
  { value: UserRole.ADMIN, label: 'Quản trị hệ thống' },
  { value: UserRole.MANAGER, label: 'Quản lý hệ thống' },
  { value: UserRole.DEPARTMENT, label: 'Quản lý đơn vị'}
]

const convertNameRoles = (role: string) => {
  switch (role) {
    case 'participant':
      return 'Người dùng'
    case 'admin':
      return 'Quản trị hệ thống'
    case 'manager':
      return 'Quản lý hệ thống'
    case 'department':
      return 'Quản lý đơn vị'
    default:
      return ''
  }
}

interface Filters {
  limit: number
  page: number
  search: string
  userRole: string
}

function ParticipantManagement() {
  const [userList, setUserList] = useState<any[]>([])
  const [depData, setDepData] = useState<Department[]>([]);
  const [value, setValue] = useState<{ email: string; role: string, department: string }>({
    email: '',
    role: '',
    department: '',
  })
  const [errAdd, setErrAdd] = useState('')
  const history = useHistory()
  const [open, setOpen] = useState(false)

  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: '',
    userRole: UserRole.PARTICIPANT,
  })
  const [count, setCount] = useState(1)
  const currentUser = useSelector((state: RootState) => state.user)
  useEffect(() => {
    const getDepData = async () => {
      const data = await DepartmentApi.getAll();
      setDepData(data);
    };
    getDepData();
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin()
      } catch {
        history.push('/login')
      }
    }
    const fetchUser = async () => {
      try {
        const { data, count } = await UserApi.getFilterAllUser({
          ...filters,
        })

        setUserList(
          data.map((user) => {
            const role = convertNameRoles(user.role)
            return { ...user, role }
          })
        )
        setCount(count)
      } catch (error) {
        console.error(error)
      }
    }
    if (currentUser.role === UserRole.ADMIN) {
      fetchUser()
    } else {
      verifyLogin()
      if (currentUser.id !== 0) {
        history.push('/loi-truy-cap')
      }
    }
  }, [history, filters, currentUser.id, currentUser.role])

  useEffect(() => {
    if (!open) {
      setValue({ email: '', role: '', department: '' })
      setErrAdd('')
    }
  }, [open])

  const handleSubmit = async () => {
    // eslint-disable-next-line
    const regularEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!regularEmail.test(value.email)) {
      setErrAdd('Email không hợp lệ')
    } else if (value.role === '') {
      setErrAdd('Phân quyền không được để trống')
    } else if (value.role === 'department') {
      if (value.department === '') {
        setErrAdd('Đơn vị không được để trống')
      } else {
        try {
          const newUser = await UserApi.createUserForDepartment(value)
          if(!newUser.id) {
            setErrAdd(newUser.response)
          } else {
            if (newUser.role !== undefined) {
              const newArray = userList.filter(
                (item) => item.email !== newUser.email
              )
              if (newUser.role === filters.userRole) {
                newUser.role = convertNameRoles(newUser.role)
                setUserList([newUser, ...newArray])
              } else {
                setUserList(newArray)
              }
    
              setValue({ email: '', role: '', department: '' })
              setOpen(false)
            } else {
              setOpen(false)
            }
          }
        } catch (error: any) {
          console.log(error);
        }
      }
    } else {
      try {
        const newUser = await UserApi.create(value)
        if (newUser.role !== undefined) {
          const newArray = userList.filter(
            (item) => item.email !== newUser.email
          )
          if (newUser.role === filters.userRole) {
            newUser.role = convertNameRoles(newUser.role)
            setUserList([newUser, ...newArray])
          } else {
            setUserList(newArray)
          }

          setValue({ email: '', role: '', department: '' })
          setOpen(false)
        } else {
          setOpen(false)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleUpdateUser = async (newUser: any) => {
    newUser.role = convertNameRoles(newUser?.role)
    setUserList(
      userList.map((user) => (user.id === newUser.id ? newUser : user))
    )
  }

  const handleDeleteUser = async (id: number) => {
    try {
      setUserList(userList.filter((user) => user.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    })
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>QUẢN LÝ NGƯỜI DÙNG</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className='mb-2'>
              <CCol sm='4' className='d-flex align-items-center'>
                <CTooltip content={`Tên`}>
                  <CIcon
                    className='mr-1'
                    size='lg'
                    content={freeSet.cilFilter}
                  />
                </CTooltip>
                <InputSearch onSubmit={handleChangeSearch} />
              </CCol>
              <CCol className='d-flex align-items-center justify-content-end mr-4'>
                <CRow>
                  <CCol
                    sm='auto'
                    className='d-flex justify-content-end align-items-center'>
                    Số lượng/ trang
                  </CCol>

                  <CCol
                    sm='auto'
                    className='d-flex justify-content-end align-items-center px-0 mr-2'>
                    <CSelect
                      defaultValue={'10'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFilters({
                          ...filters,
                          limit: +e.currentTarget.value,
                        })
                      }>
                      <option value='5'>5</option>
                      <option value='10' selected>
                        10
                      </option>
                      <option value='20'>20</option>
                      <option value='50'>50</option>
                    </CSelect>
                  </CCol>
                  <CCol
                    sm='auto'
                    className='d-flex justify-content-end align-items-center px-1'>
                    Quyền truy cập
                  </CCol>
                  <CCol
                    sm='auto'
                    className='d-flex justify-content-end align-items-center'>
                    <CSelect
                      defaultValue={UserRole.PARTICIPANT}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFilters({
                          ...filters,
                          userRole: e.currentTarget.value,
                        })
                      }>
                      {roles.map((item) => (
                        <option value={item.value}>{item.label}</option>
                      ))}
                    </CSelect>
                  </CCol>
                  <CCol
                    sm='auto'
                    className='d-flex justify-content-end align-items-center'>
                    <CButton color='info' size='' onClick={() => setOpen(true)}>
                      Thêm
                    </CButton>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
            <RolesList
              courseList={userList}
              handleUpdateUser={handleUpdateUser}
              handleDeleteUser={handleDeleteUser}></RolesList>
            <div className={'mt-2 d-flex justify-content-center'}>
              <CPagination
                activePage={filters.page}
                className='align-middle text-center'
                pages={Math.ceil(count / filters.limit)}
                onActivePageChange={(i: number) =>
                  setFilters({ ...filters, page: i })
                }></CPagination>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      <CCardBody>
        <CModal
          show={open}
          onClose={() => {
            setOpen(false)
          }}
          size='lg'
          color='info'>
          <CModalHeader closeButton>
            <CModalTitle>Thêm quyền truy cập</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs='12' style={{ color: 'red' }}>
                {errAdd}
              </CCol>
              <CCol xs={8}>
                <CInput
                  placeholder='abcxyz@hcmut.edu.vn'
                  type='email'
                  required
                  value={value.email}
                  onChange={(e) =>
                    setValue({ email: e.currentTarget.value, role: value.role, department: value.department })
                  }
                />
              </CCol>
              <CCol xs={4}>
                <Select
                  className='mb-3'
                  placeholder='Vui lòng chọn quyền'
                  isClearable={true}
                  onChange={(newValue) =>
                    setValue({
                      email: value.email,
                      role: newValue?.value || '',
                      department: value.department
                    })
                  }
                  options={roles}
                />
              </CCol>
              {value.role === 'department' && <CCol xs={12}>
                <Select
                  className='mb-3'
                  placeholder='Vui lòng chọn đơn vị'
                  isClearable={true}
                  onChange={(newValue) =>
                    setValue({
                      email: value.email,
                      role: value.role,
                      department: newValue?.value || '',
                    })
                  }
                  options={depData.map((item) => (
                    {value: String(item.id), label: item.name}
                  ))}
                />
              </CCol>}
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color='info' onClick={handleSubmit}>
              Gửi
            </CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CRow>
  )
}

export default ParticipantManagement
