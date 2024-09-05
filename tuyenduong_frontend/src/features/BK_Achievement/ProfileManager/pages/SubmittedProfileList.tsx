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
  CCardHeader,
} from "@coreui/react";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import achievementApi from "../../../../api/Achievement/achievementApi";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { roles } from "../../../../common/roles";
import InputSearch from "../../../../common/InputFilterSearch";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import Moment from "react-moment";
import { CSVLink } from "react-csv";
import "moment/locale/vi";
import UserApi from "../../../../api/Achievement/userApi";
import FormUpdateProfile from "../components/formUpdateProfile";

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
    key: "updatedAt",
    label: "Cập nhật lần cuối",
    sorter: false,
    filter: false,
    _style: { textAlign: "center" },
  },
  {
    key: "confirm",
    label: "Duyệt",
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

const headers = [
  { label: "Mã số sinh viên", key: "mssv" },
  { label: "Họ và đệm", key: "surname" },
  { label: "Tên", key: "name" },
  { label: "Email", key: "email" },
  { label: "Đơn vị", key: "department" },
  { label: "Tình trạng", key: "result" },
];

interface TParam {
  id: string;
}

interface Filters {
  limit: number;
  page: number;
  search: string;
}

const SubmittedProfile = ({ match }: RouteComponentProps<TParam>) => {
  const achievementId = parseInt(match.params.id);
  const [achievement, setAchievement] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [count, setCount] = useState(1);
  const [dataCSV, setDataCSV] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: "",
  });
  const history = useHistory();
  const currentUser = useSelector((state: RootState) => state.user);
  const [modal, setModal] = useState({
    open: false,
    value: {
      id: 0,
      isVerified: false,
      idAchievement: 0,
    },
  });

  useEffect(() => {
    async function getAchievement(id: number) {
      const response = await achievementApi.get(id);
      setAchievement(response);
    }
    getAchievement(achievementId);
  }, [achievementId]);

  useEffect(() => {
    achievementApi
      .getUserSubmission(achievementId, { limit: 9999, page: 1, search: "" })
      .then(({ data }) => {
        setDataCSV(
          data.map((user: any) => ({
            ...user,
            result:
              user.result === 2
                ? "Đạt"
                : user.result === 1
                ? "Cần bổ sung hồ sơ"
                : user.result === 0
                ? "Không đạt"
                : "Hồ sơ chưa duyệt",
          }))
        );
      })
      .catch((error: any) => {
        console.error(error.message);
        history.push("/loi-truy-cap");
      });
  }, [achievementId, history]);

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
        const { data, count } = await achievementApi.getUserSubmission(
          id,
          filters
        );
        setCount(count);
        setData(data);
      } catch (error: any) {
        console.error(error.message);
        history.push("/loi-truy-cap");
      }
    }
    if ([roles.DEPARTMENT].includes(currentUser.role)) {
      getUserSubmission(achievementId);
    } else {
      verifyLogin();
      if (currentUser.id !== 0) {
        history.push("/loi-truy-cap");
      }
    }
  }, [achievementId, currentUser.role, currentUser.id, history, filters]);

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    });
  };

  const handleUpdateProfile = async (newProfile: any) => {
    setData(
      data.map((profile) =>
        profile.id === newProfile.id ? newProfile : profile
      )
    );
  };

  return (
    <>
      {[roles.DEPARTMENT].includes(currentUser.role) && (
        <CCard>
          <CCardHeader>
            <div className="d-flex align-items-center">
              <CTooltip content={`Quay lại`}>
                <CIcon
                  size="lg"
                  className="mr-2"
                  content={freeSet.cilArrowCircleLeft}
                  onClick={() => {
                    history.push(`/quan-ly-danh-hieu-cap-don-vi`);
                  }}
                />
              </CTooltip>
              <strong>
                TÊN DANH HIỆU/GIẢI THƯỞNG:{" "}
                {achievement ? achievement.name.toUpperCase() : ""}
              </strong>
            </div>
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
                className="d-flex justify-content-end align-items-center"
              >
                <div>Số lượng/ trang:</div>
                <CSelect
                  defaultValue={"10"}
                  style={{ width: "80px", float: "right", margin: "0 10px" }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFilters({ ...filters, limit: +e.currentTarget.value })
                  }
                >
                  <option value="5">5</option>
                  <option value="10" selected>
                    10
                  </option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </CSelect>

                {[roles.DEPARTMENT].includes(currentUser.role) && (
                  <CButton
                    color="info"
                    size=""
                    style={{ float: "right" }}
                    className=""
                  >
                    <CSVLink
                      data={dataCSV}
                      headers={headers}
                      filename={"danh-sach-nguoi-nop-ho-so.csv"}
                      style={{ color: "white" }}
                    >
                      Xuất dữ liệu
                    </CSVLink>
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
                      <td className="align-middle text-center">
                        <>
                          {[roles.DEPARTMENT].includes(currentUser.role) && (
                            <CTooltip content="Xem chi tiết hồ sơ">
                              <CButton
                                size="sm"
                                color="info"
                                className="ml-1 mt-1"
                                onClick={() =>
                                  history.push(
                                    `/duyet-ho-so-cap-don-vi/${achievementId}/${item.id}`
                                  )
                                }
                              >
                                <CIcon
                                  size="sm"
                                  content={freeSet.cilColorBorder}
                                />
                              </CButton>
                            </CTooltip>
                          )}
                        </>
                      </td>
                    </>
                  );
                },
                confirm: (item: any) => {
                  const content = item.isVerified;
                  return (
                    <td className="align-middle text-center">
                      <CTooltip content={content ? "Hủy xác nhận" : "Xác nhận"}>
                        <CButton
                          size="sm"
                          color={content ? "success" : "secondary"}
                          className="ml-1 mt-1"
                          onClick={() =>
                            setModal((modal) => ({
                              ...modal,
                              open: true,
                              value: {
                                id: item.id,
                                isVerified: item.isVerified,
                                idAchievement: achievementId,
                              },
                            }))
                          }
                        >
                          <CIcon size="sm" content={freeSet.cilCheckCircle} />
                        </CButton>
                      </CTooltip>
                    </td>
                  );
                },
              }}
            ></CDataTable>
            <div className={"mt-2 d-flex justify-content-center"}>
              <CPagination
                activePage={filters.page}
                className="align-middle text-center"
                pages={Math.ceil(count / filters.limit)}
                onActivePageChange={(i: number) =>
                  setFilters({ ...filters, page: i })
                }
              ></CPagination>
            </div>
          </CCardBody>
        </CCard>
      )}

      <FormUpdateProfile
        value={modal.value}
        onUpdateProfile={handleUpdateProfile}
        isOpen={modal.open}
        onClose={() =>
          setModal((data) => ({
            ...data,
            open: false,
          }))
        }
      />
    </>
  );
};

export default SubmittedProfile;
