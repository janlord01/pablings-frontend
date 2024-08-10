import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage, uid } from "quasar";

export const usePayrollData = defineStore("payrollStore", {
  state: () => ({
    rowDatas: [],
    tempRowDatas: [],

    mainDatas: [],

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
    workerLoans: [],
    workerLoanLoadiing: false,
    selectedLoan: [],
    selectedId: [],
    selectedLoanAmount: 0,
    selectedLoanDescription: "",

    // Benefits variable/data
    benefits: [],
    benefitsLoading: false,
    selectedBenefit: [],
    selectedBenefitAMount: "",

    mainLoading: false,
  }),
  getters: {},
  actions: {
    clearData() {
      this.rowDatas = [];
      this.tempRowDatas = [];

      // this.mainDatas = [];

      this.commissionData = [];
      this.commissionTempData = [];
      this.loadingCommission = false;

      this.ExpensesData = [];
      this.ExpensesTempData = [];
      this.loadingExpenses = false;

      this.loading = true;
      this.user = [];
      this.userName = "";
      this.grossSalary = 0;
      this.totalExpenses = 0;
      this.netSalary = 0;
      this.workerLoans = [];
      this.workerLoanLoadiing = false;
      this.selectedLoan = [];
      this.selectedId = [];
      this.selectedLoanAmount = 0;
      this.selectedLoanDescription = "";

      // Benefits variable/data
      this.benefits = [];
      this.benefitsLoading = false;
      this.selectedBenefit = [];
      this.selectedBenefitAMount = "";

      this.mainLoading = false;
    },
    hiFunc() {
      console.log("hi");
    },
    async getAllPayrolls(payload) {
      this.mainLoading = true;
      this.mainDatas = [];
      const newToken = LocalStorage.getItem("jwt");
      api
        .get("/api/payroll/" + payload, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);

          if (response.data.status == 200) {
            setTimeout(() => {
              this.mainDatas = response.data.data;
              this.mainLoading = false;
            }, 500);
          } else {
            setTimeout(() => {
              this.mainLoading = false;
              Notify.create({
                type: "negative",
                icon: "error",
                timeout: 3000,
                position: "bottom",
                message: "Something went wrong!",
              });
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getEmployeeCommission(payload) {
      this.commissionData = [];
      this.commissionTempData = [];
      this.loadingCommission = true;
      this.grossSalary = 0;
      this.netSalary = 0;

      Loading.show({
        message: "Some important process is in progress. Please wait...",
      });

      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(
          `api/payment/worker/commission/${this.user.value}`,
          {
            params: {
              startDate: payload[0],
              endDate: payload[1],
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
              Notify.create({
                position: "bottom",
                type: "positive",
                timeout: 3000,
                message: "Added!",
              });
              console.log(this.grossSalary);

              Object.entries(response.data.commissions).map(([key, val]) => {
                // console.log(val.amount);
                const newIId = uid();
                this.commissionTempData.push({
                  uid: newIId,
                  id: val.id,
                  pay_id: val.pay_id,
                  type: val.id ? "commission" : val.type,
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
              // Loading.hide()
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
              Loading.hide();
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
            Loading.hide();
          }, 3000);
        });
    },
    async getEmployeeExpenses(payload) {
      this.ExpensesData = [];
      this.ExpensesTempData = [];
      this.loadingExpenses = true;
      this.netSalary = 0;
      this.totalExpenses = 0;

      Loading.show({
        message: "Some important process is in progress. Please wait...",
      });
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(
          `api/payment/worker/expenses/${this.user.value}`,
          {
            params: {
              startDate: payload[0],
              endDate: payload[1],
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
              Notify.create({
                position: "bottom",
                type: "positive",
                timeout: 3000,
                message: "Added!",
              });
              // console.log(this.grossSalary);

              Object.entries(response.data.expenses).map(([key, val]) => {
                // console.log(val.amount);
                const newIId = uid();
                this.ExpensesData.push({
                  uid: newIId,
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
              Loading.hide();
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
              Loading.hide();
            }, 3000);
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
            Loading.hide();
          }, 3000);
        });
    },
    addBonusWorker(payload) {
      this.loadingCommission = true;
      setTimeout(() => {
        const newIId = uid();
        this.commissionTempData.push({
          uid: newIId,
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
      const newIId = uid();
      setTimeout(() => {
        this.commissionTempData.push({
          uid: newIId,
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
      const newIId = uid();
      setTimeout(() => {
        this.ExpensesData.push({
          uid: newIId,
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
    addDeductionLoanWorker() {
      this.loadingExpenses = true;
      setTimeout(() => {
        const newIId = uid();
        this.ExpensesData.push({
          uid: newIId,
          type: "loan",
          id: this.selectedId,
          expenseName: this.selectedLoanDescription,
          title: this.selectedLoanDescription,
          amount: this.selectedLoanAmount,
        });
        // this.ExpensesData = this.ExpensesTempData;
        this.totalExpenses =
          parseFloat(this.totalExpenses) + parseFloat(this.selectedLoanAmount);
        this.netSalary =
          parseFloat(this.netSalary) - parseFloat(this.selectedLoanAmount);
        this.loadingExpenses = false;
        Notify.create({
          position: "bottom",
          type: "positive",
          timeout: 3000,
          message: "Added!",
        });
      }, 500);
    },
    addBenefitWorker() {
      this.loadingExpenses = true;
      const objWithIdIndex = this.benefits.findIndex(
        (item) => item.id === this.selectedBenefit.id
      );
      this.selectedBenefitAMount = this.benefits[objWithIdIndex].amount;
      setTimeout(() => {
        const newIId = uid();
        this.ExpensesData.push({
          uid: newIId,
          type: "benefit deduction",
          expenseName: this.benefits[objWithIdIndex].label,
          title: this.benefits[objWithIdIndex].label,
          amount: this.selectedBenefitAMount,
        });
        // this.ExpensesData = this.ExpensesTempData;
        this.totalExpenses =
          parseFloat(this.totalExpenses) +
          parseFloat(this.selectedBenefitAMount);
        this.netSalary =
          parseFloat(this.netSalary) - parseFloat(this.selectedBenefitAMount);
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
      this.workerLoanLoadiing = true;
      this.workerLoans = [];
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
          if (response.data.status) {
            setTimeout(() => {
              Object.entries(response.data.data).map(([key, val]) => {
                this.workerLoans.push(val);
              });
              this.workerLoanLoadiing = false;
            }, 500);
            console.log(this.workerLoans);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getLoan() {
      const objWithIdIndex = this.workerLoans.findIndex(
        (item) => item.id === this.selectedLoan.id
      );
      this.selectedLoanAmount = this.workerLoans[objWithIdIndex].amount;
      this.selectedId = this.workerLoans[objWithIdIndex].id;
    },
    getBenefit() {
      console.log(this.selectedBenefit);
      const objWithIdIndex = this.benefits.findIndex(
        (item) => item.id === this.selectedBenefit.id
      );
      this.selectedBenefitAMount = this.benefits[objWithIdIndex].amount;
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
    async getBenefits(payload) {
      this.benefitsLoading = true;
      this.benefits = [];
      let newToken = LocalStorage.getItem("jwt");
      await api
        .get(
          `api/benefits`,
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
          if (response.data.status) {
            setTimeout(() => {
              Object.entries(response.data.data).map(([key, val]) => {
                this.benefits.push(val);
              });
              this.benefitsLoading = false;
            }, 5000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    removeItem(payload) {
      console.log(payload);
      if (payload[1] === "income") {
        this.loadingCommission = true;
        const objWithIdIndex = this.commissionTempData.findIndex(
          (item) => item.uid === payload[0]
        );

        setTimeout(() => {
          this.grossSalary =
            parseFloat(this.grossSalary) -
            parseFloat(this.commissionTempData[objWithIdIndex].amount);

          this.netSalary =
            parseFloat(this.netSalary) -
            parseFloat(this.commissionTempData[objWithIdIndex].amount);

          // console.log(this.total);
          if (objWithIdIndex > -1) {
            this.commissionTempData.splice(objWithIdIndex, 1);
            Notify.create({
              type: "positive",
              message: "Item Removed!",
              position: "top",
            });
          }
          this.commissionData = this.commissionTempData;
          this.loadingCommission = false;
        }, 500);
      } else {
        this.loadingExpenses = true;
        const objWithIdIndex = this.ExpensesData.findIndex(
          (item) => item.uid === payload[0]
        );

        setTimeout(() => {
          this.totalExpenses =
            parseFloat(this.totalExpenses) -
            parseFloat(this.ExpensesData[objWithIdIndex].amount);

          this.netSalary =
            parseFloat(this.netSalary) +
            parseFloat(this.ExpensesData[objWithIdIndex].amount);

          // console.log(this.total);
          if (objWithIdIndex > -1) {
            this.ExpensesData.splice(objWithIdIndex, 1);
            Notify.create({
              type: "positive",
              message: "Item Removed!",
              position: "top",
            });
          }
          // this.ExpensesData = this.ExpensesTempData;
          this.loadingExpenses = false;
        }, 500);
      }
    },
  },
});
