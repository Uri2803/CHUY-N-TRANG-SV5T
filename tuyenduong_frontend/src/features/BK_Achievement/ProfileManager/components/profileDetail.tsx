import React, { useEffect, useState, useCallback, memo } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CTabs,
  CCardHeader,
  CCollapse,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import AuditorApi from "../../../../api/Achievement/auditorApi";
import { freeSet } from "@coreui/icons";
import { RootState } from "../../../../store";
import { setInitCriteria } from "../../../../redux/auditor";
import { useDispatch, useSelector } from "react-redux";
import UserApi from "../../../../api/Achievement/userApi";
import moment from "moment";
import CardCollapse from "./CollapseVerify";
import { useHistory } from "react-router";
import { AuditorForAchievement } from "../../../../types/Auditor";
import achievementApi from "../../../../api/Achievement/achievementApi";

const SubmissionUsersTest = (props: any) => {
  const { id: achievement, mssv: mssvParam } = props?.match?.params;

  const {
    achievementId: achievementIdProps,
    seen,
    mssvProp,
  } = props;
  const history = useHistory();
  const mssv = mssvParam || mssvProp;
  const achievementId = achievement || achievementIdProps;
  const [data, setData] = useState<any[]>([]);
  const userId = useSelector((state: RootState) => state.user.id);
  const dispatch = useDispatch();
  const [infoUser, setInfoUser] = useState<any>({});
  const [collapseUser, setCollapseUser] = useState(true);
  const [typeObject, setTypeObject] = useState("ACHIEVEMENT");
  const [collapseDepartment, setCollapseDepartment] = useState(true);
  const [auditors, setAuditors] = useState<AuditorForAchievement[]>([]);
  useEffect(() => {
    async function getUsers() {
      try {
        const auditors: AuditorForAchievement[] =
          await AuditorApi.getAuditorsForAchievement(achievementId);
        if (auditors.length === 0) {
        } else {
          setAuditors(auditors);
        }
      } catch (error: any) {
        console.error(error);
      }
    }
    getUsers();
  }, [achievementId]);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    async function getStatus() {
      const { type } = await achievementApi.get(achievementId);
      setTypeObject(type || "ACHIEVEMENT");
    }
    verifyLogin();
    getStatus();
  }, [achievementId, history]);

  useEffect(() => {
    async function getInfoUser(mssv: string) {
      try {
        const response = await UserApi.getMssv(mssv);
        setInfoUser(response);
      } catch (error) {
        console.error(error);
      }
    }

    getInfoUser(mssv);
  }, [mssv]);

  const getChildNode = useCallback((data: Array<any>, parentNode: any) => {
    return data.filter((item) => parentNode.children.includes(item.idCriteria));
  }, []);

  useEffect(() => {
    async function getSubmissionExamers() {
      try {
        const res = await AuditorApi.getSubmissionExamers(
          achievementId,
          userId,
          [Number(mssv)]
        );
        dispatch(setInitCriteria(res));
        setData(res);
      } catch (error: any) {
        console.log(error.message);
      }
    }

    getSubmissionExamers();
  }, [achievementId, dispatch, userId, mssv]);

  const handleValueInput: any = (value: string | number) => {
    if (!value) return "Chưa cung cấp";
    if (moment(value).isValid() && typeof value === "string")
      return moment(value).format("DD/MM/YYYY");
    return value;
  };

  return (
    <>
      <CTabs activeTab={userId}>
        <CCard>
          <CCardHeader>
            <CTooltip content={`Quay lại`}>
              <CIcon
                size="lg"
                className="mr-3 mb-2"
                content={freeSet.cilArrowCircleLeft}
                onClick={() => {
                  history.push(
                    `/danh-sach-nop-ho-so-cap-don-vi/${achievementId}`
                  );
                }}
              />
            </CTooltip>
          </CCardHeader>

          <CCardBody>
            <CTabPane data-tab={userId}>
              <CTabs activeTab={mssv}>
                <CRow>
                  <CCol className="mt-2 mb-2 d-flex flex-column" xl="3">
                    <CRow>
                      <CCol sm="12">
                        <CNav
                          variant="pills"
                          className="flex-column mt-3"
                          role="tablist"
                        >
                            <CNavItem>
                              <CNavLink data-tab={mssv}>
                                <CIcon size="lg" content={freeSet.cilContact} />

                                {` ${infoUser?.surName} ${infoUser?.name} - ${infoUser?.mssv} `}
                                <br />
                                {`Đơn vị: ${infoUser?.department?.name}`}
                              </CNavLink>
                            </CNavItem>
                          {data[0]?.criterias?.map(
                            (item: any) =>
                              item.isRoot && (
                                <CNavItem key={item?.id}>
                                  <CNavLink data-tab={item?.id}>
                                    {item.nameCriteria}{" "}
                                  </CNavLink>
                                </CNavItem>
                              )
                          )}
                        </CNav>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol xl="9">
                    <CTabContent>
                      <CTabPane data-tab={mssv}>
                        {Object.keys(infoUser).length === 0 ? (
                          "Người dùng chưa cung cấp thông tin"
                        ) : (
                          <>
                            <CCard>
                              <CCardHeader
                                color="secondary"
                                onClick={() => setCollapseUser(!collapseUser)}
                              >
                                <h4>Thông tin cá nhân</h4>
                              </CCardHeader>
                              <CCollapse show={collapseUser}>
                                <CCardBody>
                                  <CRow>
                                    <CCol className="mb-2" sm="5">
                                      <strong>Họ và tên đệm:</strong>{" "}
                                      {infoUser.surName}
                                    </CCol>
                                    <CCol className="mb-2" sm="2">
                                      <strong>Tên:</strong> {infoUser.name}
                                    </CCol>
                                    <CCol className="mb-2" sm="5">
                                      <strong>Giới tính:</strong>{" "}
                                      {infoUser.contactInfoId.gender === "Male"
                                        ? "Nam"
                                        : infoUser.contactInfoId.gender ===
                                          "Female"
                                        ? "Nữ"
                                        : "Khác"}
                                    </CCol>
                                    <CCol className="mb-2" sm="5">
                                      <strong>Mã số sinh viên:</strong>{" "}
                                      {infoUser.mssv}
                                    </CCol>
                                    <CCol className="mb-2" sm="7">
                                      <strong>Email:</strong> {infoUser.email}
                                    </CCol>
                                    <CCol className="mb-2" sm="5">
                                      <strong>Số điện thoại:</strong>{" "}
                                      {infoUser.contactInfoId.phone === "0"
                                        ? "Chưa cung cấp"
                                        : infoUser.contactInfoId.phone}
                                    </CCol>
                                    <CCol className="mb-2" sm="7">
                                      <strong>Email cá nhân:</strong>{" "}
                                      {infoUser.contactInfoId.emailPersonal}
                                    </CCol>
                                    <CCol className="mb-2" sm="5">
                                      <strong>Số CMND/CCCD:</strong>{" "}
                                      {infoUser.contactInfoId.CMND === "0"
                                        ? "Chưa cung cấp"
                                        : infoUser.contactInfoId.CMND}
                                    </CCol>

                                    <CCol className="mb-2" sm="7">
                                      <strong>Ngày sinh:</strong>{" "}
                                      {handleValueInput(
                                        infoUser.contactInfoId.birthday
                                      )}
                                    </CCol>
                                    <CCol className="mb-2" sm="5">
                                      <strong>Dân tộc:</strong>{" "}
                                      {handleValueInput(
                                        infoUser.contactInfoId.nation
                                      )}
                                    </CCol>
                                    <CCol className="mb-2" sm="7">
                                      <strong>Tôn giáo:</strong>{" "}
                                      {handleValueInput(
                                        infoUser.contactInfoId.religion
                                      )}{" "}
                                    </CCol>
                                    <CCol className="mb-2" sm="12">
                                      <strong>Quê quán:</strong>{" "}
                                      {handleValueInput(
                                        infoUser.contactInfoId.homeTown
                                      )}
                                    </CCol>
                                    <CCol className="mb-2" sm="12">
                                      <strong>Thường trú:</strong>{" "}
                                      {handleValueInput(
                                        infoUser.contactInfoId.resident
                                      )}{" "}
                                    </CCol>
                                  </CRow>
                                </CCardBody>
                              </CCollapse>
                            </CCard>
                            <CCard>
                              <CCardHeader
                                color="secondary"
                                onClick={() =>
                                  setCollapseDepartment(!collapseDepartment)
                                }
                              >
                                <h4>Thông tin Đơn vị</h4>
                              </CCardHeader>
                              <CCollapse show={collapseDepartment}>
                                <CCardBody>
                                  <CRow>
                                    <CCol className="mb-2" sm="12">
                                      <strong>Đơn vị:</strong>{" "}
                                      {infoUser.department.name}{" "}
                                    </CCol>
                                    <CCol className="mb-2" sm="12">
                                      <strong>Ngày vào Hội sinh viên:</strong>{" "}
                                      {handleValueInput(
                                        infoUser.contactInfoId
                                          .studentAssociation
                                      )}
                                    </CCol>
                                    <CCol className="mb-2" sm="5">
                                      <strong>Nơi vào Đoàn:</strong>{" "}
                                      {handleValueInput(
                                        infoUser.contactInfoId.placeUnion
                                      )}{" "}
                                    </CCol>
                                    <CCol className="mb-2" sm="7">
                                      <strong>Ngày vào Đoàn:</strong>{" "}
                                      {handleValueInput(
                                        infoUser.contactInfoId.dateAtUnion
                                      )}{" "}
                                    </CCol>
                                    <CCol className="mb-2" sm="5">
                                      <strong>Nơi vào Đảng:</strong>{" "}
                                      {handleValueInput(
                                        infoUser.contactInfoId
                                          .placeCommunistParty
                                      )}{" "}
                                    </CCol>
                                    <CCol className="mb-2" sm="7">
                                      <strong>Ngày vào Đảng:</strong>{" "}
                                      {handleValueInput(
                                        infoUser.contactInfoId
                                          .dateAtCommunistParty
                                      )}{" "}
                                    </CCol>
                                    <CCol className="mb-2" sm="4"></CCol>
                                  </CRow>
                                </CCardBody>
                              </CCollapse>
                            </CCard>
                          </>
                        )}
                      </CTabPane>
                      {data[0]?.criterias?.map((item: any) =>
                        item.isRoot ? (
                          <CTabPane key={item?.id} data-tab={item?.id}>
                            <CardCollapse
                              typeOb={typeObject}
                              key={item.id}
                              isRoot={true}
                              achievementId={achievementId}
                              isFinal={
                                auditors.find(
                                  (auditor) =>
                                    auditor.id === userId && auditor.isFinal
                                )
                                  ? true
                                  : false
                              }
                              seen={seen}
                              getChildren={getChildNode}
                              data={item}
                              dataTotal={data[0].criterias}
                              examerId={infoUser.id}
                            />
                          </CTabPane>
                        ) : undefined
                      )}
                    </CTabContent>
                  </CCol>
                </CRow>
              </CTabs>
            </CTabPane>
          </CCardBody>
        </CCard>
      </CTabs>
    </>
  );
};

export default memo(SubmissionUsersTest);
