import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { route } from "quasar/wrappers";
import { useQuasar } from "quasar";
import { Cookies } from "quasar";
import { Notify, Loading, LocalStorage, Dialog } from "quasar";
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
    branch: 0,
    branchName: "",
    rowStaffDatas: [],
    temprowStaffDatas: [],

    rowStaffBranchDatas: [],
    tempRowStaffBranchDatas: [],

    orderCount: 0,
    loading: false,
    // branches: [],
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
          // console.log(response.data.role[0]);
          const branches = [];
          if (response.data.status === 200) {
            setTimeout(() => {
              Loading.hide();

              if (
                response.data.role[0] === "cashier" ||
                response.data.role[0] === "manager"
              ) {
                if (response.data.branches !== null) {
                  Object.entries(response.data.branches).map(([key, val]) => {
                    branches.push({
                      label: val.name,
                      value: val.id,
                      color: "blue",
                    });
                  });

                  Dialog.create({
                    title: "Select Branch to Login",
                    // message: "Choose an option:",
                    options: {
                      type: "radio",
                      model: "opt1",
                      // inline: true
                      items: branches,
                      // { label: "Option 1", value: "opt1", color: "secondary" },
                      // { label: "Option 2", value: "opt2" },
                      // { label: "Option 3", value: "opt3" },
                    },
                    ok: {
                      label: "select",
                      color: "blue",
                    },
                    cancel: {
                      color: "grey",
                    },
                    persistent: true,
                  })
                    .onOk((data) => {
                      console.log(">>>> OK, received", data);
                      const selectedBranch = data;
                      LocalStorage.set("jwt", response.data.token);
                      LocalStorage.set("bb", data);
                      Cookies.set("jwt", response.data.token);
                      // LocalStorage.set("branch_name", data);

                      if (LocalStorage.getItem("jwt")) {
                        window.location = response.data.slug + "/dashboard";
                        this.branch = LocalStorage.getItem("bb");
                        // this.branchName = LocalStorage.getItem("branch_name");
                        Notify.create({
                          type: "positive",
                          color: "positive",
                          timeout: 2000,
                          position: "bottom",
                          message: response.data.message,
                        });
                      }
                    })
                    .onCancel(() => {
                      // console.log('>>>> Cancel')
                      // window.location = "/login";
                    })
                    .onDismiss(() => {
                      // console.log('I am triggered on both OK and Cancel')
                    });
                } else {
                  Notify.create({
                    type: "negative",
                    position: "top",
                    timeout: 3000,
                    message:
                      "Please contact the owner to assign you to certain branch!",
                  });
                }
              } else if (response.data.role[0] === "owner") {
                LocalStorage.set("jwt", response.data.token);

                if (LocalStorage.getItem("jwt")) {
                  window.location = response.data.slug + "/dashboard";
                  Notify.create({
                    type: "positive",
                    color: "positive",
                    timeout: 2000,
                    position: "bottom",
                    message: response.data.message,
                  });
                }
              } else if (response.data.role[0] === "super-admin") {
                LocalStorage.set("jwt", response.data.token);

                if (LocalStorage.getItem("jwt")) {
                  window.location = "/dashboard";
                  Notify.create({
                    type: "positive",
                    color: "positive",
                    timeout: 2000,
                    position: "bottom",
                    message: response.data.message,
                  });
                }
              } else if (response.data.role[0] === "barber") {
                Notify.create({
                  type: "negative",
                  color: "negative",
                  timeout: 3000,
                  position: "bottom",
                  message: "Barber Account is not yet ready!",
                });
              } else {
                // LocalStorage.set("jwt", response.data.token);
                Notify.create({
                  type: "negative",
                  color: "negative",
                  timeout: 3000,
                  position: "bottom",
                  message: "Client account is not yet ready!",
                });
              }
            }, 1000);
          } else {
            setTimeout(() => {
              Loading.hide();

              Notify.create({
                type: "negative",
                color: "negative",
                timeout: 3000,
                position: "bottom",
                message: response.data.message,
              });
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => {
            Loading.hide();

            Notify.create({
              type: "negative",
              color: "negative",
              timeout: 3000,
              position: "bottom",
              message: "Error! Invalid Credentials ",
            });
          }, 3000);
        });
    },
    async getUserDetails() {
      var newToken = LocalStorage.getItem("jwt");
      try {
        if (newToken !== null) {
          await api
            .get(
              "/api/user/details",
              {
                params: {
                  branch: LocalStorage.getItem("bb"),
                },
              },
              {
                headers: {
                  Authorization: "Bearer " + newToken,
                },
              }
            )
            .then((response) => {
              console.log(response);

              if (response.data.user) {
                // setTimeout(() => {
                this.userDetails = {
                  user: response.data.user,
                  permissions: response.data.permissions,
                  roles: response.data.roles,
                  // branch:
                  //   response.data.branch != null
                  //     ? response.data.branch.branch_id
                  //     : 0,
                  slug: response.data.slug,
                };
                // }, 1000);

                this.branch = LocalStorage.getItem("bb");
                LocalStorage.set(
                  "branchName",
                  response.data.branch ? response.data.branch.name : ""
                );

                this.orderCount = response.data.orderCount;
                // if (
                //   LocalStorage.getItem("bb") === null &&
                //   (this.userDetails.roles !== "owner" ||
                //     this.userDetails.roles !== "super-admin")
                // ) {
                //   setTimeout(() => {
                //     Notify.create({
                //       type: "warning",
                //       color: "warning",
                //       timeout: 3000,
                //       position: "top",
                //       message: "Session Expired. Please login again!",
                //     });
                //     LocalStorage.remove("jwt");
                //   }, 3000);
                // }
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
          localStorage.removeItem("bb");
          localStorage.removeItem("branchName");
          window.location.reload();

          // router.push({ name: "login" });
          window.location = "/login";
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAllMembers(payload) {
      this.rowDatas = [];
      this.loading = true;
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(
          "/api/members",
          {
            params: {
              slug: payload,
              // branch: payload[1],
            },
          },
          {
            headers: {
              Authorization: "Bearer " + newToken,
            },
          }
        )
        .then((response) => {
          // console.log(response);

          if (response.data.status == 200) {
            setTimeout(() => {
              // this.rowDatas = response.data.data;
              Object.entries(response.data.data).map(([key, val]) => {
                this.rowDatas.push({
                  name: val.name,
                  email: val.email,
                  cp_number: val.cp_number,
                  id: val.id,
                  value: val.id,
                  label: val.name,
                  image_path: val.image_path,
                });
              });
              this.loading = false;
            }, 1000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addNewMember(payload) {
      // this.loading = true;
      setTimeout(() => {
        Object.entries(payload).map(([key, val]) => {
          this.rowDatas.push({
            name: val.name,
            email: val.email,
            cp_number: val.cp_number,
            id: val.id,
            value: val.id,
            label: val.name,
            image_path: val.image_path,
          });
        });
        // this.loading = false;
      }, 100);
    },

    async getbranchStaff(payload) {
      this.tempRowStaffBranchDatas = [];
      this.rowStaffBranchDatas = [];
      var newToken = LocalStorage.getItem("jwt");

      await api
        .get(`/api/${[payload[0]]}/staff/${payload[1]}`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.status == 200) {
            this.tempRowStaffBranchDatas = response.data.data;
            this.rowStaffBranchDatas = this.tempRowStaffBranchDatas;
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
        .get(`/api/${payload[0]}/staff`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.status == 200) {
            this.temprowStaffDatas = response.data.data;
            this.rowStaffDatas = this.temprowStaffDatas;
          }

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
