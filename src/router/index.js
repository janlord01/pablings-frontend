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
import { Notify, Loading, LocalStorage } from "quasar";

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
    if (LocalStorage.getItem("jwt")) {
      if (requiredAuth) {
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
              var a = 0;
              access.forEach((e) => {
                response.data.roles.forEach((f) => {
                  if (e == f) {
                    // userStore.getUserDetails();
                    a++;
                    next();
                  }
                });
              });

              if (a == 0) {
                Notify.create({
                  type: "negative",
                  color: "negative",
                  timeout: 3000,
                  position: "top",
                  message:
                    "Access Denied! You don't have permission to access this section! Please Login Again",
                });
                localStorage.removeItem("jwt");

                return next({ name: "login" });
                // return next(""+rroute.para+"/dashboard");
                // return routerrrrr.go(-1);
              }
            } else {
              return next({
                name: "login",
                // params: { redirect: to.fullPath },
                replace: true,
              });
            }
          })
          .catch((error) => {
            localStorage.removeItem("jwt");
            console.log(error);
          });
      } else if (to.path == "/login" || to.path == "/register") {
        return next("/dashboard");
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
      to.path == "/:catchAll(.*)*"
    ) {
      next();
    } else if (to.path == "/") {
      next("login");
    } else {
      next();
    }
  });

  return Router;
});
