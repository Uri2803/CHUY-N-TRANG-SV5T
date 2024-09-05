import {
  CCol,
  CContainer,
  CRow,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { Submission } from '../../../../types/Submission'
import { Criteria } from '../../../../types/TieuChi'
import Select from 'react-select'
import {
  updatePoint,
  updateBin,
  updateFile,
  updateStudentComment,
  updateStudentSelect,
} from '../../../../redux/submission'
import { useDispatch } from 'react-redux'
import { extname } from 'path'
import FileData from '../../../../types/FileData'
// import { isTemplateTail } from "typescript";

const DefaultSubmission1: Submission = {
  id: -1,
  userId: 2,
  achievementId: 3,
  criteriaID: 'none',
  file: '',
  point: 0,
  binary: false,
  description: '',
  studentComment: '',
  studentSelect: '',
}
const DefaultSubmission2: Submission = {
  id: -1,
  userId: 2,
  achievementId: 3,
  criteriaID: 'cant find',
  file: '',
  point: 0,
  binary: false,
  description: '',
  studentComment: '',
  studentSelect: '',
}
const SubCrit = (prop: {
  typeOb: string
  parentid: number | string
  item: Criteria
  submitData: Submission[]
  cancelSubmit: () => void
  activateSubmit: () => void
  onShowClk: (s: string) => void
  addSaveFile: (s: FileData) => void
  onPreviewClk: (s: string) => void
}) => {
  const dispatch = useDispatch()
  // const [collapse, setCollapse] = useState(true);

  const subItem =
    prop.submitData.length > 0
      ? prop.submitData.filter((sub) => sub.criteriaID === prop.item.id)
          .length > 0
        ? prop.submitData.filter((sub) => sub.criteriaID === prop.item.id)[0]
        : DefaultSubmission2
      : DefaultSubmission1

  const [point, setPoint] = useState(subItem.point.toString())
  const [bin, setBin] = useState(subItem.binary)
  const [showAddFile, setShowAddFile] = useState<boolean>(subItem.file === '')
  const [studentComment, setStudentComment] = useState(subItem.studentComment)
  const [studentSelect, setStudentSelect] = useState(subItem.studentSelect)
  const [isBigFile, setIsBigFile] = useState(false)
  const [isWrongType, setIsWrongType] = useState(false)
  const [isDisableReviewButton, setIsDisableReviewButton] = useState(false)

  useEffect(() => {
    setPoint(subItem.point.toString())
    setBin(subItem.binary)
    setStudentComment(subItem.studentComment)
    setStudentSelect(subItem.studentSelect)
    setShowAddFile(subItem.file === '')
    setIsBigFile(false)
  }, [prop.submitData, subItem])

  const onFileChange = (e: any, fuckingid: string | number) => {
    var file = e.target.files
    if (file[0] !== undefined) {
      const fileExtName = extname(file[0].name)
      if (
        ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.zip'].includes(
          fileExtName
        )
      ) {
        const fileData: FileData = {
          file: file[0],
          fileName: `${prop.item.id.toString()}${fileExtName}`,
        }
        setIsWrongType(false)
        prop.addSaveFile(fileData)
        if (file !== null) {
          const maxAllowedSize = 2 * 1024 * 1024
          if (file[0].size < maxAllowedSize) {
            if (subItem.file === '') {
              setIsDisableReviewButton(true)

              const fileExtName = extname(file[0].name)
              const payload = {
                subId: subItem.id,
                file: `${prop.item.id.toString()}${fileExtName}`,
              }
              dispatch(updateFile(payload))
            }
            setShowAddFile(false)
            setIsBigFile(false)
          } else {
            setIsBigFile(true)
          }
        }
      } else {
        setIsBigFile(false)
        setIsWrongType(true)
      }
    }
  }
  return (
    <CCard style={{ boxShadow: '0px 4px 4px 4px rgba(23,28,255,0.24)' }}>
      <CCardHeader color='light'>
        <CContainer>
          <CRow>
            <CCol className='px-0 d-flex align-items-center'>
              <strong> {prop.item.name} </strong>
            </CCol>
          </CRow>
        </CContainer>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          {prop.item.note !== '' ? (
            <CRow>
              <CCol xl='12' className='pb-1'>
                <span style={{ color: 'red' }}>*</span>Lưu ý: {prop.item.note}
              </CCol>
            </CRow>
          ) : (
            <></>
          )}
          {prop.item.content !== '' ? (
            <CRow>
              <CCol xl='12' className='pb-1'>
                Nội dung: {prop.item.content}
              </CCol>
            </CRow>
          ) : (
            <></>
          )}
          {prop.item.method === 'point' ? (
            <>
              <CRow className='mb-1'>
                <CCol xl='12'>
                  <strong>Người nộp hồ sơ nhập điểm mình đạt được</strong>
                </CCol>
              </CRow>
              <CRow>
                <CCol xl='12' className='mb-1'>
                  {prop.item.upperSign !== '' ? (
                    prop.item.upperPoint > prop.item.lowerPoint ? (
                      <>
                        {' '}
                        Điều kiện :{' '}
                        {prop.item.lowerSign === '>'
                          ? 'Lớn hơn'
                          : 'Lớn hơn hoặc bằng'}{' '}
                        {prop.item.upperPoint} Và{' '}
                        {prop.item.upperSign === '<'
                          ? 'Bé hơn'
                          : 'Bé hơn hoặc bằng'}{' '}
                        {prop.item.lowerPoint}
                      </>
                    ) : (
                      <>
                        Điều kiện :
                        {prop.item.lowerSign === '>'
                          ? 'Lớn hơn'
                          : 'Lớn hơn hoặc bằng'}{' '}
                        {prop.item.lowerPoint} Hoặc{' '}
                        {prop.item.upperSign === '<'
                          ? 'Bé hơn'
                          : 'Bé hơn hoặc bằng'}{' '}
                        {prop.item.upperPoint}
                      </>
                    )
                  ) : (
                    <>
                      <>
                        Điều kiện:{' '}
                        {prop.item.lowerSign === '>'
                          ? 'Lớn hơn'
                          : prop.item.lowerSign === '>='
                          ? 'Lớn hơn hoặc bằng'
                          : prop.item.lowerSign === '<'
                          ? 'Bé hơn'
                          : 'Bé hơn hoặc bằng'}{' '}
                        {prop.item.lowerPoint}
                      </>
                    </>
                  )}
                </CCol>
              </CRow>
            </>
          ) : prop.item.method === 'binary' ? (
            <>
              <CRow className='mb-1'>
                <CCol xl='12'>
                  <strong>Người nộp hồ sơ tự đánh giá đạt hay không đạt</strong>
                </CCol>
              </CRow>
            </>
          ) : prop.item.method === 'comment' ? (
            <>
              {' '}
              <CRow className='mb-1'>
                <CCol xl='12'>
                  <strong>Người nộp hồ sơ tự đánh giá</strong>
                </CCol>
              </CRow>
            </>
          ) : (
            <>
              <CRow className='mb-1'>
                <CCol xl='12'>
                  <strong>
                    Người nộp hồ sơ chọn một trong số các lựa chọn có sẵn
                  </strong>
                </CCol>
              </CRow>
            </>
          )}
          {prop.submitData.length > 0 ? (
            prop.item.method === 'point' ? (
              <>
                <CRow>
                  <CCol sm='2' className='py-1 d-flex align-items-center pr-0'>
                    Nhập điểm:
                  </CCol>
                  <CCol md='2' className='py-1 d-flex align-items-center pl-0'>
                    <input
                      className='form-control'
                      type='number'
                      value={point}
                      onChange={(e) => {
                        setPoint(e.target.value)
                        if (
                          e.target.value === '' ||
                          isNaN(e.target.value as any)
                        ) {
                          prop.cancelSubmit()
                        } else {
                          const payload = {
                            subId: subItem.id,
                            point: Number(e.target.value),
                          }
                          dispatch(updatePoint(payload))
                          prop.activateSubmit()
                        }
                      }}
                    />
                  </CCol>

                  {prop.item.evidence ? (
                    <>
                      <CCol
                        md='auto'
                        className='py-1 d-flex align-items-center'>
                        {subItem.file === '' ? (
                          'Minh chứng'
                        ) : (
                          <>
                            Minh chứng :
                            <FaCheck color={'green'} className='ml-2' /> Đã nhận
                          </>
                        )}
                      </CCol>
                      <CCol md='4' className='py-1 d-flex align-items-center'>
                        {showAddFile ? (
                          <>
                            <label
                              htmlFor={subItem.id.toString()}
                              className='custom-file-upload'>
                              Nộp File
                            </label>
                            <input
                              id={subItem.id.toString()}
                              type='file'
                              onChange={(e: any) => {
                                onFileChange(e, subItem.id)
                              }}
                            />
                          </>
                        ) : (
                          <>
                            {!isDisableReviewButton ? (
                              <CButton
                                color='info'
                                onClick={() => {
                                  prop.onShowClk(subItem.file)
                                }}
                                disabled={isDisableReviewButton}
                                className='mr-3'>
                                Xem
                              </CButton>
                            ) : (
                              <CButton
                                color='info'
                                onClick={() => {
                                  prop.onPreviewClk(subItem.file)
                                }}
                                className='mr-3'>
                                Xem lại
                              </CButton>
                            )}
                            <CButton
                              color='info'
                              onClick={() => {
                                const payload = {
                                  subId: subItem.id,
                                  file: '',
                                }
                                dispatch(updateFile(payload))
                                setShowAddFile(true)
                              }}>
                              Hủy
                            </CButton>
                          </>
                        )}
                      </CCol>{' '}
                    </>
                  ) : (
                    <></>
                  )}
                </CRow>
                {isBigFile ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      Tập tin phải có kích thước bé hơn 2MB
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
                {isWrongType ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      Tập tin phải có định dạng
                      .jpg,.jpeg,.png,.doc,.docx,.pdf,.zip
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
                {prop.typeOb === 'COMPETITION' && (
                  <>
                    <CRow>
                      <CCol
                        sm='2'
                        className='py-1 d-flex align-items-center pr-0'>
                        Nhận xét:
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xl='12' className=''>
                        <textarea
                          rows={10}
                          className='form-control'
                          style={{
                            backgroundColor: '#e8edf2',
                          }}
                          value={studentComment}
                          onChange={(e) => {
                            setStudentComment(e.target.value)
                            const payload = {
                              subId: subItem.id,
                              studentComment: e.target.value,
                            }
                            dispatch(updateStudentComment(payload))
                          }}></textarea>
                      </CCol>
                    </CRow>
                  </>
                )}
              </>
            ) : prop.item.method === 'binary' ? (
              <>
                <CRow>
                  <CCol sm='2' className='py-1 d-flex align-items-center pr-0'>
                    Đánh giá:
                  </CCol>
                  <CCol md='2' className='py-1 d-flex align-items-center pl-0'>
                    <input
                      type='checkbox'
                      checked={bin}
                      style={{ marginTop: '0.5vh', marginLeft: '0.5vw' }}
                      onChange={() => {
                        setBin(!bin)
                        const payload = {
                          subId: subItem.id,
                          bin: !bin,
                        }
                        dispatch(updateBin(payload))
                      }}
                    />
                    <label style={{ marginBottom: '0', marginLeft: '1vw' }}>
                      Đạt
                    </label>
                  </CCol>
                  {prop.item.evidence ? (
                    <>
                      <CCol
                        md='auto'
                        className='py-1 d-flex align-items-center'>
                        {subItem.file === '' ? (
                          'Minh chứng'
                        ) : (
                          <>
                            Minh chứng :
                            <FaCheck color={'green'} className='ml-2' /> Đã nhận
                          </>
                        )}
                      </CCol>
                      <CCol md='4' className='py-1 d-flex align-items-center'>
                        {showAddFile ? (
                          <>
                            <label
                              htmlFor={subItem.id.toString()}
                              className='custom-file-upload'>
                              Nộp File
                            </label>
                            <input
                              id={subItem.id.toString()}
                              type='file'
                              onChange={(e: any) => {
                                onFileChange(e, subItem.id)
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <CCol
                              md='auto'
                              className='py-1 d-flex align-items-center'>
                              {!isDisableReviewButton ? (
                                <CButton
                                  color='info'
                                  onClick={() => {
                                    prop.onShowClk(subItem.file)
                                  }}
                                  disabled={isDisableReviewButton}
                                  className='mr-3'>
                                  Xem
                                </CButton>
                              ) : (
                                <CButton
                                  color='info'
                                  onClick={() => {
                                    prop.onPreviewClk(subItem.file)
                                  }}
                                  className='mr-3'>
                                  Xem lại
                                </CButton>
                              )}
                            </CCol>
                            <CCol
                              md='auto'
                              className='py-1 d-flex align-items-center'>
                              <CButton
                                color='info'
                                onClick={() => {
                                  const payload = {
                                    subId: subItem.id,
                                    file: '',
                                  }
                                  dispatch(updateFile(payload))
                                  setShowAddFile(true)
                                }}>
                                Hủy
                              </CButton>
                            </CCol>
                          </>
                        )}
                      </CCol>
                    </>
                  ) : (
                    <></>
                  )}
                </CRow>
                {isBigFile ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      Tập tin phải có kích thước bé hơn 2MB
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
                {isWrongType ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      Tập tin phải có định dạng
                      .jpg,.jpeg,.png,.doc,.docx,.pdf,.zip
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
              </>
            ) : prop.item.method === 'comment' ? (
              <CContainer>
                <CRow>
                  {prop.item.evidence ? (
                    <>
                      <CCol
                        md='auto'
                        className='py-1 px-0 pr-3 d-flex align-items-center'>
                        {subItem.file === '' ? (
                          'Minh chứng'
                        ) : (
                          <>
                            Minh chứng :{' '}
                            <FaCheck color={'green'} className='ml-2' /> Đã nhận
                          </>
                        )}
                      </CCol>
                      <CCol
                        md='4'
                        className='py-1 px-0 d-flex align-items-center'>
                        {showAddFile ? (
                          <>
                            <label
                              htmlFor={subItem.id.toString()}
                              className='custom-file-upload'>
                              Nộp File
                            </label>
                            <input
                              id={subItem.id.toString()}
                              type='file'
                              onChange={(e: any) => {
                                onFileChange(e, subItem.id)
                              }}
                            />
                          </>
                        ) : (
                          <>
                            {!isDisableReviewButton ? (
                              <CButton
                                color='info'
                                onClick={() => {
                                  prop.onShowClk(subItem.file)
                                }}
                                disabled={isDisableReviewButton}
                                className='mr-3'>
                                Xem
                              </CButton>
                            ) : (
                              <CButton
                                color='info'
                                onClick={() => {
                                  prop.onPreviewClk(subItem.file)
                                }}
                                className='mr-3'>
                                Xem lại
                              </CButton>
                            )}
                            <CButton
                              color='info'
                              onClick={() => {
                                const payload = {
                                  subId: subItem.id,
                                  file: '',
                                }
                                dispatch(updateFile(payload))
                                setShowAddFile(true)
                              }}>
                              Hủy
                            </CButton>
                          </>
                        )}
                      </CCol>{' '}
                    </>
                  ) : (
                    <></>
                  )}
                </CRow>
                {isBigFile ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      Tập tin phải có kích thước bé hơn 2MB
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
                {isWrongType ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      Tập tin phải có định dạng
                      .jpg,.jpeg,.png,.doc,.docx,.pdf,.zip
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}

                <CRow>
                  <CCol
                    sm='2'
                    className='py-1 px-0 d-flex align-items-center pr-0'>
                    Nhận xét:
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xl='12' className='px-0'>
                    <textarea
                      rows={10}
                      className='form-control'
                      style={{
                        backgroundColor: '#e8edf2',
                      }}
                      value={studentComment}
                      onChange={(e) => {
                        setStudentComment(e.target.value)
                        const payload = {
                          subId: subItem.id,
                          studentComment: e.target.value,
                        }
                        dispatch(updateStudentComment(payload))
                      }}></textarea>
                  </CCol>
                </CRow>
              </CContainer>
            ) : (
              <CContainer>
                <CRow>
                  <CCol
                    sm='2'
                    className='py-1 px-0 d-flex align-items-center pr-0'>
                    Tự đánh giá:
                  </CCol>
                  <CCol
                    md='auto'
                    className='py-1 px-0 d-flex align-items-center pr-0'>
                    <Select
                      id={subItem.id.toString() + '-select'}
                      value={
                        studentSelect !== ''
                          ? {
                              value: studentSelect,
                              label: studentSelect,
                            }
                          : null
                      }
                      options={prop.item.valueListString
                        .split(',')
                        .map((ele) => ele.trim())
                        .map((ele) => {
                          return { value: ele, label: ele }
                        })}
                      placeholder={'Tự đánh giá'}
                      onChange={(e: any) => {
                        const payload = {
                          subId: subItem.id,
                          studentSelect: e.value,
                        }
                        dispatch(updateStudentSelect(payload))
                        setStudentSelect(e.value)
                      }}
                    />
                  </CCol>
                  {prop.item.evidence ? (
                    <>
                      <CCol
                        md='auto'
                        className='py-1 d-flex align-items-center'>
                        {subItem.file === '' ? (
                          'Minh chứng'
                        ) : (
                          <>
                            Minh chứng :
                            <FaCheck color={'green'} className='ml-2' /> Đã nhận
                          </>
                        )}
                      </CCol>
                      <CCol md='4' className='py-1 d-flex align-items-center'>
                        {showAddFile ? (
                          <>
                            <label
                              htmlFor={subItem.id.toString()}
                              className='custom-file-upload'>
                              Nộp File
                            </label>
                            <input
                              id={subItem.id.toString()}
                              type='file'
                              onChange={(e: any) => {
                                onFileChange(e, subItem.id)
                              }}
                            />
                          </>
                        ) : (
                          <>
                            {!isDisableReviewButton ? (
                              <CButton
                                color='info'
                                onClick={() => {
                                  prop.onShowClk(subItem.file)
                                }}
                                disabled={isDisableReviewButton}
                                className='mr-3'>
                                Xem
                              </CButton>
                            ) : (
                              <CButton
                                color='info'
                                onClick={() => {
                                  prop.onPreviewClk(subItem.file)
                                }}
                                className='mr-3'>
                                Xem lại
                              </CButton>
                            )}
                            <CButton
                              color='info'
                              onClick={() => {
                                const payload = {
                                  subId: subItem.id,
                                  file: '',
                                }
                                dispatch(updateFile(payload))
                                setShowAddFile(true)
                              }}>
                              Hủy
                            </CButton>
                          </>
                        )}
                      </CCol>{' '}
                    </>
                  ) : (
                    <></>
                  )}
                </CRow>
                {isBigFile ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      Tập tin phải có kích thước bé hơn 2MB
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
                {isWrongType ? (
                  <CRow>
                    <CCol
                      xl='12'
                      className='ml-0 py-1'
                      style={{ color: 'red' }}>
                      Tập tin phải có định dạng
                      .jpg,.jpeg,.png,.doc,.docx,.pdf,.zip
                    </CCol>
                  </CRow>
                ) : (
                  <></>
                )}
              </CContainer>
            )
          ) : (
            <></>
          )}
        </CContainer>
      </CCardBody>
    </CCard>
  )
}

export default SubCrit
