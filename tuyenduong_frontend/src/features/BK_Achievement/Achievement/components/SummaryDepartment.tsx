import {
  CButton,
  CCol,
  CDataTable,
  CPagination,
  CTooltip,
  CRow,
  CSelect,
} from '@coreui/react'
import React, { useEffect, useState, memo } from 'react'
import achievementApi from '../../../../api/Achievement/achievementApi'
import { CSVLink } from 'react-csv'
import { useHistory } from 'react-router-dom'
import InputSearch from '../../../../common/InputFilterSearch'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

const fields = [
  {
    key: 'stt',
    label: 'STT',
    _style: { width: '5%', textAlign: 'center' },
  },
  {
    key: 'code',
    label: 'Mã đơn vị',
    _style: { width: '15%', textAlign: 'center' },
  },
  {
    key: 'department',
    label: 'Đơn vị',
    _style: { width: '40%', textAlign: 'center' },
  },
  {
    key: 'success',
    label: 'Đạt(%)',
    sorter: false,
    filter: false,
    _style: { width: '15%', textAlign: 'center' },
  },
  {
    key: 'failure',
    label: 'Không đạt(%)',
    sorter: false,
    filter: false,
    _style: { width: '15%', textAlign: 'center' },
  },
  {
    key: 'sum',
    label: 'Tổng(%)',
    sorter: false,
    filter: false,
    _style: { width: '15%', textAlign: 'center' },
  },
]

const headers = [
  { label: 'Mã đơn vị', key: 'code' },
  { label: 'Đơn vị', key: 'department' },
  { label: 'Đạt(%)', key: 'success' },
  { label: 'Không đạt(%)', key: 'failure' },
  { label: 'Tổng(%)', key: 'sum' },
]

interface Filters {
  limit: number
  page: number
  search: string
}

type Props = {
  achievementId: number
}

const SummaryDepartment: React.FC<Props> = ({ achievementId }) => {
  const [data, setData] = useState<any[]>([])
  const [dataCSV, setDataCSV] = useState<any[]>([])
  const [count, setCount] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    limit: 5,
    page: 1,
    search: '',
  })
  const history = useHistory()

  const formatDepartment = (data: any[], count: number) => {
    return data.map(({ code, name, success, failed }) => ({
      code,
      department: name,
      success: `${success}(${
        Math.round((success / count) * 100 * 100) / 100
      }%)`,
      failure: `${failed}(${Math.round((failed / count) * 100 * 100) / 100}%)`,
      sum: `${success + failed}(${
        Math.round(((success + failed) / count) * 100 * 100) / 100
      }%)`,
    }))
  }

  useEffect(() => {
    achievementApi
      .getSummary(achievementId, { limit: 9999, page: 1, search: '' })
      .then(
        ({ data: departments, countSubmission, countDepartment: count }) => {
          const dataFormat = formatDepartment(departments, countSubmission)
          setDataCSV(dataFormat)
        }
      )
      .catch((error: any) => {
        console.error(error.message)
        history.push('/loi-truy-cap')
      })
  }, [achievementId, history])

  useEffect(() => {
    async function getResult(id: number) {
      try {
        const {
          data: departments,
          countSubmission,
          countDepartment: count,
        } = await achievementApi.getSummary(id, filters)
        setCount(count)

        const dataFormat = formatDepartment(departments, countSubmission)
        setData(dataFormat)
      } catch (error: any) {
        console.error(error.message)
        history.push('/loi-truy-cap')
      }
    }

    getResult(achievementId)
  }, [achievementId, history, filters])

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    })
  }

  return (
    <>
      <CRow className='mb-2'>
        <CCol sm='4' className='d-flex align-items-center'>
          <CTooltip content={`Mã đơn vị, Đơn vị`}>
            <CIcon className='mr-1' size='lg' content={freeSet.cilFilter} />
          </CTooltip>
          <InputSearch onSubmit={handleChangeSearch} />
        </CCol>
        <CCol sm='1'></CCol>
        <CCol sm='7' className='d-flex justify-content-end align-items-center'>
          <div>Số lượng/ trang:</div>
          <CSelect
            defaultValue={'5'}
            style={{ width: '70px', float: 'right', margin: '0 10px' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFilters({ ...filters, limit: +e.currentTarget.value })
            }>
            <option value='5' selected>
              5
            </option>
            <option value='10'>10</option>
            <option value='20'>20</option>
            <option value='50'>50</option>
          </CSelect>
          <CButton
            color='info'
            size=''
            style={{ float: 'right' }}
            className='align-middle justify-content-center ml-3'>
            <CSVLink
              data={dataCSV}
              filename={'thong-ke-theo-don-vi.csv'}
              headers={headers}
              style={{ color: 'white' }}>
              Xuất dữ liệu
            </CSVLink>
          </CButton>
        </CCol>
        <CCol sm='4'></CCol>
      </CRow>
      <CDataTable
        items={data}
        fields={fields}
        noItemsView={{
          noResults: 'Không có kết quả tìm kiếm',
          noItems: 'Không tìm thấy Đơn vị',
        }}
        scopedSlots={{
          stt: (item: any,index: number) => (
            <td className='align-middle text-center'>{index + 1}</td>
          ),
          code: (item: any) => (
            <td className='align-middle text-center'>{item.code}</td>
          ),
          department: (item: any) => (
            <td className='align-middle'>{item.department}</td>
          ),
          success: (item: any) => (
            <td className='align-middle text-center'>{item.success}</td>
          ),
          failure: (item: any) => (
            <td className='align-middle text-center'>{item.failure}</td>
          ),
          sum: (item: any) => (
            <td className='align-middle text-center'>{item.sum}</td>
          ),
        }}></CDataTable>
      <div className={'mt-2 d-flex justify-content-center'}>
        <CPagination
          activePage={filters.page}
          className='align-middle text-center'
          pages={Math.ceil(count / filters.limit)}
          onActivePageChange={(i: number) =>
            setFilters({ ...filters, page: i })
          }></CPagination>
      </div>
    </>
  )
}

export default memo(SummaryDepartment)
