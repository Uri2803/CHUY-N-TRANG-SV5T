import React, { useEffect, useState } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CDataTable,
  CTooltip,
  CPagination,
  CSelect,
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import achievementApi from "../../../../api/Achievement/achievementApi";
import Achievement from "../../../../types/Achievement";
import moment from "moment";
import UserApi from "../../../../api/Achievement/userApi";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import InputSearch from "../../../../common/InputFilterSearch";

interface Filters {
  limit: number;
  page: number;
  search: string;
}

const ShowHistoryAchievement = () => {
  const [achievementList, setAchievementList] = useState<Achievement[]>([]);
  const [result, setResult] = useState<any[]>([]);
  const history = useHistory();
  const [showList, setShowList] = useState<Achievement[]>([]);
  const [filters, setFilters] = useState<Filters>({
    limit: 10,
    page: 1,
    search: "",
  });
  const [count, setCount] = useState(1);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    const getData = async () => {
      try {
        const { data, count } = await achievementApi.getWithFilter(filters);

        const customAchievementList = data.map((item: Achievement) => {
          return {
            ...item,
            status: "Đã kết thúc",
          };
        });

        setAchievementList(customAchievementList);
        setCount(count);
      } catch (error: any) {
        console.error(error);
        history.push("/loi-truy-cap");
      }
    };
    verifyLogin();
    getData();
  }, [history, filters]);
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await UserApi.verifyLogin();
      } catch {
        history.push("/login");
      }
    };
    const getData = async () => {
      try {
        const userResult = await UserApi.resultAchievement();
        setResult(userResult);

        const newList = achievementList.filter((item) => {
          for (const res of userResult) {
            if (item.id === res.id) return true;
          }
          return false;
        });

        setShowList(newList);
      } catch (error: any) {
        console.error(error);
        history.push("/loi-truy-cap");
      }
    };
    verifyLogin();
    getData();
  }, [history, achievementList]);

  const handleChangeSearch = (formValue: { text: string }) => {
    setFilters({
      ...filters,
      page: 1,
      search: formValue.text,
    });
  };

  const fields = [
    {
      key: "name",
      label: "Tên Danh hiệu, Giải thưởng",
      _style: { textAlign: "center" },
    },
    {
      key: "startAt",
      label: "Thời gian bắt đầu",
      sorter: false,
      filter: false,
      _style: { width: "14%", textAlign: "center" },
    },
    {
      key: "deadlineAt",
      label: "Thời gian hết hạn",
      sorter: false,
      filter: false,
      _style: { width: "14%", textAlign: "center" },
    },

    {
      key: "status",
      label: "Trạng thái",
      _style: { width: "10%", textAlign: "center" },
      sorter: false,
      filter: false,
    },
    {
      key: "action",
      label: "Thao tác",
      _style: { textAlign: "center" },
      sorter: false,
      filter: false,
    },
  ];
  return (
    <CCard>
      <CCardHeader>
        <strong>LỊCH SỬ ĐỀ CỬ</strong>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-2">
          <CCol sm="4" className="d-flex align-items-center">
            <CTooltip content={`Tên danh hiệu/giải thưởng`}>
              <CIcon className="mr-1" size="lg" content={freeSet.cilFilter} />
            </CTooltip>
            <InputSearch onSubmit={handleChangeSearch} />
          </CCol>
          <CCol sm="4"></CCol>
          <CCol
            sm="4"
            className="d-flex justify-content-end align-items-center"
          >
            <div>Số lượng/ trang:</div>
            <CSelect
              defaultValue={"10"}
              style={{ width: "70px", float: "right", margin: "0 10px" }}
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
          </CCol>
        </CRow>
        <CDataTable
          items={showList}
          fields={fields}
          hover
          noItemsView={{
            noResults: "Không có kết quả tìm kiếm",
            noItems: "Không có dữ liệu",
          }}
          scopedSlots={{
            name: (item: Achievement) => {
              return (
                <td className="align-middle text-center">
                  <div> {item.name} </div>
                </td>
              );
            },
            startAt: (item: Achievement) => {
              return (
                <td className="align-middle text-center">
                  {moment(item.startAt).format("DD/MM/YYYY")}
                </td>
              );
            },
            deadlineAt: (item: Achievement) => {
              return (
                <td className="align-middle text-center">
                  {moment(item.endAt).format("DD/MM/YYYY")}
                </td>
              );
            },

            status: (item: any) => {
              let content = "Không có thông tin";
              let color = "secondary";
              for (const res of result) {
                if (res.id === item.id) {
                  if (!res.result) {
                    color = "info";
                    content = "Đang chờ duyệt";
                    break;
                  }
                  if (res.result === 2) {
                    color = "success";
                    content = "Được xác nhận đạt";
                  } else if (res.result === 1) {
                    color = "warning";
                    content = "Cần bổ sung hồ sơ";
                  } else if (res.result === 0) {
                    color = "danger";
                    content = "Không đạt";
                  }
                }
              }
              return (
                <td className="align-middle text-center">
                  <CBadge color={color}>{content.toUpperCase()}</CBadge>
                </td>
              );
            },
            action: (item: Achievement) => {
              return (
                <>
                  <td className="text-center">
                    <CTooltip content="Xem lại">
                      <CButton
                        size="sm"
                        color="info"
                        className="ml-1 mt-1"
                        onClick={() => {
                          history.push(`/de-cu/${item.id}`);
                        }}
                      >
                        <CIcon size="sm" content={freeSet.cilColorBorder} />
                      </CButton>
                    </CTooltip>
                  </td>
                </>
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
  );
};

export default ShowHistoryAchievement;
