import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useLoanData = defineStore("loanStore", {
  this: () => ({
    rowDatas: [],
    tempRowDatas: [],
    loading: true,
  }),
  getters: {},
  actions: {
    async getAllLoans(payload) {
      this.rowDatas = [];
      this.tempRowDatas = [];
      this.loading = true;
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(
          "api/loans",
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
            setTimeout(() => {
              Object.entries(response.data.data).map(([key, val]) => {
                this.tempRowDatas.push(val);
              });
              this.rowDatas = this.tempRowDatas;
              this.loading = false;
            }, 1000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
