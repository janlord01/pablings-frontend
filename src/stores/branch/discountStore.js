import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useDiscountData = defineStore("discountStore", {
  this: () => ({
    rowDatas: [],
  }),
  getters: {},
  actions: {
    async getAllDiscounts(payload) {
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("api/discount/" + payload, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          //   this.rowDatas = response.data.data;
          this.rowDatas = [];
          // console.log(payload);
          if (response) {
            Object.entries(response.data.data).map(([key, val]) => {
              this.rowDatas.push({
                id: val.id,
                description: val.description,
                number: val.number,
                type: val.type,
              });
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
