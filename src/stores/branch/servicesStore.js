import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useServicesData = defineStore("servicesStore", {
  state: () => ({
    rowDatas: [],
    tempRowDatas: [],
  }),
  getters: {},
  actions: {
    async getAllServices(payload) {
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("api/services/" + payload, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          this.tempRowDatas = response.data.data;
          this.rowDatas = this.tempRowDatas;
        })
        .catch((error) => {
          console.log(error);
        });
      //   console.log(this.rowDatas);
    },
    onSearch(payload) {
      if (payload[0] == "" || payload[0] == null) {
        this.getAllServices(payload[1]);
      } else {
        const query = payload[0] != null ? payload[0].toLowerCase() : "";

        // this.tempRowDatas = this.rowDatas;
        // this.rowDatas = [];
        this.rowDatas = this.tempRowDatas.filter((product) => {
          return Object.values(product).some(
            (word) => String(word).toLowerCase().indexOf(query) > -1
          );
        });
      }
    },
  },
});
