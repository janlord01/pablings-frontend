import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useSupplierData = defineStore("supplierStore", {
  state: () => ({
    rowDatas: [],
    tempRowDatas: [],
    paymentRowDatas: [],

    rowDatasPlan: [],
    tempRowDatasPlan: [],

    tempCashierProductDatas: [],
    tempCashierPlanDatas: [],

    totalProduct: [],
    totalPlan: [],
    skeleton: true,
  }),
  getters: {},
  actions: {
    async getAllSupplier(payload) {
      this.skeleton = true;
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(`api/${payload}/supplier`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            // setTimeout(() => {
            this.tempRowDatas = response.data.data;
            this.rowDatas = this.tempRowDatas;
            this.skeleton = false;
            // }, 3000);
          }

          //   console.log(this.rowDatas);
        })
        .catch((error) => {
          console.log(error);
        });
      //   console.log(this.rowDatas);
    },

    onSearch(payload) {
      if (payload[0] == "" || payload[0] == null) {
        this.getAllSupplier(payload[1]);
      } else {
        const needle = payload[0].toLowerCase();
        this.rowDatas = this.tempRowDatas.filter((product) => {
          return Object.values(product).some(
            (word) => String(word).toLowerCase().indexOf(needle) > -1
          );
        });
      }
    },
    onSearchDelete() {
      this.getAllSupplier();
    },
  },
});
