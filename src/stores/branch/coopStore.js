import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useCoopData = defineStore("coopStore", {
  this: () => ({
    rowDatas: [],
    tempRowDatas: [],
  }),
  getters: {},
  actions: {
    async getAllAssign(payload) {
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("/api/branch/" + payload + "/members", {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          this.rowDatas = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
