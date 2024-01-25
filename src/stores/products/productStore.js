import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useProductData = defineStore("productStore", {
  state: () => ({
    rowDatas: [],
    tempRowDatas: [],
    paymentRowDatas: [],

    rowDatasPlan: [],
    tempRowDatasPlan: [],
    selectedPlan: [],

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
            this.tempRowDatasPlan = response.data.data;
            this.rowDatasPlan = this.tempRowDatasPlan;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAllProducts(payload) {
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(`api/${payload}/products`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          this.tempRowDatas = response.data.data;
          this.rowDatas = this.tempRowDatas;
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
      if (payload[0] == "" || payload[0] == null) {
        this.getAllProducts(payload[1]);
      } else {
        const needle = payload[0].toLowerCase();
        this.rowDatas = this.tempRowDatas.filter((v) => {
          return Object.values(v).some(
            (word) => String(word).toLowerCase().indexOf(needle) > -1
          );
        });
      }
    },
    onSearchDelete() {
      this.getAllProducts();
    },
    onSearchPlan(payload) {
      // console.log("test");
      if (payload == "" || payload == null) {
        this.getAllPlans();
      } else {
        const needle = payload.toLowerCase();
        this.rowDatasPlan = this.tempRowDatasPlan.filter((v) => {
          return Object.values(v).some(
            (word) => String(word).toLowerCase().indexOf(needle) > -1
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
