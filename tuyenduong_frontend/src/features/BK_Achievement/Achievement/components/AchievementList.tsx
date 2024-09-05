import { useState } from "react";
import { CBadge, CButton, CDataTable, CTooltip } from "@coreui/react";
import Achievement from "../../../../types/Achievement";
import Moment from "react-moment";
import "moment/locale/vi";
import CIcon from "@coreui/icons-react";
import { freeSet } from "@coreui/icons";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { roles } from "../../../../common/roles";
import ErrorModelWithAText from "../../../../common/CommonErrorWithALineOfText";

function CourseList(props: any) {
  const { achievementList, handleCourseUpdate, handleCourseDelete } = props;
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);
  const [errMsg, setErrMsg] = useState("");
  const [showErrModel, setShowErrModel] = useState(false);
  const customAchievementList = achievementList.map((item: Achievement) => {
    const start = moment(item.startAt);
    const now = moment();
    const end = moment(item.endAt);
    let contentStatus = "Đang tiến hành";
    if (now.diff(end, "hours") > 0) {
      contentStatus = "Đã kết thúc";
    } else if (now.diff(start, "hours") < 0) {
      contentStatus = "Trạng thái chờ";
    }
    return {
      ...item,
      auditorFinalId: item?.auditorFinal?.id || -999,
      auditorsListId: item?.auditors?.map((auditor) => auditor.id) || [],
      status: contentStatus,
    };
  });

  const fields = [
    {
      key: "stt",
      label: "STT",
      _style: { textAlign: "center" },
    },
    {
      key: "name",
      label: "Tên Danh hiệu, Giải thưởng",
      _style: { textAlign: "center" },
    },
    {
      key: "startAt",
      label: "Ngày bắt đầu nộp",
      sorter: false,
      filter: false,
      _style: { width: "12%", textAlign: "center" },
    },
    {
      key: "endSubmitAt",
      label: "Ngày đóng nộp",
      sorter: false,
      filter: false,
      _style: { width: "12%", textAlign: "center" },
    },
    {
      key: "endAt",
      label: "Ngày đóng duyệt",
      sorter: false,
      filter: false,
      _style: { width: "12%", textAlign: "center" },
    },
    {
      key: "updatedAt",
      label: "Cập nhật lần cuối",
      sorter: false,
      filter: false,
      _style: { textAlign: "center" },
    },
    {
      key: "status",
      label: "Trạng thái",
      _style: { width: "10%", textAlign: "center" },
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
    <>
      <CDataTable
        items={customAchievementList}
        fields={fields}
        hover
        noItemsView={{
          noResults: "Không có kết quả tìm kiếm",
          noItems: "Không có dữ liệu",
        }}
        scopedSlots={{
          stt: (item: Achievement, index: number) => {
            return <td className="align-middle text-center">{index + 1}</td>;
          },
          name: (item: Achievement) => {
            return (
              <td className="align-middle">
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
          endSubmitAt: (item: Achievement) => {
            return (
              <td className="align-middle text-center">
                {moment(item.endSubmitAt).format("DD/MM/YYYY")}
              </td>
            );
          },
          endAt: (item: Achievement) => {
            return (
              <td className="align-middle text-center">
                {moment(item.endAt).format("DD/MM/YYYY")}
              </td>
            );
          },
          updatedAt: (item: Achievement) => {
            return (
              <td className="align-middle text-center">
                <Moment fromNow local locale="vi">
                  {item.updatedAt}
                </Moment>
              </td>
            );
          },
          status: (item: any) => {
            const content = item.status;
            let color = "danger";
            if (content === "Đã kết thúc") {
              color = "secondary";
            } else if (content === "Trạng thái chờ") {
              color = "warning";
            }
            return (
              <td className="align-middle text-center">
                <CBadge color={color}>{content}</CBadge>
              </td>
            );
          },
          action: (item: any) => {
            return (
              <>
                <td className="d-flex justify-content-start">
                  <>
                    {roles.MANAGER.includes(user.role) && (
                      <CTooltip content="Cập nhật thông tin Danh hiệu/Giải thưởng">
                        <CButton
                          size="sm"
                          color="info"
                          className="ml-1 mt-1"
                          onClick={() => handleCourseUpdate(item)}
                        >
                          <CIcon size="sm" content={freeSet.cilSettings} />
                        </CButton>
                      </CTooltip>
                    )}
                    {roles.MANAGER.includes(user.role) &&
                      item.status === "Trạng thái chờ" && (
                        <>
                          <CTooltip content="Quản lý tiêu chí">
                            <CButton
                              size="sm"
                              color="warning"
                              className="ml-1 mt-1"
                              onClick={() => {
                                history.push(`/quan-ly-tieu-chi/${item.id}`);
                              }}
                            >
                              <CIcon size="sm" content={freeSet.cilAlignLeft} />
                            </CButton>
                          </CTooltip>
                          <CTooltip content="Xóa Danh hiệu/Giải thưởng">
                            <CButton
                              size="sm"
                              color="danger"
                              className="ml-1 mt-1"
                              onClick={() => handleCourseDelete(item)}
                            >
                              <CIcon size="sm" content={freeSet.cilTrash} />
                            </CButton>
                          </CTooltip>
                        </>
                      )}
                    {item.status === "Đã kết thúc" &&
                      roles.MANAGER.includes(user.role) && (
                        <>
                          <CTooltip content="Quản lý hội đồng thẩm định hồ sơ">
                            <CButton
                              size="sm"
                              color="info"
                              className="ml-1 mt-1"
                              onClick={() => {
                                history.push(
                                  `/quan-ly-hoi-dong-tham-dinh/${item.id}`
                                );
                              }}
                            >
                              <CIcon size="sm" content={freeSet.cilUser} />
                            </CButton>
                          </CTooltip>

                          <CTooltip content="Danh sách người dùng nộp hồ sơ">
                            <CButton
                              size="sm"
                              color="info"
                              className="ml-1 mt-1"
                              onClick={() =>
                                history.push(`/danh-sach-nop-ho-so/${item.id}`)
                              }
                            >
                              <CIcon
                                size="sm"
                                content={freeSet.cilDescription}
                              />
                            </CButton>
                          </CTooltip>

                          <CTooltip content="Thống kê về danh hiệu">
                            <CButton
                              size="sm"
                              color="info"
                              className="ml-1 mt-1"
                              onClick={() =>
                                history.push(`/thong-ke-danh-hieu/${item.id}`)
                              }
                            >
                              <CIcon size="sm" content={freeSet.cilClipboard} />
                            </CButton>
                          </CTooltip>
                        </>
                      )}
                    {[roles.MANAGER].includes(user.role) &&
                      item.status === "Đang tiến hành" && (
                        <>
                          <CTooltip content="Danh sách người dùng nộp hồ sơ">
                            <CButton
                              size="sm"
                              color="info"
                              className="ml-1 mt-1"
                              onClick={() => {
                                history.push(`/danh-sach-nop-ho-so/${item.id}`);
                              }}
                            >
                              <CIcon
                                size="sm"
                                content={freeSet.cilDescription}
                              />
                            </CButton>
                          </CTooltip>

                          <CTooltip content="Danh sách chi tiết hồ sơ">
                            <CButton
                              size="sm"
                              color="info"
                              className="ml-1 mt-1"
                              onClick={() =>
                                history.push(`/chi-tiet-ho-so/${item.id}`)
                              }
                            >
                              <CIcon
                                size="sm"
                                content={freeSet.cilSpreadsheet}
                              />
                            </CButton>
                          </CTooltip>

                          <CTooltip content="Thống kê về danh hiệu">
                            <CButton
                              size="sm"
                              color="info"
                              className="ml-1 mt-1"
                              onClick={() =>
                                history.push(`/thong-ke-danh-hieu/${item.id}`)
                              }
                            >
                              <CIcon size="sm" content={freeSet.cilClipboard} />
                            </CButton>
                          </CTooltip>
                        </>
                      )}
                  </>
                </td>
              </>
            );
          },
        }}
      ></CDataTable>
      {showErrModel ? (
        <ErrorModelWithAText
          message={errMsg}
          show={true}
          modelClose={() => {
            setErrMsg("");
            setShowErrModel(false);
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default CourseList;
