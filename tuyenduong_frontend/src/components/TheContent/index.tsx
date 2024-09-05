import React, { Suspense } from "react";
import { Route } from "react-router-dom";
import { CContainer, CFade } from "@coreui/react";
import routes from "../../routes";
import TheSidebar from "../TheSidebar";
import TheHeader from "../TheHeader";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const TheContent = (props: any) => {
  return (
    <>
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
                        <main className="c-main" style={{ paddingTop: "3vh" }}>
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
    </>
  );
};

export default TheContent;
