import { CHeader, CHeaderNav, CToggler } from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { setSidebar } from "../../redux/sidebar";
import { RootState } from "../../store";
import TheHeaderDropdown from "./TheHeaderDropdown";

function TheHeader() {
  const sidebarShow = useSelector((state: RootState) => state.sidebar);
  const dispatch = useDispatch();

  const toggleSidebarMobile = () => {
    const status = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";

    dispatch(setSidebar(status));
  };

  const toggleSidebar = () => {
    const status = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch(setSidebar(status));
  };
  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderNav className="px-3 ml-auto float-right">
        <TheHeaderDropdown />
      </CHeaderNav>
    </CHeader>
  );
}

export default TheHeader;
