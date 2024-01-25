import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage, uid } from "quasar";

export const useCashierData = defineStore("cashierStore", {
  state: () => ({
    rowDatas: [],
    rowBranchProductDatas: [],
    tempRowDatas: [],
    paymentRowDatas: [],

    rowDatasPlan: [],
    tempRowDatasPlan: [],

    tempCashierProductDatas: [],
    tempCashierPlanDatas: [],

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

    addToCartItems: [],
    subTotal: 0,
    totalDiscount: 0,
    discountId: null,
    total: 0,
    cash: "",
    change: 0,
    remarks: "",

    totalProduct: [],
    totalPlan: [],
  }),
  getters: {},
  actions: {
    clearPos() {
      this.addToCartItems = [];
      this.subTotal = 0;
      this.totalDiscount = 0;
      this.discountId = null;
      this.total = 0;
      this.cash = "";
      this.change = 0;
      this.remarks = "";
    },
    async getAllBranchPaymentTransaction(payload) {
      const newToken = LocalStorage.getItem("jwt");
      await api
        .get(`/api/branch/cashier/${payload}`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          if (response.status == 200) {
            this.paymentRowDatas = response.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cashCalcute() {
      this.change = parseFloat(this.cash - this.total);
    },
    /**
     * Function for add to cart for owner plans
     * @param {
     * id
     * } payload
     */
    AddToCartToCheckout(payload) {
      // console.log(payload);
      // let uid = uid();
      if (payload[1] === "products") {
        this.rowDatas.push({
          uid: uid(),
          name: payload[0].title,
          product_id: payload[0].product_id,
          description: payload[0].description,
          srp: parseFloat(payload[0].srp),
          qty: 1,
          total: parseFloat(payload[0].srp),
          image: payload[0].product_img,
          type: payload[1],
          id: payload[0].id,
        });
        this.subTotal = this.subTotal + parseFloat(payload[0].srp);
        this.total = this.subTotal;

        Notify.create({
          position: "top",
          type: "postive",
          timeout: 1000,
          message: "Added to cart",
        });
      } else {
        // console.log("okay");
        this.rowDatas.push({
          uid: uid(),
          name: payload[0].service_name,
          description: payload[0].service_descr,
          srp: parseFloat(payload[0].service_price),
          qty: 1,
          total: parseFloat(payload[0].service_price),
          image: payload[0].image,
          type: payload[1],
          id: payload[0].id,
        });
        this.subTotal = this.subTotal + parseFloat(payload[0].service_price);
        this.total = this.subTotal;
        Notify.create({
          position: "top",
          type: "positive",
          timeout: 1000,
          message: "Added to cart",
        });
      }
      this.totalDiscount = 0;

      // console.log(this.rowDatas);

      // this.selectedPlan = Object.entries(this.rowDatasPlan).find(
      //   ([key, plan]) => plan.id === payload
      // );
      // console.log(this.selectedPlan);
      // this.addToCartPlan.subTotal = this.selectedPlan[1].price;
      // this.addToCartPlan.total = this.selectedPlan[1].price;
      // this.addToCartPlan.branches = 0;
      // this.addToCartPlan.users = 0;
      // this.addToCartPlan.discount = "";
      // this.addToCartPlan.cash = "";
      // this.addToCartPlan.change = "";
    },
    addQuantity(payload) {
      const cartItemCheck = this.rowDatas.findIndex(
        (item) => item.uid === payload
      );
      const cartQty = this.rowDatas[cartItemCheck].qty++;
      this.rowDatas[cartItemCheck].total =
        this.rowDatas[cartItemCheck].srp * this.rowDatas[cartItemCheck].qty;
      const cartTotal = this.rowDatas[cartItemCheck].total;
      this.subTotal = this.subTotal + this.rowDatas[cartItemCheck].srp;
      this.total = this.subTotal;
      this.totalDiscount = 0;
      // console.log(cartTotal);
    },
    minusQuantity(payload) {
      const cartItemCheck = this.rowDatas.findIndex(
        (item) => item.uid === payload
      );
      const cartQty = this.rowDatas[cartItemCheck].qty--;
      this.rowDatas[cartItemCheck].total =
        this.rowDatas[cartItemCheck].srp * this.rowDatas[cartItemCheck].qty;
      const cartTotal = this.rowDatas[cartItemCheck].total;

      this.subTotal = this.subTotal - this.rowDatas[cartItemCheck].srp;
      this.total = this.subTotal;

      const objWithIdIndex = this.rowDatas.findIndex(
        (obj) => obj.uid === payload
      );
      this.totalDiscount = 0;

      if (this.rowDatas[cartItemCheck].qty == 0 && objWithIdIndex > -1) {
        this.rowDatas.splice(objWithIdIndex, 1);
        Notify.create({
          type: "positive",
          message: "Item Removed!",
          position: "top",
        });
      }
      // console.log(cartTotal);
    },
    removeProduct(payload) {
      // console.log(state.tempDataBilling);

      const objWithIdIndex = this.rowDatas.findIndex(
        (item) => item.uid === payload
      );
      this.subTotal = this.subTotal - this.rowDatas[objWithIdIndex].total;
      this.total = this.subTotal;
      // console.log(objWithIdIndex);
      // const objWithIdFilter = this.tempDataSubject.filter(
      //   (obj) => obj.id === payload
      // );
      const objWithIdFilter = this.rowDatas.filter((obj) => obj.id === payload);
      this.totalDiscount = 0;

      // console.log(this.total);
      if (objWithIdIndex > -1) {
        this.rowDatas.splice(objWithIdIndex, 1);
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
      // this.totalDiscount = 0;
      //   console.log(this.tempCashierProductDatas);
    },

    applyDiscount(payload) {
      console.log(payload);
      this.discountId = payload.id;
      this.total = this.subTotal;
      this.totalDiscount = 0;
      this.totalDiscount =
        parseFloat(this.totalDiscount) +
        (payload.type == "Percentage"
          ? parseFloat((payload.number / 100) * this.total)
          : parseFloat(payload.number));
      this.total = this.total - this.totalDiscount;
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
  },
});
