import {
  CButton,
  CCardBody,
  CCol,
  CDataTable,
  CInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTooltip,
} from '@coreui/react'
import Moment from 'react-moment'
import 'moment/locale/vi'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import UserApi from '../../../../api/Achievement/userApi'
import { RootState } from '../../../../store'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../../../redux/user'
import Department from '../../../../types/Department'
import DepartmentApi from '../../../../api/Achievement/departmentApi'

const roles = [
  { value: 'participant', label: 'Người dùng' },
  { value: 'admin', label: 'Quản trị hệ thống' },
  { value: 'manager', label: 'Quản lý hệ thống' },
  { value: 'department', label: 'Quản lý đơn vị' },
]

function RolesList(props: any) {
  const { courseList, handleUpdateUser } = props
  const [depData, setDepData] = useState<Department[]>([]);
  const [valueEdit, setValueEdit] = useState<{ email: string; role: any }>()
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const [value, setValue] = useState<{
    email: string
    role: string
    id: number
    department: string
    
  }>({
    id: 0,
    email: '',
    role: '',
    department: '',
  })
  const [isUpdate, setIsUpdate] = useState(false)
  const [allowUpdateModel, setAllowUpdateModel] = useState(false)
  const [allowUpdateId, setAllowUpdateId] = useState(0)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  // eslint-disable-next-line
  const [deleteID, setDeleteID] = useState<number>()
  // eslint-disable-next-line
  const [deleteMail, setDeleteMail] = useState<string>()
  const [deleteError, setDeleteError] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  const fields = [
    {
      key: 'stt',
      label: 'STT',
      _style: { textAlign: 'center' },
    },
    {
      key: 'name',
      label: 'Họ và tên',
      _style: { textAlign: 'center' },
    },
    {
      key: 'email',
      label: 'Email',
      _style: { textAlign: 'center' },
    },
    {
      key: 'roles',
      label: 'Quyền truy cập',
      _style: { textAlign: 'center' },
    },
    {
      key: 'updatedAt',
      label: 'Cập nhật lần cuối',
      sorter: false,
      filter: false,
      _style: { textAlign: 'center' },
    },
    {
      key: 'action',
      label: 'Thao tác',
      _style: { textAlign: 'center' },
      sorter: false,
      filter: false,
    },
  ]

  useEffect(() => {
    const getDepData = async () => {
      const data = await DepartmentApi.getAll();
      setDepData(data);
    };
    getDepData();
  }, [])

  const handleSubmit = async () => {
    try {
      const newUser = await UserApi.updateInfoManager(value.id, {
        email: value.email,
        role: value.role,
        department: value.department,
      })
      if (newUser.email === user.email) {
        dispatch(setUser({ role: newUser.role }))
      }
      handleUpdateUser(newUser)
      setValue({ email: '', role: '', id: 0 , department: '' })
      setIsUpdate(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmitAllowUpdate = async () => {
    try {
      await UserApi.allowUpdateInfo(allowUpdateId)

      setAllowUpdateModel(false)
    } catch (error: any) {
      console.error(error.message)
    }
  }
  const handleSubmitDeleteUser = async () => {
    if (deleteID !== undefined) {
      try {
        const res = await UserApi.delete(deleteID)
        setDeleteConfirm(false)
        if (res.affected !== undefined) {
          if (res.affected === 1) {
            setDeleteSuccess(true)
          } else {
            setDeleteError(true)
          }
        } else {
          setDeleteError(true)
        }
      } catch (error: any) {
        console.error(error.message)
      }
    } else {
      setDeleteError(true)
    }
  }
  return (
    <>
      <CDataTable
        items={courseList}
        fields={fields}
        hover
        noItemsView={{
          noResults: 'Không có kết quả tìm kiếm',
          noItems: 'Không có dữ liệu',
        }}
        scopedSlots={{
          stt: (item: any, index: number) => {
            return <td className='align-middle text-center'>{index + 1}</td>
          },
          name: (item: any) => {
            return (
              <td className='align-middle text-start'>
                {item.name !== null ? (
                  <>
                    {item.surName} {item.name}
                  </>
                ) : (
                  'Người dùng chưa cập nhật thông tin'
                )}
              </td>
            )
          },
          email: (item: any) => {
            return <td className='align-middle text-start'>{item.email}</td>
          },
          roles: (item: any) => {
            return <td className='align-middle text-center'>{item.role}</td>
          },
          updatedAt: (item: any) => {
            return (
              <td className='align-middle text-center'>
                <Moment fromNow local locale='vi'>
                  {item.updatedAt}
                </Moment>
              </td>
            )
          },
          action: (item: any) => {
            return (
              <td className='d-flex justify-content-start'>
                <CTooltip content='Quản lý quyền truy cập'>
                  <CButton
                    size='sm'
                    color='info'
                    onClick={() => {
                      setValue({
                        email: item.email,
                        role: item.role,
                        id: item.id,
                        department: value.department
                      })
                      setIsUpdate(true)
                      setValueEdit({
                        email: item.email,
                        role: { value: item.role, label: item.role },
                      })
                    }}>
                    <CIcon size='sm' content={freeSet.cilSettings} />
                  </CButton>
                </CTooltip>
                <CTooltip content='Mở cập nhật thông tin'>
                  <CButton
                    size='sm'
                    color='success'
                    className='ml-1'
                    onClick={() => {
                      setAllowUpdateId(item.id)
                      setAllowUpdateModel(true)
                    }}>
                    <CIcon size='sm' content={freeSet.cilCheckCircle} />
                  </CButton>
                </CTooltip>
              </td>
            )
          },
        }}></CDataTable>
      <CCardBody>
        <CModal
          show={isUpdate}
          onClose={() => {
            setIsUpdate(false)
          }}
          size='lg'
          color='info'>
          <CModalHeader closeButton>
            <CModalTitle>Quản lý quyền truy cập</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs={8}>
                <CInput
                  placeholder='abcxyz@hcmut.edu.vn'
                  type='email'
                  required
                  value={value?.email}
                  disabled={true}
                />
              </CCol>
              <CCol xs={4}>
                <Select
                  className='mb-3'
                  placeholder='Vui lòng chọn quyền'
                  isClearable={true}
                  onChange={(newValue) => {
                    setValue({
                      ...value,
                      role: newValue?.value || '',
                    })
                  }}
                  defaultValue={
                    valueEdit
                      ? roles[roles.indexOf(valueEdit?.role)]
                      : undefined
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
                      id: value.id,
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
              Cập Nhật
            </CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
      {allowUpdateModel ? (
        <>
          <CCardBody>
            <CModal
              show={true}
              onClose={() => {
                setAllowUpdateModel(false)
              }}
              size='lg'
              color='info'>
              <CModalHeader closeButton>
                <CModalTitle>Cho phép cập nhật thông tin</CModalTitle>
              </CModalHeader>
              <CModalBody>
                Bạn có chắc là mình muốn cho phép người dùng cập nhật lại thông
                tin không ?
              </CModalBody>
              <CModalFooter>
                <CButton color='info' onClick={handleSubmitAllowUpdate}>
                  Đồng ý
                </CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </>
      ) : (
        <></>
      )}
      {deleteConfirm ? (
        <>
          <CCardBody>
            <CModal
              show={true}
              onClose={() => {
                setDeleteConfirm(false)
              }}
              size='lg'
              color='danger'>
              <CModalHeader closeButton>
                <CModalTitle>Xóa người dùng khỏi hệ thống</CModalTitle>
              </CModalHeader>
              <CModalBody>
                Bạn có chắc là mình muốn xóa người dùng với email:{' '}
                {deleteMail !== null ? deleteMail : ''} khỏi hệ thống?
              </CModalBody>
              <CModalFooter>
                <CButton color='danger' onClick={handleSubmitDeleteUser}>
                  Đồng ý
                </CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </>
      ) : (
        <></>
      )}
      {deleteError ? (
        <>
          <CCardBody>
            <CModal
              show={true}
              onClose={() => {
                setDeleteError(false)
              }}
              size='lg'
              color='danger'>
              <CModalHeader closeButton>
                <CModalTitle>Thông báo</CModalTitle>
              </CModalHeader>
              <CModalBody>
                Có lỗi xảy ra, vui lòng liên hệ nhà phát triển để sửa lỗi.
              </CModalBody>
              <CModalFooter>
                <CButton
                  color='warning'
                  onClick={() => {
                    setDeleteError(false)
                  }}>
                  Đồng ý
                </CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </>
      ) : (
        <></>
      )}
      {deleteSuccess ? (
        <>
          <CCardBody>
            <CModal
              show={true}
              onClose={() => {
                setDeleteSuccess(false)
              }}
              size='lg'
              color='success'>
              <CModalHeader closeButton>
                <CModalTitle>Thông báo</CModalTitle>
              </CModalHeader>
              <CModalBody>Xóa người dùng thành công</CModalBody>
              <CModalFooter>
                <CButton
                  color='success'
                  onClick={() => {
                    window.location.reload()
                    setDeleteSuccess(false)
                  }}>
                  Đồng ý
                </CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default RolesList
