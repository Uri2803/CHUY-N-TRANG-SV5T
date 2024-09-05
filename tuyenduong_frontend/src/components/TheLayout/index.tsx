import { Redirect, Route, Switch } from "react-router";
import LoginGoogle from "../../features/BK_Achievement/Auth/Login";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { CContainer, CFade } from "@coreui/react";
import TheSidebar from "../TheSidebar";
import { Suspense } from "react";
import Page404 from "../../common/pages/page404";
import TheHeader from "../TheHeader";
import routes from "../../routes";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);
function TheLayout() {
  const user = useSelector((state: RootState) => state.user);
  return (
    <>
      <Switch>
        <Route exact path="/" render={(props) => <Redirect to="/login" />} />
        <Route
          exact
          path="/login"
          render={(props) =>
            user.name !== "" ? (
              user.role === "participant" ? (
                <Redirect to="/de-cu" />
              ) : user.role === "manager" ? (
                <Redirect to="/danh-hieu" />
              ) : (
                <Redirect to="/quan-li-nguoi-dung" />
              )
            ) : (
              <LoginGoogle />
            )
          }
        />
        {routes.map((route, idx) => {
          return (
            route.component && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                render={(props) => {
                  return (
                    <div className="c-app c-default-layout">
                      <TheSidebar />
                      <div className="c-wrapper">
                        <TheHeader />
                        <div className="c-body">
                          <main
                            className="c-main"
                            style={{ paddingTop: "3vh" }}
                          >
                            <CContainer fluid>
                              <Suspense fallback={loading}>
                                <CFade>
                                  <route.component {...props} />
                                </CFade>
                              </Suspense>
                            </CContainer>
                          </main>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            )
          );
        })}
        <Route
          render={(props) => {
            return (
              <div className="c-app c-default-layout">
                <TheSidebar />
                <div className="c-wrapper">
                  <TheHeader />
                  <div className="c-body">
                    <main className="c-main" style={{ paddingTop: "3vh" }}>
                      <CContainer fluid>
                        <Suspense fallback={loading}>
                          <CFade>
                            <Page404 />
                          </CFade>
                        </Suspense>
                      </CContainer>
                    </main>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </Switch>
    </>
  );
}

export default TheLayout;
