import {
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CPagination,
  CTooltip,
  CRow,
  CSelect,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCardHeader,
  CModalFooter,
  CSpinner,
  CNavLink,
} from "@coreui/react";
import "moment/locale/vi";
import AuditorApi from "../../../../api/Achievement/auditorApi";
import React, { useEffect, useState } from "react";
import Toaster from "../../../../common/toast";
import achievementApi from "../../../../api/Achievement/achievementApi";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { roles } from "../../../../common/roles";
import InputSearch from "../../../../common/InputFilterSearch";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import Moment from "react-moment";
import "moment/locale/vi";
import UserApi from "../../../../api/Achievement/userApi";

const fields = [
  {
    key: "stt",
    label: "STT",
    _style: { textAlign: "center" },
  },
  {
    key: "mssv",
    label: "Mã số sinh viên",
    _style: { width: "10%", textAlign: "center" },
  },
  {
    key: "name",
    label: "Họ và tên",
    sorter: false,
    filter: false,
    _style: { textAlign: "center" },
  },
  {
    key: "email",
    label: "Email",
    _style: { width: "25%", textAlign: "center" },
  },
  {
    key: "department",
    label: "Đơn vị",
    _style: { width: "25%", textAlign: "center" },
  },
  {
    key: "status",
    label: "Tình trạng",
    _style: { textAlign: "center" },
  },
  {
    key: "updatedAt",
    label: "Cập nhật lần cuối",
    sorter: false,
    filter: false,
    _style: { textAlign: "center" },
  },
  {
    key: "action",
    label: "Thao tác",
    _style: { textAlign: "center" },
    sorter: false,
    filter: false,
  },
];

interface TParam {
  id: string;
}

const fieldsCopyTable = [
  {
    key: "name",
    label: "Tên người duyệt",
    sorter: false,
    filter: false,
    _style: { textAlign: "center" },
  },
  {
    key: "email",
    label: "Email",
    sorter: false,
    filter: false,
    _style: { width: "20%", textAlign: "center" },
  },
  {
    key: "result",
    label: "Kết quả",
    sorter: false,
    filter: false,
    _style: { textAlign: "center" },
  },
  {
    key: "action",
    label: "Thao tác",
    sorter: false,
    filter: false,
    _style: { textAlign: "center" },
  },
];

interface Filters {
  limit: number;
  page: number;
  search: string;
}

const ExpertiseProfilePage = ({ match }: RouteComponentProps<TParam>) => {
  const achievementId = parseInt(match.params.id);
  const [data, setData] = useState<any[]>([]);
  const [achievement, setAchievement] = useState<any>();
  const [count, setCount] = useState(1);
  const [lockModal, setLockModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copyAllModal, setCopyAllModal] = useState(false);
  const [copyOneModal, setCopyOneModal] = useState(false);
  const [isToast, setIsToast] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [resultCopyOne, setResultCopyOne] = useState([]);
  const [powerModal, setPowerModal] = useState(false);
  const [lock, setLock] = useState<boolean>();
  const [textError, setTextError] = useState("");
  const [lockForever, setLockForever] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: "",
  });
  const history = useHistory();
  const currentUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
    async function getAchievement(id: number) {
      const response = await achievementApi.get(id);
      setAchievement({
        ...response,
        auditorFinalId: response?.auditorFinal?.id || -999,
        auditorsListId: response?.auditors?.map((auditor) => auditor.id) || [],
      });
    }
    getAchievement(achievementId);
  }, [achievementId]);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    async function getUserSubmission(id: number) {
      try {
        const { data: users, count } =
          await achievementApi.getUserSubmissionToExpertise(id, filters);
        setCount(count);

        setData(users);
      } catch (error: any) {
        console.error(error.message);
        history.push("/loi-truy-cap");
      }
    }
    if (currentUser.auditors.length > 0) {
      getUserSubmission(achievementId);
    } else {
      verifyLogin();
      if (currentUser.id !== 0) {
        history.push("/loi-truy-cap");
      }
    }
  }, [achievementId, currentUser.auditors, currentUser.id, history, filters]);

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    });
  };

  const handleSendCopy = async (item: any) => {
    try {
      setIsDisable(true);
      await AuditorApi.createResultOfCriteria(
        item?.criterias,
        achievementId,
        item.result,
        item.examerId
      );
      setIsToast(true);
      setCopyOneModal(false);
      setTimeout(() => {
        setIsToast(false);
        setIsDisable(false);
        history.go(0);
      }, 2000);
    } catch (error: any) {
      console.error(error.message);
    }
  };
  const handleClickCopy = async (idUser: any) => {
    try {
      const response = await AuditorApi.getResultToRefer(
        achievementId,
        currentUser.id,
        idUser
      );
      setResultCopyOne(response);
      setCopyOneModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyResult = async (achievementId: any) => {
    setIsLoading(true);
    setCopyAllModal(false);
    const response = await achievementApi.copyAllResult(achievementId);
    console.log(response);
    if (response?.message !== "") {
      setIsLoading(false);
      history.go(0);
    }
  };

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    async function getStatus() {
      const { lock } = await achievementApi.get(achievementId);
      if (lock === "temporary") setLock(true);
      else if (lock === "forever") setLockForever(true);
      else setLock(false);
    }
    verifyLogin();
    getStatus();
  }, [achievementId, history]);
  useEffect(() => {
    if (!lockModal || !powerModal) setTextError("");
  }, [lockModal, powerModal]);
  const handleUnLock = async () => {
    try {
      await achievementApi.setStatus("UNLOCK", achievementId);
      setLock(false);
    } catch (error: any) {
      if (error?.response.data.statusCode === 400)
        setTextError(error?.response.data.message);
      else {
        console.error(error);
      }
    }
  };
  const handleLock = async (status: string) => {
    try {
      if (status === "TEMPORARY") {
        await achievementApi.setStatus(status, achievementId);
        setLock(true);
        setLockModal(false);
      } else if (status === "FOREVER") {
        const result = await achievementApi.setStatus(status, achievementId);
        if (result) setLockForever(true);
        setPowerModal(false);
      }
    } catch (error: any) {
      if (error?.response.data.statusCode === 400)
        setTextError(error?.response.data.message);
      else {
        console.error(error);
      }
    }
  };

  return (
    <>
      {[roles.MANAGER, roles.PARTICIPANT, roles.DEPARTMENT].includes(
        currentUser.role
      ) && (
        <CCard>
          <CCardHeader>
            <CRow className="align-items-center">
              <CTooltip content={`Quay lại`}>
                <CIcon
                  size="lg"
                  className="mx-2"
                  content={freeSet.cilArrowCircleLeft}
                  onClick={() => {
                    history.push("/tham-tra");
                  }}
                />
              </CTooltip>
              <strong>
                DANH SÁCH HỒ SƠ:{" "}
                {achievement ? achievement.name?.toUpperCase() : ""}
              </strong>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-2">
              <CCol sm="4" className="d-flex align-items-center">
                <CTooltip content={`Mssv, Tên, Email, Đơn vị`}>
                  <CIcon
                    className="mr-1"
                    size="lg"
                    content={freeSet.cilFilter}
                  />
                </CTooltip>
                <InputSearch onSubmit={handleChangeSearch} />
              </CCol>
              <CCol sm="2"></CCol>
              <CCol
                sm="6"
                className="d-flex justify-content-end align-items-center">
                <div>Số lượng/ trang:</div>
                <CSelect
                  defaultValue={"10"}
                  style={{ width: "80px", float: "right", margin: "0 10px" }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFilters({ ...filters, limit: +e.currentTarget.value })
                  }>
                  <option value="5">5</option>
                  <option value="10" selected>
                    10
                  </option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </CSelect>
                {lockForever ||
                  ![achievement?.auditorFinalId].includes(currentUser.id) || (
                    <CButton
                      size="sm"
                      className="ml-1 d-fex align-items-center"
                      color="warning"
                      onClick={() => setCopyAllModal(true)}>
                      <CIcon
                        className="mr-1"
                        size="sm"
                        content={freeSet.cilCopy}
                      />
                      Sao chép toàn bộ
                    </CButton>
                  )}
                {lockForever ||
                  ![achievement?.auditorFinalId].includes(currentUser.id) ||
                  (lock ? (
                    <>
                      <CButton
                        size="sm"
                        className="ml-1 d-fex align-items-center"
                        color="secondary"
                        onClick={handleUnLock}>
                        <CIcon
                          className="mr-1"
                          size="sm"
                          content={freeSet.cilLockLocked}
                        />
                        Khóa tạm thời (khóa)
                      </CButton>
                    </>
                  ) : (
                    <CButton
                      className="ml-1 d-fex align-items-center"
                      size="sm"
                      color="light"
                      onClick={() => setLockModal(true)}>
                      <CIcon
                        className="mr-1"
                        size="sm"
                        content={freeSet.cilLockUnlocked}
                      />
                      Khóa tạo thời (mở)
                    </CButton>
                  ))}
                {lockForever ||
                  ![achievement?.auditorFinalId].includes(currentUser.id) || (
                    <CButton
                      style={{ cursor: "pointer" }}
                      size="sm"
                      className="ml-1 align-middle d-fex align-items-center"
                      color="danger"
                      onClick={() => setPowerModal(true)}>
                      <CIcon
                        className="mr-1"
                        size="sm"
                        content={freeSet.cilPowerStandby}
                      />
                      Kết thúc thẩm định
                    </CButton>
                  )}
              </CCol>
            </CRow>

            <CDataTable
              items={data}
              fields={fields}
              noItemsView={{
                noResults: "Không có kết quả tìm kiếm",
                noItems: "Không có dữ liệu",
              }}
              scopedSlots={{
                stt: (item: any, index: number) => {
                  return (
                    <td className="align-middle text-center">{index + 1}</td>
                  );
                },
                mssv: (item: any) => {
                  return (
                    <td className="align-middle text-center">{item.mssv}</td>
                  );
                },
                name: (item: any) => {
                  return (
                    <td className="align-middle">
                      {item.surname + " " + item.name}
                    </td>
                  );
                },
                email: (item: any) => {
                  return <td className="align-middle">{item.email}</td>;
                },
                department: (item: any) => {
                  return <td className="align-middle">{item.department}</td>;
                },
                status: (item: any) => {
                  return (
                    <td className="align-middle text-center">
                      {item.result === 2
                        ? "Đạt"
                        : item.result === 1
                        ? "Cần bổ sung hồ sơ"
                        : item.result === 0
                        ? "Không đạt"
                        : "Hồ sơ chưa duyệt"}
                    </td>
                  );
                },
                updatedAt: (item: any) => {
                  return (
                    <td className="align-middle text-center">
                      <Moment fromNow local locale="vi">
                        {item.updatedAt}
                      </Moment>
                    </td>
                  );
                },
                action: (item: any) => {
                  return (
                    <>
                      <td className="d-flex justify-content-start align-items-center">
                        <>
                          {[
                            roles.MANAGER,
                            roles.PARTICIPANT,
                            roles.DEPARTMENT,
                          ].includes(currentUser.role) &&
                            [...achievement?.auditorsListId].includes(
                              currentUser.id
                            ) && (
                              <CTooltip
                                content={
                                  lockForever ? "Xem hồ sơ" : "Duyệt hồ sơ"
                                }>
                                <CNavLink
                                  href={`/tham-dinh-ho-so/${achievement.id}/${item.id}`}>
                                  <CButton
                                    size="sm"
                                    color="info"
                                    className="ml-1 mt-1">
                                    <CIcon
                                      size="sm"
                                      content={freeSet.cilColorBorder}
                                    />
                                  </CButton>
                                </CNavLink>
                              </CTooltip>
                            )}
                          {[
                            roles.MANAGER,
                            roles.PARTICIPANT,
                            roles.DEPARTMENT,
                          ].includes(currentUser.role) &&
                            [achievement?.auditorFinalId].includes(
                              currentUser.id
                            ) && (
                              <>
                                <CTooltip
                                  content={
                                    lockForever ? "Xem hồ sơ" : "Duyệt hồ sơ"
                                  }>
                                  <CNavLink
                                    className="p-0"
                                    href={`/ket-luan-tham-dinh-ho-so/${achievement.id}/${item.id}`}>
                                    <CButton
                                      size="sm"
                                      color="info"
                                      className="ml-1 mt-1">
                                      <CIcon
                                        size="sm"
                                        content={freeSet.cilColorBorder}
                                      />
                                    </CButton>
                                  </CNavLink>
                                </CTooltip>
                                {!lockForever && (
                                  <CTooltip content="Sao chép kết quả">
                                    <CButton
                                      size="sm"
                                      color="info"
                                      disabled={isDisable}
                                      className="ml-1 mt-1"
                                      onClick={() => handleClickCopy(item.id)}>
                                      <CIcon
                                        size="sm"
                                        content={freeSet.cilLibrary}
                                      />
                                    </CButton>
                                  </CTooltip>
                                )}
                              </>
                            )}
                        </>
                      </td>
                    </>
                  );
                },
              }}></CDataTable>
            <div className={"mt-2 d-flex justify-content-center"}>
              <CPagination
                activePage={filters.page}
                className="align-middle text-center"
                pages={Math.ceil(count / filters.limit)}
                onActivePageChange={(i: number) =>
                  setFilters({ ...filters, page: i })
                }></CPagination>
            </div>
          </CCardBody>
        </CCard>
      )}

      <CModal
        show={lockModal}
        className="mt-5"
        onClose={() => setLockModal(false)}
        color="warning">
        <CModalHeader closeButton>
          <CModalTitle>Khóa tạm thời</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div style={{ color: "red", marginBottom: "10px" }}>{textError}</div>
          Thành viên hội đồng thẩm định hồ sơ sẽ{" "}
          <b> không thể thẩm định hồ sơ </b> cho tới khi khóa được mở
        </CModalBody>

        <CModalFooter>
          <CButton color="info" onClick={() => handleLock("TEMPORARY")}>
            Xác nhận
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        show={copyAllModal}
        className="mt-5"
        onClose={() => setCopyAllModal(false)}
        color="warning">
        <CModalHeader closeButton>
          <CModalTitle>Sao chép toàn bộ kết quả thẩm định</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div style={{ color: "red", marginBottom: "10px" }}>{textError}</div>
          Sao chép <b> sẽ ghi đè </b> toàn bộ thông tin đã kết luận trước đó.
        </CModalBody>

        <CModalFooter>
          <CButton
            color="warning"
            onClick={() => handleCopyResult(achievementId)}>
            Xác nhận
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal show={isLoading} className="mt-5">
        <CModalBody className="py-5">
          <CRow className="justify-content-center">
            <CSpinner color="dark" />
          </CRow>
          <CRow className="justify-content-center text-dark mt-3">
            <strong>Loading...</strong>
          </CRow>
        </CModalBody>
      </CModal>
      <CModal
        show={powerModal}
        className="mt-5"
        onClose={() => setPowerModal(false)}
        color="danger">
        <CModalHeader closeButton>
          <CModalTitle>Kết thúc thẩm định hồ sơ</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div style={{ color: "red", marginBottom: "10px" }}>{textError}</div>
          Thẩm định hồ sơ sẽ <b> kết thúc ngay lập tức </b>
        </CModalBody>

        <CModalFooter>
          <CButton color="danger" onClick={() => handleLock("FOREVER")}>
            Xác nhận
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        show={copyOneModal}
        className="mt-5"
        size="lg"
        onClose={() => setCopyOneModal(false)}
        color="info">
        <CModalHeader closeButton>
          <CModalTitle>Sao chép kết quả</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {resultCopyOne.length > 0 && (
            <CDataTable
              items={resultCopyOne}
              fields={fieldsCopyTable}
              noItemsView={{
                noResults: "Không có kết quả tìm kiếm",
                noItems: "Người thẩm định hồ sơ chưa duyệt",
              }}
              scopedSlots={{
                name: (item: any) => (
                  <td className="align-middle text-start">
                    {item.infoAuditor.surName} {item.infoAuditor.name}
                  </td>
                ),
                email: (item: any) => (
                  <td className="align-middle text-start">
                    {item.infoAuditor.email}
                  </td>
                ),
                result: (item: any) => {
                  return (
                    <td className="align-middle text-center">
                      {item.result === 0
                        ? "Không đạt"
                        : item.result === 1
                        ? "Cần bổ sung hồ sơ"
                        : item.result === 2
                        ? "Đạt"
                        : "Hồ sơ chưa duyệt"}
                    </td>
                  );
                },
                action: (item: any) => {
                  return (
                    <td className="align-middle text-center">
                      <CTooltip content="Sao chép">
                        <CButton
                          size="sm"
                          color="info"
                          className="ml-1 mt-1"
                          onClick={() => handleSendCopy(item)}>
                          <CIcon size="sm" content={freeSet.cilCopy} />
                        </CButton>
                      </CTooltip>
                    </td>
                  );
                },
              }}></CDataTable>
          )}
        </CModalBody>
      </CModal>
      <Toaster isShow={isToast} />
    </>
  );
};

export default ExpertiseProfilePage;
