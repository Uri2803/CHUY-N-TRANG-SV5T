import React, { Suspense, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./assets/styles/style.scss";
import "./App.css";
import "react-sortable-tree-patch-react-17/style.css";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/user";
import UserApi from "./api/Achievement/userApi";
import achievementApi from "./api/Achievement/achievementApi";
import TheLayout from "./components/TheLayout";
import { RootState } from "./store";
import { useHistory } from "react-router";
import UnAuthorized from "./common/Unauthorized";
import { setAchievementSideBar } from "./redux/achievementSideBar";
import { setUnAuthorized } from "./redux/unAuthorized";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {
    async function getSidebar() {
      try {
        const { count } = await achievementApi.getAllWithFilter(
          { limit: 10, page: 1, search: "" },
          true
        );
        if (count) dispatch(setAchievementSideBar(count));
      } catch (error) {
        console.error(error);
      }
    }
    async function getRefreshToken() {
      try {
        const userRefresh = await UserApi.refreshToken();
        dispatch(setUser(userRefresh));
        dispatch(setUnAuthorized(false));
        getSidebar();
      } catch (error: any) {
        if ([401, 409].includes(error?.response?.status)) {
          dispatch(setUnAuthorized(false));
          dispatch(setUser({ name: "" }));
        }
        console.log(error.message);
      }
    }
    if (user.name === "") getRefreshToken();
  }, [user.name, dispatch, history]);

  return (
    <Suspense fallback={<div></div>}>
      <BrowserRouter>
        <UnAuthorized />

        <TheLayout />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
