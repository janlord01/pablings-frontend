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
      cash: 0,
      change: 0,
      branches: 0,
      users: 0,
    },

    addToCartItems: [],
    subTotal: 0,
    totalDiscount: 0,
    discountId: "",
    total: 0,
    cash: "",
    change: 0,
    remarks: "",
    mop: [],
    balanceDue: 0,
    reference: "",
    proof: "",

    totalProduct: [],
    totalPlan: [],

    transactionId: "",
    currentBranch: "",
    client: "Guest",
    selectedClient: null,
    selectedUid: "",
    commissions: [],
    commissionLoading: true,
    commissionWorker: [],
    selectedCommission: [],
  }),
  getters: {},
  actions: {
    removeWorkerCommission(payload) {
      // console.log(state.tempDataBilling);
      // console.log(payload);
      const objWithIdIndex = this.commissions.findIndex(
        (item) => item.id === payload[0]
      );

      const workerIndex = this.commissions[
        objWithIdIndex
      ].commission_worker.findIndex((item) => item.worker === payload[1]);

      const updateRemainingBalance =
        parseFloat(this.commissions[objWithIdIndex].remaining_amount) +
        parseFloat(
          this.commissions[objWithIdIndex].commission_worker[workerIndex]
            .commission
        );

      this.commissions[objWithIdIndex].remaining_amount =
        updateRemainingBalance;

      const objWithIdFilter = this.commissions.filter(
        (item) => item.id === payload[0]
      );

      // console.log(this.total);
      if (workerIndex > -1) {
        this.commissions[objWithIdIndex].commission_worker.splice(
          workerIndex,
          1
        );
        Notify.create({
          type: "positive",
          message: "Removed!",
          position: "top",
        });
      }
    },
    addCommissionToWorker(payload) {
      const objWithIdIndex = this.commissions.findIndex(
        (item) => item.id === payload[0]
      );
      Object.entries(payload[1]).map(([key, val]) => {
        this.commissions[objWithIdIndex].commission_worker.push(val);
      });

      // var reback =
      //   this.mop[objWithIdIndex].amount - this.mop[objWithIdIndex].change;
      // this.balanceDue += reback;
    },
    async getItemCommission(payload) {
      this.commissions = [];
      await api
        .get("/api/payment/item/" + payload[0], {
          params: {
            branch: payload[1],
          },
          headers: {
            Authorization: "Bearer " + LocalStorage.getItem("jwt"),
          },
        })
        .then((response) => {
          console.log(response);
          let uid = 0;
          let commissionData = [];
          this.commissionLoading = true;
          setTimeout(() => {
            Object.entries(response.data.commissions).map(([key, value]) => {
              commissionData.push({
                worker: value.user_id,
                id: value.item_added_id,
                worker_name: value.name,
                type: value.type,
                number_label:
                  value.type == "Percentage"
                    ? value.number + "%"
                    : "P" + value.amount,
                number: value.number,
                commission: value.amount,
                extraId: value.id,
                status: value.status,
              });
            });

            Object.entries(response.data.data).map(([key, val]) => {
              // console.log(item.name);
              this.commissions.push({
                dataID: uid,
                id: val.id,
                name:
                  val.title === null || val.title === ""
                    ? val.service_name
                    : val.title,
                type: "Percentage",
                worker: "",
                number: "",
                amount: "",
                remaining_amount: val.sub_total_item * val.qty,
                sub_total_item: val.sub_total_item * val.qty,
                commission_worker: [],
              });

              // });
              uid++;
              this.commissionWorker = response.data.users;
            });
            // console.log(commissionData[0].id);
            Object.entries(commissionData).map(([key, comVal]) => {
              const objWithIdIndex = this.commissions.findIndex(
                (item) => item.id === commissionData[key].id
              );
              this.commissions[objWithIdIndex].commission_worker.push(comVal);

              this.commissions[objWithIdIndex].remaining_amount =
                this.commissions[objWithIdIndex].remaining_amount -
                comVal.commission;
            });

            // console.log(this.commissions);

            this.commissionLoading = false;
          }, 1000);

          // console.log(items);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    clearPos() {
      this.addToCartItems = [];
      this.rowDatas = [];
      this.tempRowDatas = [];
      this.subTotal = 0;
      this.totalDiscount = 0;
      this.discountId = null;
      this.total = 0;
      this.cash = "";
      this.change = 0;
      this.remarks = "";
      this.client = "Guest";
      this.selectedClient = null;
    },

    selectMop(payload) {
      if (this.balanceDue == 0) {
        Notify.create({
          type: "negative",
          position: "top",
          timeout: 3000,
          message: "Balance Due is already 0",
        });
      } else {
        var a = 0;
        var paid = 0;
        var change = 0;
        Object.entries(this.mop).map(([key, val]) => {
          paid = parseFloat(paid) + parseFloat(val.amount);
        });

        Object.keys(payload).forEach((val) => {
          // console.log(val + " " + payload[val]);
          a++;
          if (a === 1) {
            change = this.total - paid;
            this.mop.push({
              uid: uid(),
              type: payload["type"],
              amount: payload["amount"],
              ref: payload["ref"],
              // proof: payload["proof"],
              change:
                parseFloat(payload["amount"]) >= change
                  ? parseFloat(payload["amount"]) - change
                  : 0,
            });
            this.balanceDue =
              payload["amount"] <= change ? change - payload["amount"] : 0;
          }
        });
      }

      // Object.entries(payload).map(([key, val]) => {
      //   this.mop.push({
      //     type: val.type,
      //     amount: val.amount,
      //     ref: val.ref,
      //     proof: val.proof,
      //     change: parseFloat(val.amount) - parseFloat(this.total),
      //   });
      // });
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
    async getAllBranchPaymentTransactionByDate(payload) {
      const newToken = LocalStorage.getItem("jwt");
      if (
        payload[1] === "" ||
        payload[1] === null ||
        payload[2] === "" ||
        payload[2] === null
      ) {
        Notify.create({
          type: "negative",
          timeout: 3000,
          position: "top",
          message:
            "Starting date or End date cannot be empty, Please select the date!",
        });
      } else {
        await api
          .get(
            `/api/branch/cashier/search/${payload[0]}`,
            {
              params: {
                startDate: payload[1],
                endDate: payload[2],
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
            if (response.status == 200) {
              this.paymentRowDatas = response.data.data;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    cashCalcute() {
      this.change = parseFloat(this.cash - this.total);
    },
    chooseMop(payload) {
      this.mop = payload;
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
          srp: parseFloat(payload[0].price),
          qty: 1,
          total: parseFloat(payload[0].price),
          image: payload[0].product_img,
          type: payload[1],
          id: payload[0].id,
          discountId: "",
          discount: 0,
        });
        this.subTotal = this.subTotal + parseFloat(payload[0].price);
        this.total = this.subTotal;

        Notify.create({
          position: "bottom",
          type: "positive",
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
          discountId: "",
          discount: 0,
        });
        this.subTotal = this.subTotal + parseFloat(payload[0].service_price);
        this.total = this.subTotal;
        Notify.create({
          position: "bottom",
          type: "positive",
          timeout: 1000,
          message: "Added to cart",
        });
      }
      // this.totalDiscount = 0;

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
      this.rowDatas[cartItemCheck].discount = 0;
      this.rowDatas[cartItemCheck].discountId = "";
      const cartTotal = this.rowDatas[cartItemCheck].total;
      this.subTotal = this.subTotal + this.rowDatas[cartItemCheck].srp;
      this.total = this.subTotal;
      // this.totalDiscount = 0;
      this.totalPayablesFunc();
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
    removeMop(payload) {
      const objWithIdIndex = this.mop.findIndex((item) => item.uid === payload);
      var reback =
        this.mop[objWithIdIndex].amount - this.mop[objWithIdIndex].change;
      this.balanceDue += reback;

      // console.log(this.total);
      if (objWithIdIndex > -1) {
        this.mop.splice(objWithIdIndex, 1);
        // Notify.create({
        //   type: "positive",
        //   message: "Item Removed!",
        //   position: "top",
        // });
      }
      this.totalPayablesFunc();
      return this.tempCashierProductDatas;
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
      this.totalPayablesFunc();
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
      /**
       * Old function
       */

      const objWithIdFilter = this.rowDatas.filter(
        (obj) => obj.uid === this.selectedUid
      );

      this.totalDiscount =
        parseFloat(this.totalDiscount) -
        parseFloat(
          objWithIdFilter[0].discount ? objWithIdFilter[0].discount : 0
        );
      objWithIdFilter[0].discountId = payload.id;
      objWithIdFilter[0].discount = 0;
      objWithIdFilter[0].total =
        objWithIdFilter[0].srp * objWithIdFilter[0].qty;
      // this.subTotal = objWithIdFilter[0].srp * objWithIdFilter[0].qty;
      // this.total = this.subTotal;

      objWithIdFilter[0].discount =
        parseFloat(objWithIdFilter[0].discount) +
        (payload.type == "Percentage"
          ? parseFloat((payload.number / 100) * objWithIdFilter[0].total)
          : parseFloat(payload.number));
      objWithIdFilter[0].total =
        objWithIdFilter[0].total - objWithIdFilter[0].discount;

      // this.subTotal = this.subTotal - objWithIdFilter[0].discount;
      // this.total = this.subTotal;

      this.totalDiscount = this.totalDiscount + objWithIdFilter[0].discount;
      this.totalPayablesFunc();
      // console.log(objWithIdFilter[0]);
      // this.discountId = payload.id;
      // this.total = this.subTotal;
      // this.totalDiscount = 0;
      // this.totalDiscount =
      //   parseFloat(this.totalDiscount) +
      //   (payload.type == "Percentage"
      //     ? parseFloat((payload.number / 100) * this.total)
      //     : parseFloat(payload.number));
      // this.total = this.total - this.totalDiscount;
      /**
       * new function
       */
    },

    totalPayablesFunc() {
      this.subTotal = 0;
      this.totalDiscount = 0;
      Object.entries(this.rowDatas).map(([key, val]) => {
        this.subTotal += val.total;
        this.totalDiscount += val.discount ? parseFloat(val.discount) : 0;
      });
      this.total = this.subTotal;
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
