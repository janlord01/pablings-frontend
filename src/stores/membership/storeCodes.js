import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { route } from "quasar/wrappers";
import { useQuasar } from "quasar";
import { Notify, Loading, LocalStorage } from "quasar";

export const useCodeData = defineStore("codesStore", {
  state: () => ({
    rowDatas: [],
    tempRowDatas: [],
  }),
  getters: {},
  actions: {
    async getAllCodes() {
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("/api/codes", {
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
    onSearch(payload) {
      // console.log(payload);
      if (payload == null || payload == "" || payload.length == 0) {
        this.getAllCodes();
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
  },
});
