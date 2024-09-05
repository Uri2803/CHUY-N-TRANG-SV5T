import CIcon from "@coreui/icons-react";
import { freeSet, brandSet } from "@coreui/icons";
import { roles } from "../../common/roles";
import React from "react";

let navigation: any[] = [
  {
    _tag: "CSidebarNavItem",
    name: "Quản lý thông tin",
    to: "/thong-tin-can-bo",
    role: [roles.ADMIN, roles.MANAGER, roles.DEPARTMENT],
    icon: (
      <CIcon content={freeSet.cilHome} customClasses="c-sidebar-nav-icon" />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Quản lý thông tin",
    to: "/thong-tin",
    role: [roles.PARTICIPANT],
    icon: (
      <CIcon content={freeSet.cilHome} customClasses="c-sidebar-nav-icon" />
    ),
  },
  
  {
    _tag: "CSidebarNavTitle",
    role: [roles.MANAGER, roles.PARTICIPANT],
    _children: ["Quản lý Danh hiệu"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Quản lý Danh hiệu/Giải thưởng",
    to: "/danh-hieu",
    role: [roles.MANAGER],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Thẩm tra hồ sơ",
    to: "/tham-tra",
    role: [],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Đề cử Danh hiệu/Giải thưởng",
    to: "/de-cu",
    role: [roles.PARTICIPANT],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Lịch sử đề cử",
    to: "/lich-su-de-cu",
    role: [roles.PARTICIPANT],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  
  {
    _tag: "CSidebarNavTitle",
    role: [roles.ADMIN],
    _children: ["Cấu hình hệ thống"],
  },
  {
    _tag: "CSidebarNavItem",
    name: "Quản lý người dùng",
    to: "/quan-li-nguoi-dung",
    role: [roles.ADMIN],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Quản lý Đơn vị",
    to: "/department-manager",
    role: [roles.ADMIN],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },

  {
    _tag: "CSidebarNavTitle",
    role: [roles.DEPARTMENT],
    _children: ["Quản lí Đơn vị"],
  },

  {
    _tag: "CSidebarNavItem",
    name: "Quản lý hồ sơ danh hiệu",
    to: "/quan-ly-danh-hieu-cap-don-vi",
    role: [roles.DEPARTMENT],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
  {
    _tag: "CSidebarNavItem",
    name: "Xem kết quả thẩm định",
    to: "/xem-ket-qua-tham-dinh",
    role: [roles.DEPARTMENT],
    icon: (
      <CIcon
        content={brandSet.cibCoursera}
        customClasses="c-sidebar-nav-icon"
      />
    ),
  },
];

export default navigation;
