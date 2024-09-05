import React, { useEffect, useState, memo } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CNav,
  CNavItem,
  CNavLink,
  CPagination,
  CTooltip,
  CRow,
  CTabContent,
  CTabPane,
  CTabs,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import Auditor from "../auditor";
import AuditorApi from "../../../../api/Achievement/auditorApi";
import { freeSet } from "@coreui/icons";
import { RootState } from "../../../../store";
import { setInitCriteria } from "../../../../redux/auditor";
import { useDispatch, useSelector } from "react-redux";
import InputSearch from "../../../../common/InputFilterSearch";
import UserApi from "../../../../api/Achievement/userApi";
import moment from "moment";

interface Filters {
  limit: number;
  page: number;
  search: string;
}

const well = {
  boxShadow: "0px 4px 4px 4px rgba(23,28,255,0.24)",
};

const SubmissionUsers = (props: any) => {
  const achievement = props?.match?.params?.id;
  const {
    typeOb,
    achievementId: achievementIdProps,
    auditorId,
    isFinal,
    lockForever,
    seen,
  } = props;
  const achievementId = achievement || achievementIdProps;
  const [users, setUsers] = useState<any[]>([]);
  const [data, setData] = useState([]);
  const userId = useSelector((state: RootState) => state.user.id);
  const dispatch = useDispatch();
  const [textFind, setTextFind] = useState("Đang tìm kiếm...");
  const [infoUser, setInfoUser] = useState<any>({});
  const [getUserId, setUserId] = useState(0);
  const [count, setCount] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    limit: 5,
    page: 1,
    search: "",
  });

  useEffect(() => {
    async function getUsers() {
      try {
        const { count, data } = await AuditorApi.getUsers(
          achievementId,
          auditorId,
          filters
        );
        setCount(count);
        setUsers(data);
        setTextFind("Đang tìm kiếm...");
        setTimeout(() => {
          setTextFind("Không tìm thấy");
        }, 2000);
      } catch (error: any) {
        console.error(error.message);
      }
    }
    getUsers();
  }, [achievementId, filters, auditorId]);

  useEffect(() => {
    async function getInfoUser(id: number) {
      try {
        const response = await UserApi.get(id);
        setInfoUser(response);
      } catch (error) {
        console.error(error);
      }
    }

    if (showModal) getInfoUser(getUserId);
  }, [showModal, getUserId]);

  useEffect(() => {
    async function getSubmissionExamers() {
      try {
        const res = await AuditorApi.getSubmissionExamers(
          achievementId,
          userId,
          users.map((user) => user.id)
        );
        dispatch(setInitCriteria(res));
        setData(res);
      } catch (error: any) {
        console.log(error.message);
      }
    }
    async function getSubmissionWithAuditor(
      achievementId: number,
      auditorId: number
    ) {
      try {
        const res = await AuditorApi.getSubmissionExamers(
          achievementId,
          auditorId,
          users.map((user) => user.id)
        );
        setData(res);
      } catch (error: any) {
        console.error(error.message);
      }
    }

    if (auditorId) {
      getSubmissionWithAuditor(achievementId, auditorId);
    } else {
      getSubmissionExamers();
    }
  }, [achievementId, dispatch, userId, auditorId, users]);

  const handleValueInput: any = (value: string | number) => {
    if (!value) return "Chưa cung cấp";
    if (moment(value).isValid()) return moment(value).format("DD/MM/YYYY");
    return value;
  };

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    });
  };

  return (
    <CCard>
      <CCardBody>
        <CTabs>
          <CRow>
            <CCol
              className="mt-2 mb-2 border d-flex flex-column"
              xl="3"
              style={{ boxShadow: "0px 4px 4px 4px rgba(23,28,255,0.24)" }}
            >
              <CRow>
                <CCol sm="12" className="mt-2 mb-1  d-flex align-items-center">
                  <CTooltip content={`Tên, Mssv, Đơn vị`}>
                    <CIcon
                      className="mr-1"
                      size="lg"
                      content={freeSet.cilFilter}
                    />
                  </CTooltip>
                  <InputSearch onSubmit={handleChangeSearch} />
                </CCol>
                <CCol sm="12">
                  {users.length === 0 ? (
                    `${textFind}`
                  ) : (
                    <CNav
                      variant="pills"
                      className="flex-column mt-3"
                      role="tablist"
                    >
                      {users.map((user: any) => (
                        <CNavItem key={user?.id}>
                          
                          <CNavLink data-tab={user?.id}>
                            {
                              <CTooltip content={`Nhấn vào xem chi tiết`}>
                                <CIcon
                                  onClick={() => {
                                    setShowModal(true);
                                    setUserId(user.id);
                                  }}
                                  size="lg"
                                  content={freeSet.cilContact}
                                />
                              </CTooltip>
                            }

                            {` ${user?.surName} ${user?.name} - ${user?.mssv} `}
                            <br />
                            {`Đơn vị: ${user?.department}`}
                          </CNavLink>
                        </CNavItem>
                      ))}
                    </CNav>
                  )}
                </CCol>
                <CCol sm="12" className="d-flex justify-content-center">
                  <CPagination
                    activePage={filters.page}
                    className="align-self-center mt-3"
                    pages={Math.ceil(count / filters.limit)}
                    onActivePageChange={(i: number) =>
                      setFilters({ ...filters, page: i })
                    }
                  ></CPagination>
                </CCol>
              </CRow>
            </CCol>
            <CCol xl="9">
              <CTabContent>
                {users.map((user: any) => (
                  <CTabPane key={user.id} data-tab={user.id}>
                    {auditorId ? (
                      <Auditor
                        typeOb={typeOb}
                        dataParent={data.find(
                          (sub: any) => sub.examerId === user.id
                        )}
                        lockForever={lockForever}
                        seen={seen !== undefined ? seen : true}
                        achievementId={achievementId}
                        examerId={user.id}
                      />
                    ) : (
                      <Auditor
                        typeOb={typeOb}
                        dataSubmission={data.find(
                          (sub: any) => sub.examerId === user.id
                        )}
                        lockForever={lockForever}
                        seen={seen !== undefined ? seen : true}
                        isFinal={isFinal}
                        achievementId={achievementId}
                        examerId={user.id}
                      />
                    )}
                  </CTabPane>
                ))}
              </CTabContent>
            </CCol>
          </CRow>
        </CTabs>
        <CModal
          size="xl"
          color="info"
          show={showModal}
          onClose={() => setShowModal(false)}
        >
          <CModalHeader closeButton>
            <CModalTitle>Thông tin cá nhân</CModalTitle>
          </CModalHeader>

          <CModalBody>
            {Object.keys(infoUser).length === 0 ? (
              "Người dùng chưa cung cấp thông tin"
            ) : (
              <CRow>
                <CCol>
                  <CCard style={well}>
                    <CCardBody>
                      <CRow>
                        <CCol sm="8">
                          Họ và tên: {`${infoUser.surName} ${infoUser.name}`}
                        </CCol>
                        <CCol sm="4">
                          Giới tính:{" "}
                          {infoUser.contactInfoId.gender === "Male"
                            ? "Nam"
                            : infoUser.contactInfoId.gender === "Female"
                            ? "Nữ"
                            : "Khác"}
                        </CCol>
                        <CCol sm="8">Mã số sinh viên: {infoUser.mssv}</CCol>
                        <CCol sm="4">
                          Dân tộc:{" "}
                          {handleValueInput(infoUser.contactInfoId.nation)}
                        </CCol>
                        <CCol sm="12">Email: {infoUser.email}</CCol>
                        <CCol sm="12">
                          Email cá nhân: {infoUser.contactInfoId.emailPersonal}
                        </CCol>
                        <CCol sm="8">
                          Số điện thoại: {infoUser.contactInfoId.phone}
                        </CCol>
                        <CCol sm="4">
                          Ngày sinh:{" "}
                          {handleValueInput(infoUser.contactInfoId.birthday)}
                        </CCol>
                        <CCol sm="8">
                          Số CMND/CCCD:{" "}
                          {handleValueInput(infoUser.contactInfoId.CMND)}
                        </CCol>

                        <CCol sm="4">
                          Tôn giáo:{" "}
                          {handleValueInput(infoUser.contactInfoId.religion)}{" "}
                        </CCol>
                        <CCol sm="12">
                          Quê quán:{" "}
                          {handleValueInput(infoUser.contactInfoId.homeTown)}
                        </CCol>
                        <CCol sm="12">
                          Thường trú:{" "}
                          {handleValueInput(infoUser.contactInfoId.resident)}{" "}
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
                <CCol>
                  <CCard style={well}>
                    <CCardBody>
                      <CRow>
                        <CCol sm="12">Đơn vị: {infoUser.department.name} </CCol>
                        <CCol sm="12">
                          Nơi vào Đoàn:{" "}
                          {handleValueInput(infoUser.contactInfoId.placeUnion)}{" "}
                        </CCol>
                        <CCol sm="12">
                          Ngày vào Đoàn:{" "}
                          {handleValueInput(infoUser.contactInfoId.dateAtUnion)}{" "}
                        </CCol>
                        <CCol sm="12">
                          Nơi vào Đảng:{" "}
                          {handleValueInput(
                            infoUser.contactInfoId.placeCommunistParty
                          )}{" "}
                        </CCol>
                        <CCol sm="12">
                          Ngày vào Đảng:{" "}
                          {handleValueInput(
                            infoUser.contactInfoId.dateAtCommunistParty
                          )}{" "}
                        </CCol>
                        <CCol sm="12">
                          Ngày vào Hội sinh viên:{" "}
                          {handleValueInput(
                            infoUser.contactInfoId.studentAssociation
                          )}
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            )}
          </CModalBody>
        </CModal>
      </CCardBody>
    </CCard>
  );
};

export default memo(SubmissionUsers);
