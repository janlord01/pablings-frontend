import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useBranchData = defineStore("branchStore", {
  state: () => ({
    rowDatas: [],
    skeleton: true,
  }),
  getters: {},
  actions: {
    async getAllBranches(payload) {
      this.skeleton = true;
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(`api/${payload}/branch`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          if (response.status === 200) {
            // setTimeout(() => {
            this.rowDatas = response.data.data;

            this.skeleton = false;
            // }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAllBranches(payload) {
      this.skeleton = true;
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(`api/${payload}/branch`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          if (response.status === 200) {
            // setTimeout(() => {
            this.rowDatas = response.data.data;

            this.skeleton = false;
            // }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // async checkBranches()
  },
});
