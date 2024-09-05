import { useState } from "react";
import { CButton, CDataTable, CTooltip } from "@coreui/react";
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

function ReportList(props: any) {
  const { achievementList } = props;
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);
  const [errMsg, setErrMsg] = useState("");
  const [showErrModel, setShowErrModel] = useState(false);
  const customAchievementList = achievementList
    .map((item: Achievement) => {
      let contentStatus = "Tiến hành duyệt";
      return {
        ...item,
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
      label: "Ngày mở nộp hồ sơ",
      sorter: false,
      filter: false,
      _style: { width: "12%", textAlign: "center" },
    },
    {
      key: "endSubmitAt",
      label: "Ngày đóng nộp hồ sơ",
      sorter: false,
      filter: false,
      _style: { width: "12%", textAlign: "center" },
    },
    {
      key: "endAt",
      label: "Ngày đóng duyệt hồ sơ",
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
          action: (item: any) => {
            return (
              <td className="d-flex justify-content-start">
                {[roles.DEPARTMENT].includes(user.role) &&
                  item.status === "Tiến hành duyệt" && (
                    <CTooltip content="Danh sách người dùng nộp hồ sơ">
                      <CButton
                        size="sm"
                        color="info"
                        className="ml-1 mt-1"
                        onClick={() => {
                          history.push(`/danh-sach-ket-qua-tham-dinh/${item.id}`);
                        }}
                      >
                        <CIcon size="sm" content={freeSet.cilDescription} />
                      </CButton>
                    </CTooltip>
                  )}
              </td>
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

export default ReportList;
