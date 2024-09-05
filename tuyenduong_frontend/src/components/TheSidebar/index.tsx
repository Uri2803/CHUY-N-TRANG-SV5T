import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavTitle,
  CSidebarNavItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import logo_BK from "../../assets/images/logo_BK.png";
import navigation from "./navigation";
import { RootState } from "../../store";
import { setSidebar } from "../../redux/sidebar";

function TheSidebar() {
  const sidebarShow = useSelector((state: RootState) => state.sidebar);
  const currentUser = useSelector((state: RootState) => state.user);
  const countAchievement = useSelector(
    (state: RootState) => state.achievementSideBar
  );
  const dispatch = useDispatch();
  const [list, setList] = useState<any>([]);
  useEffect(() => {
    async function listenUser() {
      const list = navigation.filter((item) => {
        return (
          item.role.includes(currentUser.role) ||
          (item.to === "/tham-tra" &&
            countAchievement !== 0 &&
            currentUser.auditors.length > 0) ||
          (item?._children?.includes("Quản lý Danh hiệu") &&
            countAchievement !== 0 &&
            currentUser.role === "department" &&
            currentUser.auditors.length > 0)
        );
      });
      setList(list);
    }
    if (currentUser.id !== 0) {
      listenUser();
    }
  }, [countAchievement, currentUser.role, currentUser.id, currentUser.auditors.length]);
  return (
    <CSidebar
      show={sidebarShow as boolean | "" | "responsive" | undefined}
      onShowChange={(val: any) => dispatch(setSidebar(val))}
      colorScheme="dark"
    >
      <CSidebarBrand className="d-md-down-none">
        <CIcon className="c-sidebar-brand-full" src={logo_BK} height={35} />
      </CSidebarBrand>

      <CSidebarNav>
        <CCreateElement
          items={list}
          components={{ CSidebarNavTitle, CSidebarNavItem }}
        />
      </CSidebarNav>
    </CSidebar>
  );
}

export default TheSidebar;
