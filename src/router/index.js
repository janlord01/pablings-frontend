import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
  useRoute,
  useRouter,
} from "vue-router";
import { api } from "src/boot/axios";
import routes from "./routes";
import { Notify, Loading, LocalStorage, Dialog, colors } from "quasar";

import { useUserData } from "stores/users/store";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const userStore = useUserData();
  // const routerrrrr = useRouter();
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    api,
    // studentRoutes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createWebHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const requiredAuth = to.matched.some((record) => record.meta.requiredAuth);
    const access = to.meta.access;
    // const rroute = useRoute();
    var newToken = LocalStorage.getItem("jwt");

    const slugBookingPattern = /^\/[^\/]+\/booking$/;

    if (LocalStorage.getItem("jwt")) {
      if (requiredAuth) {
        let new_update = "v0000000005";
        if (LocalStorage.getItem("new_update")) {
          if (LocalStorage.getItem("new_update") === new_update) {
          } else {
            Dialog.create({
              title: "New Update",
              message: "Refresh for new updates!",
              position: "top",

              persistent: true,
              cancel: {
                color: "grey",
              },
              ok: {
                label: "Refresh",
                color: "primary",
              },
            })
              .onOk(() => {
                // console.log('OK')
                LocalStorage.set("new_update", new_update);
                window.location.reload();
              })
              .onCancel(() => {
                // console.log('Cancel')
              })
              .onDismiss(() => {
                // console.log('I am triggered on both OK and Cancel')
              });
          }
        } else {
          Dialog.create({
            title: "New Update",
            message: "Refresh for new updates!",
            position: "top",

            persistent: true,
            cancel: {
              color: "grey",
            },
            ok: {
              label: "Refresh",
              color: "primary",
            },
          })
            .onOk(() => {
              // console.log('OK')
              LocalStorage.set("new_update", new_update);
              window.location.reload();
            })
            .onCancel(() => {
              // console.log('Cancel')
            })
            .onDismiss(() => {
              // console.log('I am triggered on both OK and Cancel')
            });
        }
        // next();
        api
          .get("api/check-token", {
            headers: {
              Authorization: "Bearer " + newToken,
            },
          })
          .then((response) => {
            // console.log(response);

            if (response.data.status === 200) {
              LocalStorage.set("slug", response.data.slug);
              // var a = 0;
              // access.forEach((e) => {

              //   response.data.roles.forEach((f) => {
              //     console.log("e: " + e);
              //     console.log("f: " + f);
              //     if (e == f) {
              //       // userStore.getUserDetails();
              //       console.log("true");
              //       a++;
              //       next();
              //     }
              //   });
              // });
              const checkRole = access.some(
                (permis) => response.data.roles.indexOf(permis) !== -1
              );
              if (checkRole == true && to.path == "/") {
                return next({
                  name: "dashboard-main",
                  replace: true,
                });
              }
              if (checkRole == false && to.path == "/") {
                Notify.create({
                  type: "warning",
                  color: "warning",
                  timeout: 3000,
                  position: "top",
                  message: "Please wait. Redirecting...",
                });
                // let bslug = LocalStorage.getItem("slug");

                // if (bslug === null) {
                //   setTimeout(() => {
                //     Notify.create({
                //       type: "warning",
                //       color: "warning",
                //       timeout: 3000,
                //       position: "top",
                //       message: "Account Logout, Please login again",
                //     });
                //     window.location = window.location.origin;
                //   }, 3000);
                // } else {
                setTimeout(() => {
                  window.location =
                    window.location.origin +
                    "/" +
                    LocalStorage.getItem("slug") +
                    "/dashboard";
                }, 2000);
                // }
              } else if (checkRole == false && requiredAuth == true) {
                Notify.create({
                  type: "negative",
                  color: "negative",
                  timeout: 3000,
                  position: "top",
                  message: "Access Denied! Please wait...Redirect to dashboard",
                });
                // LocalStorage.removeItem("branchName");
                // LocalStorage.removeItem("bb");
                // LocalStorage.removeItem("jwt");
                // return next("dashboard-index-slug");
                // console.log(window.location.origin);

                setTimeout(() => {
                  window.location =
                    window.location.origin +
                    "/" +
                    LocalStorage.getItem("slug") +
                    "/dashboard";
                }, 2000);
              } else {
                next();
              }
            } else {
              localStorage.removeItem("jwt");
              return next("login");
            }
          })
          .catch((error) => {
            console.log(error);
            // Loading.show();
            Notify.create({
              type: "warning",
              position: "top",
              timeout: 3000,
              message: "Session Expired! Please re-login again... ",
            });
            localStorage.removeItem("jwt");
            setTimeout(() => {
              window.location.reload();
              // Loading.hide();
            }, 3000);
            // return next("/login");
            console.log(error);
          });
      } else if (to.path == "/login" || to.path == "/register") {
        return next("/dashboard");
      } else if (slugBookingPattern.test(to.path)) {
        return next();
      } else {
        // console.log("test");

        return next({
          name: "login",
          // params: { redirect: to.fullPath },
          replace: true,
        });
      }
    } else if (
      to.path == "/login" ||
      to.path == "/register" ||
      slugBookingPattern.test(to.path)
    ) {
      next();
    } else if (to.path == "/") {
      next("login");
    } else {
      next("login");
    }
  });

  return Router;
});
