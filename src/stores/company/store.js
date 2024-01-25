import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useCompanyData = defineStore("companyStore", {
  state: () => ({
    rowDatas: [],
    tempRowDatas: [],
    rowDatasOwner: [],
    rowDatasCompany: [],
  }),
  getters: {},
  actions: {
    async getAllOwners(payload) {
      this.rowDatasOwner = [];
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(`/api/company/${payload}/owners`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          // console.log(response);

          if (response.data.data) {
            this.rowDatasOwner = response.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getCompany(payload) {
      this.rowDatasOwner = [];
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(`/api/company/${payload}/info`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          // console.log(response);

          if (response.status == 200) {
            this.rowDatasCompany = response.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAllCompanies() {
      this.rowDatas = [];
      this.tempRowDatas = [];
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("api/company", {
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
    },
    onSearch(payload) {
      if (payload == null || payload == "" || payload.length == 0) {
        this.getAllCompanies();
      } else {
        const needle = payload.toLowerCase();
        this.rowDatas = this.tempRowDatas.filter((v) => {
          return Object.values(v).some(
            (word) => String(word).toLowerCase().indexOf(needle) > -1
          );
        });
      }
    },
  },
});
