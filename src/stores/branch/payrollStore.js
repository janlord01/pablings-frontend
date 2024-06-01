import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage, uid } from "quasar";

export const usePayrollData = defineStore("payrollStore", {
  state: () => ({
    rowDatas: [],
    tempRowDatas: [],

    commissionData: [],
    commissionTempData: [],
    loadingCommission: false,

    ExpensesData: [],
    ExpensesTempData: [],
    loadingExpenses: false,

    loading: true,
    user: [],
    userName: "",
    grossSalary: 0,
    totalExpenses: 0,
    netSalary: 0,
  }),
  getters: {},
  actions: {
    hiFunc() {
      console.log("hi");
    },
    async getEmployeeCommission() {
      this.commissionData = [];
      this.commissionTempData = [];
      this.loadingCommission = true;
      this.grossSalary = 0;
      this.netSalary = 0;

      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(`api/payment/worker/commission/${this.user.value}`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.status == 200) {
            setTimeout(() => {
              Notify.create({
                position: "bottom",
                type: "positive",
                timeout: 3000,
                message: "Added!",
              });
              console.log(this.grossSalary);

              Object.entries(response.data.commissions).map(([key, val]) => {
                // console.log(val.amount);
                this.commissionTempData.push({
                  uid: uid,
                  type: val.pay_id ? val.pay_id : val.type,
                  title: val.title ? val.title : val.service_name,
                  amount: val.amount,
                });
                this.grossSalary =
                  parseFloat(this.grossSalary) + parseFloat(val.amount);

                this.netSalary =
                  parseFloat(this.netSalary) + parseFloat(val.amount);
              });
              this.netSalary =
                parseFloat(this.netSalary) - parseFloat(this.totalExpenses);

              // this.commissionTempData = response.data.commissions;

              this.commissionData = this.commissionTempData;

              // Object.entries(this.ExpensesData).map(([key, val]) => {
              //   this.netSalary =
              //     parseFloat(this.netSalary) - parseFloat(val.amount);
              // });
              this.loadingCommission = false;
            }, 500);
          } else {
            setTimeout(() => {
              // this.commissionData = response.data.commissions;
              Notify.create({
                position: "bottom",
                type: "negative",
                timeout: 3000,
                message: "An error occurred while getting the commissions.",
              });
              this.loadingCommission = false;
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => {
            // this.commissionData = response.data.commissions;
            Notify.create({
              position: "bottom",
              type: "negative",
              timeout: 3000,
              message: "An error occurred while getting the commissions.",
            });
            this.loadingCommission = false;
          }, 3000);
        });
    },
    async getEmployeeExpenses() {
      this.ExpensesData = [];
      this.ExpensesTempData = [];
      this.loadingExpenses = true;
      this.netSalary = 0;
      this.totalExpenses = 0;

      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(`api/payment/worker/expenses/${this.user.value}`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.status == 200) {
            setTimeout(() => {
              Notify.create({
                position: "bottom",
                type: "positive",
                timeout: 3000,
                message: "Added!",
              });
              // console.log(this.grossSalary);

              Object.entries(response.data.expenses).map(([key, val]) => {
                // console.log(val.amount);
                this.ExpensesData.push({
                  uid: uid,
                  type: "deduction",
                  id: val.id,
                  expenseName: val.expenseName,
                  status: val.expense_status,
                  amount: val.amount,
                });

                this.totalExpenses =
                  parseFloat(this.totalExpenses) + parseFloat(val.amount);

                this.netSalary =
                  parseFloat(this.netSalary) - parseFloat(val.amount);
              });
              Object.entries(this.commissionData).map(([key, val]) => {
                this.netSalary =
                  parseFloat(this.netSalary) + parseFloat(val.amount);
              });

              this.loadingExpenses = false;
            }, 500);
          } else {
            setTimeout(() => {
              // this.commissionData = response.data.commissions;
              Notify.create({
                position: "bottom",
                type: "negative",
                timeout: 3000,
                message: "An error occurred while getting the commissions.",
              });
              this.loadingExpenses = false;
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => {
            // this.commissionData = response.data.commissions;
            Notify.create({
              position: "bottom",
              type: "negative",
              timeout: 3000,
              message: "An error occurred while getting the commissions.",
            });
            this.loadingExpenses = false;
          }, 3000);
        });
    },
    addBonusWorker(payload) {
      this.loadingCommission = true;
      setTimeout(() => {
        this.commissionTempData.push({
          uid: uid,
          type: "bonus",
          title: payload[1],
          amount: payload[0],
        });
        this.commissionData = this.commissionTempData;
        this.grossSalary =
          parseFloat(this.grossSalary) + parseFloat(payload[0]);
        this.netSalary = parseFloat(this.netSalary) + parseFloat(payload[0]);
        this.loadingCommission = false;
        Notify.create({
          position: "bottom",
          type: "positive",
          timeout: 3000,
          message: "Added!",
        });
      }, 500);
    },
    addSalaryWorker(payload) {
      this.loadingCommission = true;
      setTimeout(() => {
        this.commissionTempData.push({
          uid: uid,
          type: "salary",
          title: payload[1],
          amount: payload[0],
        });

        this.commissionData = this.commissionTempData;
        this.grossSalary =
          parseFloat(this.grossSalary) + parseFloat(payload[0]);
        this.netSalary = parseFloat(this.netSalary) + parseFloat(payload[0]);
        this.loadingCommission = false;
        Notify.create({
          position: "bottom",
          type: "positive",
          timeout: 3000,
          message: "Added!",
        });
      }, 500);
    },
    addDeductionWorker(payload) {
      this.loadingExpenses = true;
      setTimeout(() => {
        this.ExpensesData.push({
          uid: uid,
          type: "new deduction",
          expenseName: payload[1],
          title: payload[1],
          amount: payload[0],
        });
        // this.ExpensesData = this.ExpensesTempData;
        this.totalExpenses =
          parseFloat(this.totalExpenses) + parseFloat(payload[0]);
        this.netSalary = parseFloat(this.netSalary) - parseFloat(payload[0]);
        this.loadingExpenses = false;
        Notify.create({
          position: "bottom",
          type: "positive",
          timeout: 3000,
          message: "Added!",
        });
      }, 500);
    },
    selectWorkerForCommission(payload) {
      this.user = payload;
      this.userName = payload.label;
      this.commissionData = [];
      this.commissionTempData = [];
    },
    async getWorkerLoan(payload) {
      let newToken = LocalStorage.getItem("jwt");
      await api
        .get(
          `api/loans/${this.user.value}`,
          {
            params: {
              branch: payload,
            },
          },
          {
            headers: {
              Authorization: "Bearer " + newToken,
            },
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getAllLoans(payload) {
      this.rowDatas = [];
      this.tempRowDatas = [];
      this.loading = true;
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(
          "api/loans",
          {
            params: {
              branch: payload,
            },
          },
          {
            headers: {
              Authorization: "Bearer " + newToken,
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.data.status == 200) {
            setTimeout(() => {
              Object.entries(response.data.data).map(([key, val]) => {
                this.tempRowDatas.push(val);
              });
              this.rowDatas = this.tempRowDatas;
              this.loading = false;
            }, 1000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
