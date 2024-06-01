import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useProductDatas = defineStore("productStore", {
  state: () => ({
    rowDatas: [],
    rowBranchProductDatas: [],
    rowTempBranchProductDatas: [],
    tempRowDatas: [],
    paymentRowDatas: [],

    rowDatasPlan: [],
    tempRowDatasPlan: [],

    tempCashierProductDatas: [],
    tempCashierPlanDatas: [],

    rowRequest: [],
    rowTempRequest: [],

    selectedPlan: [],
    addToCartPlan: {
      subTotal: 0,
      discount: "",
      total: 0,
      cash: "",
      change: 0,
      branches: 0,
      users: 0,
    },

    totalProduct: [],
    totalPlan: [],

    skeleton: true,
  }),
  getters: {},
  actions: {
    async getAllOwnersPayments(payload) {
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("/api/company/payments/all", {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.data) {
            this.paymentRowDatas = response.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
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
    /**
     * Function for add to cart for owner plans
     * @param {
     * id
     * } payload
     */
    AddToCartToCheckout(payload) {
      // console.log(this.rowDatasPlan);
      // rowDatasPlan;
      this.selectedPlan = Object.entries(this.rowDatasPlan).find(
        ([key, plan]) => plan.id === payload
      );
      // console.log(this.selectedPlan);

      this.addToCartPlan.subTotal = this.selectedPlan[1].price;
      this.addToCartPlan.total = this.selectedPlan[1].price;
      this.addToCartPlan.branches = 0;
      this.addToCartPlan.users = 0;
      this.addToCartPlan.discount = "";
      this.addToCartPlan.cash = "";
      this.addToCartPlan.change = "";
      // console.log(this.selectedPlan[1].subTotal);

      // const plan = Object.keys(this.rowDatasPlan).find(
      //   (plan) => plan === payload
      // );

      // console.log(this.selectedPlan[1]);
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
      this.skeleton = true;
      this.tempRowDatas = [];
      this.rowDatas = [];
      Loading.show();
      // this.rowTempRequest = [];
      // this.rowRequest = [];
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(`api/${payload}/products`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            setTimeout(() => {
              this.skeleton = false;
              this.tempRowDatas = response.data.data;
              this.rowDatas = this.tempRowDatas;
              // this.rowTempRequest = response.data.requestProduct;
              // this.rowRequest = this.rowTempRequest;
              Loading.hide();
            }, 1000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //   console.log(this.rowDatas);
    },

    async getAllBranchProducts(payload) {
      Loading.show();
      this.rowBranchProductDatas = [];
      this.rowTempBranchProductDatas = [];
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("api/products/branch/" + payload, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          if (response.data.status === 200) {
            setTimeout(() => {
              this.rowTempBranchProductDatas = response.data.data;
              this.rowBranchProductDatas = this.rowTempBranchProductDatas;

              Loading.hide();
            }, 1000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //   console.log(this.rowDatas);
    },
    async getAllRequestBranch(payload) {
      Loading.show();
      this.rowRequest = [];
      this.rowTempRequest = [];

      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("api/products/branch/request/" + payload, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          if (response.data.status === 200) {
            setTimeout(() => {
              this.rowTempRequest = response.data.data;
              this.rowRequest = this.rowTempRequest;
              Loading.hide();
            }, 1000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
    onSearchBranchProduct(payload) {
      if (payload[0] == "" || payload[0] == null) {
        this.getAllBranchProducts(payload[1]);
      } else {
        const query = payload[0].toLowerCase();

        // this.rowTempBranchProductDatas = this.rowBranchProductDatas;
        // this.rowBranchProductDatas = [];
        this.rowBranchProductDatas = this.rowTempBranchProductDatas.filter(
          (product) => {
            return Object.values(product).some(
              (word) => String(word).toLowerCase().indexOf(query) > -1
            );
          }
        );
      }
    },
    onSearch(payload) {
      if (payload[0] == "" || payload[0] == null) {
        // this.getAllProducts(payload[1]);
        this.rowDatas = this.tempRowDatas;
        // this.getAllBranchProducts(payload[1]);
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
    onSearchRequest(payload) {
      // console.log(payload);
      if (payload == "" || payload == null) {
        // this.getAllProducts(payload[1]);
        this.rowRequest = this.rowTempRequest;
        // this.getAllBranchProducts(payload[1]);
      } else {
        const query = payload != null ? payload.toLowerCase() : "";

        this.rowRequest = this.rowTempRequest.filter((product) => {
          return Object.values(product).some(
            (word) => String(word).toLowerCase().indexOf(query) > -1
          );
        });
      }
    },
    onSearchPlan(payload) {
      // console.log(payload);
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
