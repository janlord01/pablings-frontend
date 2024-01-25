import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { route } from "quasar/wrappers";
import { useQuasar } from "quasar";
import { Notify, Loading, LocalStorage } from "quasar";
import { useRoute, useRouter } from "vue-router";

export const useUserData = defineStore("userStore", {
  state: () => ({
    userDetails: {
      permissions: [],
      roles: [],
      branch: 0,
      slug: "",
    },
    rowDatas: [],
    tempRowDatas: [],

    rowStaffDatas: [],
    temprowStaffDatas: [],
    // router: useRouter(),
  }),
  getters: {},
  actions: {
    onSearch(payload) {
      // console.log(payload);
      if (payload == null || payload == "" || payload.length == 0) {
        this.getAllMembers();
      } else {
        this.tempRowDatas = this.rowDatas;
        this.rowDatas = [];
        this.rowDatas = this.tempRowDatas.filter((subject) => {
          return Object.values(subject).some((word) =>
            String(word).toLowerCase().includes(payload)
          );
        });
      }
    },

    onSearchStaff(payload) {
      // console.log(payload);
      if (payload == null || payload == "" || payload.length == 0) {
        this.getAllStaff();
      } else {
        this.temprowStaffDatas = this.rowStaffDatas;
        this.rowStaffDatas = [];
        this.rowStaffDatas = this.temprowStaffDatas.filter((subject) => {
          return Object.values(subject).some((word) =>
            String(word).toLowerCase().includes(payload)
          );
        });
      }
    },
    async registerUser(payload) {
      // const router = useRouter();
      const $q = useQuasar();
      // console.log(payload);
      await api
        .post("/api/register", {
          firstname: payload.firstname,
          lastname: payload.lastname,
          email: payload.email,
          password: payload.password,
          password_confirmation: payload.password_confirmation,
        })
        .then((res) => {
          // console.log(res);

          Loading.show();
          if (res.data.status == 200) {
            // hiding in 2s
            setTimeout(() => {
              Loading.hide();
              Notify.create({
                type: "positive",
                color: "positive",
                timeout: 1000,
                position: "bottom",
                message: res.data.message,
              });

              this.router.push({ name: "login" });
            }, 2000);
          } else {
            setTimeout(() => {
              Loading.hide();

              Notify.create({
                type: "negative",
                color: "negative",
                timeout: 1000,
                position: "bottom",
                message: res.data.message,
              });
            }, 2000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async loginUser(payload) {
      localStorage.removeItem("jwt");
      // const router = useRouter();

      Loading.show();
      await api
        .post("api/sanctum/token", {
          email: payload.email,
          password: payload.password,
        })
        .then((response) => {
          // console.log(response);
          if (response.data.status === 200) {
            LocalStorage.set("jwt", response.data.token);
            setTimeout(() => {
              Loading.hide();
              Notify.create({
                type: "positive",
                color: "positive",
                timeout: 2000,
                position: "bottom",
                message: response.data.message,
              });
              if (LocalStorage.getItem("jwt")) {
                // this.router.push({ name: "dashboard-index" });
                window.location = response.data.slug + "/dashboard";
              }
              // this.getUserDetails();
            }, 3000);
          } else {
            setTimeout(() => {
              Loading.hide();

              Notify.create({
                type: "negative",
                color: "negative",
                timeout: 1000,
                position: "bottom",
                message: response.data.message,
              });
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getUserDetails() {
      var newToken = LocalStorage.getItem("jwt");
      try {
        if (newToken !== null) {
          await api
            .get("/api/user/details", {
              headers: {
                Authorization: "Bearer " + newToken,
              },
            })
            .then((response) => {
              // console.log(response);

              if (response.data.user) {
                this.userDetails = {
                  user: response.data.user,
                  permissions: response.data.permissions,
                  roles: response.data.roles,
                  branch:
                    response.data.branch != null
                      ? response.data.branch.branch_id
                      : 0,
                  slug: response.data.slug,
                };
              }

              // console.log(this.userDetails.branch);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async logoutUser() {
      const router = useRouter();

      const newToken = LocalStorage.getItem("jwt")
        ? LocalStorage.getItem("jwt")
        : null;
      await api
        .post("/api/logout", {
          headers: {
            Authorization: "Bearer " + newToken,
            Accept: "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
          },
        })
        .then((response) => {
          // console.log(response);
          // this.userDetails = {};
          localStorage.removeItem("jwt");
          // router.push({ name: "login" });
          window.location = "/login";
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAllMembers() {
      this.rowDatas = [];
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("/api/members", {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          // console.log(response);

          if (response.data.data) {
            this.rowDatas = response.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getAllStaff(payload) {
      this.rowStaffDatas = [];
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(`/api/${payload[0]}/${payload[1]}/staff`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          this.rowStaffDatas = response.data.data;

          // if (response.data.data) {
          //   this.rowStaffDatas = response.data.data;
          // }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    checkRole(payload) {
      // console.log(this.userDetails.roles);
      if (payload == null) {
        payload = ["none"];
      }
      if (payload != "logout") {
        var a = 0;
        const roles = payload.some((permis) => {
          this.userDetails.roles.map((f) => {
            if (permis == f) {
              a++;
              return true;
            }
          });
        });
        if (a > 0) {
          return true;
        } else {
          return false;
        }
      }
    },
    checkPermission(payload) {
      var a = 0;
      const permission = payload.some((permis) => {
        this.userDetails.permissions.map((f) => {
          // console.log("permis = " + permis + "/ f = " + f);

          // console.log(permission);
          // return permission;
          if (permis == f) {
            a++;
            return true;
          }
          // console.log("match");
        });
        // console.log(permis);

        // return permis == "view-profile";
      });
      if (a > 0) {
        return true;
      } else {
        return false;
      }
      // console.log(permission);

      return permission;
    },
  },
});
