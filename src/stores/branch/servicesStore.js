import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useServicesData = defineStore("servicesStore", {
  state: () => ({
    rowDatas: [],
    tempRowDatas: [],

    rowServiceDatas: [],
    tempRowServiceDatas: [],
  }),
  getters: {},
  actions: {
    async getAllServices(payload) {
      Loading.show();
      this.tempRowServiceDatas = [];
      this.rowServiceDatas = [];
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(
          "api/services",
          {
            params: {
              slug: payload,
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
          if (response.data.status === 200) {
            setTimeout(() => {
              this.tempRowServiceDatas = response.data.data;
              this.rowServiceDatas = this.tempRowServiceDatas;
              Loading.hide();
            }, 1000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //   console.log(this.rowDatas);
    },
    async getAllServicesBranch(payload) {
      this.tempRowDatas = [];
      this.rowDatas = [];
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("api/services/" + payload, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);
          Object.entries(response.data.data).map(([key, val]) => {
            this.tempRowDatas.push({
              id: val.serv_id,
              image: val.image,
              service_name: val.service_name,
              service_descr: val.service_descr,
              service_price: val.service_price,
              time_duration: val.time_duration,
              status: val.status == 1 ? true : false,
            });
          });

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
