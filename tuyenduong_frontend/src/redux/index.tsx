import TCReducer from "./TieuChi";
import sidebar from "./sidebar";
import userReducer from "./user";
import auditorReducer from "./auditor";
import collapseAuditorReducer from "./collapseAuditor";
import submissionReducer from "./submission";
import departmentReducer from "./department";
import spinnerReducer from "./spinner";
import achievementSideBarReducer from "./achievementSideBar";
import unAuthorizedReducer from "./unAuthorized";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  tieuchi: TCReducer,
  sidebar: sidebar,
  user: userReducer,
  auditor: auditorReducer,
  collapseAuditor: collapseAuditorReducer,
  submission: submissionReducer,
  department: departmentReducer,
  spinner: spinnerReducer,
  unAuthorized: unAuthorizedReducer,
  achievementSideBar: achievementSideBarReducer,
})

export default rootReducer;

export type State = ReturnType<typeof rootReducer>;
