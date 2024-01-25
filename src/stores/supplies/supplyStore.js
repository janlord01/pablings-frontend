import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useSupplyData = defineStore("supplyStore", {
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
  }),
  getters: {},
  actions: {
    async getAllPayments(payload) {
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("/api/payment/" + payload, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          if (response.data.data) {
            this.paymentRowDatas = response.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAllPlans() {
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("/api/plans", {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          if (response.data.data) {
            this.rowDatasPlan = response.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAllProducts() {
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("api/products", {
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
      //   console.log(this.rowDatas);
    },
    removeProduct(payload) {
      // console.log(state.tempDataBilling);
      const objWithIdIndex = this.tempCashierProductDatas.findIndex(
        (obj) => obj.id === payload
      );
      // console.log(objWithIdIndex);
      // const objWithIdFilter = this.tempDataSubject.filter(
      //   (obj) => obj.id === payload
      // );
      const objWithIdFilter = this.tempCashierProductDatas.filter(
        (obj) => obj.id === payload
      );

      // console.log(this.total);
      if (objWithIdIndex > -1) {
        this.tempCashierProductDatas.splice(objWithIdIndex, 1);
        Notify.create({
          type: "positive",
          message: "Item Removed!",
          position: "top",
        });
      }
      return this.tempCashierProductDatas;
    },
    removePlan(payload) {
      // console.log(state.tempDataBilling);
      const objWithIdIndex = this.tempCashierPlanDatas.findIndex(
        (obj) => obj.id === payload
      );
      // console.log(objWithIdIndex);
      // const objWithIdFilter = this.tempDataSubject.filter(
      //   (obj) => obj.id === payload
      // );
      const objWithIdFilter = this.tempCashierPlanDatas.filter(
        (obj) => obj.id === payload
      );

      // console.log(this.total);
      if (objWithIdIndex > -1) {
        this.tempCashierPlanDatas.splice(objWithIdIndex, 1);
        Notify.create({
          type: "positive",
          message: "Item Removed!",
          position: "top",
        });
      }
      return this.tempCashierPlanDatas;
    },
    updateQty(payload) {
      const objWithIdIndex = this.tempCashierProductDatas.findIndex(
        (obj) => obj.id === payload[0]
      );
      const objWithIdFilter = this.tempCashierProductDatas.filter(
        (obj) => obj.id === payload[0]
      );
      objWithIdFilter.forEach((element) => {
        // console.log(element.qty);
        element.qty = payload[1];
      });

      return this.tempCashierProductDatas;
    },

    updateStart(payload) {
      const objWithIdIndex = this.tempCashierPlanDatas.findIndex(
        (obj) => obj.id === payload[0]
      );
      const objWithIdFilter = this.tempCashierPlanDatas.filter(
        (obj) => obj.id === payload[0]
      );
      objWithIdFilter.forEach((element) => {
        // console.log(element.qty);
        element.start = payload[1];
      });

      return this.tempCashierProductDatas;
    },
    updateEnd(payload) {
      const objWithIdIndex = this.tempCashierPlanDatas.findIndex(
        (obj) => obj.id === payload[0]
      );
      const objWithIdFilter = this.tempCashierPlanDatas.filter(
        (obj) => obj.id === payload[0]
      );
      objWithIdFilter.forEach((element) => {
        // console.log(element.qty);
        element.end = payload[1];
      });

      return this.tempCashierProductDatas;
    },

    addProductCashier(payload) {
      //   this.tempCashierProductDatas = [payload];
      Object.entries(payload.data.data).map(([key, val]) => {
        this.tempCashierProductDatas.push({
          id: val.id,
          title: val.title,
          description: val.description,
          price: val.price,
          qty: 1,
          sale: val.sale,
          sale_price: val.sale_price,
          product_img: val.product_img,
        });
      });
      //   console.log(this.tempCashierProductDatas);
    },

    addPlanCashier(payload) {
      this.tempCashierPlanDatas = [];
      //   this.tempCashierPlanDatas = payload;
      Object.entries(payload).map(([key, val]) => {
        this.tempCashierPlanDatas.push({
          id: val.id,
          name: val.name,
          description: val.description,
          price: val.price,
          days: val.days,
          start: "",
          end: "",
        });
      });
      //   console.log(this.tempCashierProductDatas);
    },

    onSearch(payload) {
      if (payload == "" || payload == null) {
        this.getAllProducts();
      } else {
        const query = payload != null ? payload.toLowerCase() : "";

        this.tempRowDatas = this.rowDatas;
        this.rowDatas = [];
        this.rowDatas = this.tempRowDatas.filter((product) => {
          return Object.values(product).some((word) =>
            String(word).toLowerCase().includes(query)
          );
        });
      }
    },
    onSearchDelete() {
      this.getAllProducts();
    },
    onSearchPlan(payload) {
      if (payload[0] == "" || payload[0] == null) {
        this.getAllPlans(payload);
      } else {
        const query = payload[0] != null ? payload[0].toLowerCase() : "";

        this.tempRowDatasPlan = this.rowDatasPlan;
        this.rowDatasPlan = [];
        this.rowDatasPlan = this.tempRowDatasPlan.filter((product) => {
          return Object.values(product).some((word) =>
            String(word).toLowerCase().includes(query)
          );
        });
      }
    },
    resetItem() {
      this.rowDatas = [];
      this.rowDatasPlan = [];

      this.rowDatasPlan = [];
      this.tempRowDatasPlan = [];

      this.tempCashierProductDatas = [];
      this.tempCashierPlanDatas = [];

      this.totalProduct = [];
      this.totalPlan = [];
    },
  },
});
