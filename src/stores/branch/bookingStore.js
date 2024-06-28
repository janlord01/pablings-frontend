import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useBookingData = defineStore("bookingStore", {
  this: () => ({
    rowDatas: [],
    tempRowDatas: [],
  }),
  getters: {},
  actions: {
    async getBranch(payload) {
      this.rowDatas = [];
      this.tempRowDatas = [];

      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(
          "api/booking/" + payload,
          {
            params: {
              branch: payload,
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
          if (response.data.status == 200) {
            Object.entries(response.data.data).map(([key, val]) => {
              this.tempRowDatas.push(val);
            });
            this.rowDatas = this.tempRowDatas;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
