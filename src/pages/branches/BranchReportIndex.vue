<template>
  <q-page class="">
    <div
      :class="
        $q.dark.isActive
          ? 'shadow-1 q-pa-md rounded-borders text-white bg-dark q-pa-lg'
          : 'shadow-1 q-pa-md rounded-borders text-dark bg-white q-pa-lg'
      "
      style="border-radius: 20px"
    >
      <div
        class="full-width q-px-md"
        :class="$q.screen.gt.xs ? '' : 'q-pa-md'"
        v-if="
          userStore.userDetails.roles.some(
            (permis) => ['owner'].indexOf(permis) !== -1
          )
        "
      >
        <h3 :class="$q.screen.gt.xs ? ' full-width  text-h5' : 'hidden'">
          {{ mainStore.loc }}
        </h3>
        <div class="row full-width">
          <div :class="$q.screen.gt.xs ? 'col-4 q-mr-sm' : 'full-width'">
            <div class="full-width">
              <q-input
                filled
                v-model="start_date"
                label="Starting Date"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="start_date">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div :class="$q.screen.gt.xs ? 'col-4 q-mr-sm' : 'full-width'">
            <div class="full-width">
              <q-input
                filled
                v-model="end_date"
                label="End Date"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="end_date">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div :class="$q.screen.gt.xs ? 'col-3 q-mr-sm' : 'full-width'">
            <div class="full-width">
              <q-btn
                color="blue"
                @click="selectDate"
                label="Select"
                icon="check_circle_outline"
                class="q-pa-md q-mr-sm"
              />
              <q-btn
                color="orange"
                @click="resetBtnFunc"
                label="Reset"
                icon="refresh"
                class="q-pa-md"
              />
            </div>
          </div>
        </div>
        <div class="row full-width">
          <q-card
            class="bg-transparent"
            :class="$q.screen.gt.xs ? 'col q-mr-md' : 'full-width q-mb-md'"
          >
            <q-card-section class="text-center">
              <div class="q-pa-lg" style="border-radius: 10px">
                <q-avatar
                  size="60px"
                  style="background: rgba(39, 174, 228, 0.5)"
                  class="q-mb-lg"
                >
                  <q-icon name="people_outline" color="light-blue" /> </q-avatar
                ><br />
                <span class="text-h3 text-bold text-center">
                  {{ totalTransactions }} </span
                ><br />
                <span class="text-body1 text-center">Transactions </span>
              </div>
            </q-card-section>
          </q-card>

          <q-card
            class="bg-transparent"
            :class="$q.screen.gt.xs ? 'col q-mr-md' : 'full-width q-mb-md'"
          >
            <q-card-section class="text-center">
              <div class="q-pa-lg" style="border-radius: 10px">
                <q-avatar
                  size="60px"
                  text-color="white"
                  style="background: rgba(219, 28, 248, 0.5)"
                  class="q-mb-lg"
                >
                  <q-icon name="people" color="purple" /> </q-avatar
                ><br />
                <span class="text-h3 text-bold text-center">
                  {{ totalStaff }} </span
                ><br />
                <span class="text-body1 text-center">Staff</span>
              </div>
            </q-card-section>
          </q-card>

          <q-card
            class="bg-transparent"
            :class="$q.screen.gt.xs ? 'col q-mr-md' : 'full-width q-mb-md'"
          >
            <q-card-section class="text-center">
              <div class="q-pa-lg" style="border-radius: 10px">
                <q-avatar
                  size="60px"
                  text-color="white"
                  style="background: rgba(244, 158, 0, 0.5)"
                  class="q-mb-lg"
                >
                  <q-icon name="groups" color="orange" /> </q-avatar
                ><br />
                <span class="text-h3 text-bold text-center">
                  {{ totalBarber }} </span
                ><br />
                <span class="text-body1 text-center">Barbers</span>
              </div>
            </q-card-section>
          </q-card>

          <q-card
            class="bg-transparent"
            :class="$q.screen.gt.xs ? 'col q-mr-md' : 'full-width q-mb-md'"
          >
            <q-card-section class="text-center">
              <div class="q-pa-lg" style="border-radius: 10px">
                <q-avatar
                  size="60px"
                  text-color="white"
                  style="background: rgba(187, 6, 33, 0.5)"
                  class="q-mb-lg"
                >
                  <q-icon name="baby_changing_station" color="red" /> </q-avatar
                ><br />
                <span class="text-h3 text-bold text-center">
                  {{ totalCashier }} </span
                ><br />
                <span class="text-body1 text-center">Cashier</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="row full-width q-mt-md">
          <q-card
            class="bg-transparent"
            :class="$q.screen.gt.xs ? 'col q-mr-md' : 'full-width q-mb-md'"
          >
            <q-card-section class="text-center">
              <div class="q-pa-lg" style="border-radius: 10px">
                <q-avatar
                  size="60px"
                  text-color="white"
                  style="background: rgba(0, 244, 61, 0.5)"
                  class="q-mb-lg"
                >
                  <q-icon name="attach_money" color="green" /> </q-avatar
                ><br />
                <span class="text-h3 text-bold text-center">
                  {{ totalIncomeTransactions }} </span
                ><br />
                <span class="text-body1 text-center">Total Income</span>
              </div>
            </q-card-section>
          </q-card>
          <q-card
            class="bg-transparent"
            :class="$q.screen.gt.xs ? 'col q-mr-md' : 'full-width q-mb-md'"
          >
            <q-card-section class="text-center">
              <div class="q-pa-lg" style="border-radius: 10px">
                <q-avatar
                  size="60px"
                  text-color="white"
                  style="background: rgba(0, 244, 61, 0.5)"
                  class="q-mb-lg"
                >
                  <q-icon name="attach_money" color="green" /> </q-avatar
                ><br />
                <span class="text-h3 text-bold text-center">
                  {{ totalServiceIncome }} </span
                ><br />
                <span class="text-body1 text-center"
                  >Total Services Income</span
                >
              </div>
            </q-card-section>
          </q-card>

          <q-card
            class="bg-transparent"
            :class="$q.screen.gt.xs ? 'col q-mr-md' : 'full-width q-mb-md'"
          >
            <q-card-section class="text-center">
              <div class="q-pa-lg" style="border-radius: 10px">
                <q-avatar
                  size="60px"
                  text-color="white"
                  style="background: rgba(0, 244, 61, 0.5)"
                  class="q-mb-lg"
                >
                  <q-icon name="attach_money" color="green" /> </q-avatar
                ><br />
                <span class="text-h3 text-bold text-center">
                  {{ totalProductIncome }} </span
                ><br />
                <span class="text-body1 text-center">Total Product Income</span>
              </div>
            </q-card-section>
          </q-card>
          <q-card
            class="bg-transparent"
            :class="$q.screen.gt.xs ? 'col q-mr-md' : 'full-width q-mb-md'"
          >
            <q-card-section class="text-center">
              <div class="q-pa-lg" style="border-radius: 10px">
                <q-avatar
                  size="60px"
                  text-color="white"
                  style="background: rgba(210, 5, 5, 0.5)"
                  class="q-mb-lg"
                >
                  <q-icon name="attach_money" color="red" /> </q-avatar
                ><br />
                <span class="text-h3 text-bold text-center"> {{ 0 }} </span
                ><br />
                <span class="text-body1 text-center">Total Expenses</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="full-width row q-mt-md">
          <q-card
            class="bg-transparent"
            :class="$q.screen.gt.xs ? 'col q-mr-md' : 'full-width q-mb-md'"
          >
            <q-card-section class="text-center">
              <div class="q-pa-lg" style="border-radius: 10px">
                <q-avatar
                  size="60px"
                  text-color="white"
                  style="background: rgba(210, 5, 5, 0.5)"
                  class="q-mb-lg"
                >
                  <q-icon name="attach_money" color="red" /> </q-avatar
                ><br />
                <span class="text-h3 text-bold text-center">
                  {{ totalDiscounts }} </span
                ><br />
                <span class="text-body1 text-center">Total Discount</span>
              </div>
            </q-card-section>
          </q-card>

          <q-card
            class="bg-transparent"
            :class="$q.screen.gt.xs ? 'col q-mr-md' : 'full-width q-mb-md'"
          >
            <q-card-section class="text-center">
              <div class="q-pa-lg" style="border-radius: 10px">
                <q-avatar
                  size="60px"
                  text-color="white"
                  style="background: rgb(16, 138, 231)"
                  class="q-mb-lg"
                >
                  <q-icon name="attach_money" color="blue-10" /> </q-avatar
                ><br />
                <span class="text-h3 text-bold text-center">
                  {{ totalIncomeTransactionsCash }} </span
                ><br />
                <span class="text-body1 text-center">Total Cash</span>
              </div>
            </q-card-section>
          </q-card>
          <q-card class="bg-transparent">
            <q-card-section class="text-center">
              <div class="q-pa-lg" style="border-radius: 10px">
                <q-avatar
                  size="60px"
                  text-color="white"
                  style="background: rgb(16, 138, 231)"
                  class="q-mb-lg"
                >
                  <q-icon name="attach_money" color="blue-10" /> </q-avatar
                ><br />
                <span class="text-h3 text-bold text-center">
                  {{ totalIncomeTransactionsGCash }} </span
                ><br />
                <span class="text-body1 text-center">Total Gcash</span>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="row full-width q-mt-md">
          <!-- <div :class="$q.screen.gt.xs ? 'col-6' : 'full-width'">
            <q-card class="bg-transparent q-mr-md">
              <q-card-section class="text-center">
                <q-card-section>
                  <p class="text-h6">Gender</p>

                  <div id="chartGender" style="min-height: 500px"></div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div> -->

          <q-card class="bg-transparent col">
            <q-card-section class="text-center">
              <q-card-section>
                <p class="text-h6">Services most avail</p>

                <div id="chart" style="min-height: 500px"></div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-dialog v-model="showViewDialog">
        <viewItemPaid
          :payment-id="payment_id"
          @hide-view-dialog="showViewDialog = !showViewDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { useUserData } from "stores/users/store";
import moment from "moment";
import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import ApexCharts from "apexcharts";
import { useQuasar } from "quasar";

import { useMainStoreData } from "stores/store";
import viewItemPaid from "src/components/branches/cashier/viewItem.vue";

import { useRoute } from "vue-router";

const route = useRoute();
const mainStore = useMainStoreData();
const showViewDialog = ref(false);
const $q = useQuasar();
const userStore = useUserData();
const rows = reactive([]);
const newToken = ref(LocalStorage.getItem("jwt"));

const programs = reactive([]);

const totalTransactions = ref(0);
const totalStaff = ref(0);
const totalBarber = ref(0);
const totalCashier = ref(0);
const count_per_plan = reactive([]);
let plantNames = reactive([]);
let planTotals = reactive([]);
const totalServiceIncome = ref(0);
const totalProductIncome = ref(0);
const totalIncomeTransactions = ref(0);
const totalDiscounts = ref(0);
const totalIncomeTransactionsCash = ref(0);
const totalIncomeTransactionsGCash = ref(0);

// Cashier/Manager
const Cashier_totalServiceIncome = ref(0);
const Cashier_totalProductIncome = ref(0);
const Cashier_totalIncomeTransactions = ref(0);
const Cashier_totalDiscounts = ref(0);
const Cashier_totalIncomeTransactionsCash = ref(0);
const Cashier_totalIncomeTransactionsGCash = ref(0);

const totalServiceIncome_cash = ref(0);
const totalServiceIncome_gcash = ref(0);

const paid_by_cash = reactive([]);
const paid_by_gcash = reactive([]);
const product = reactive([]);
const product_gcash = reactive([]);
const male = ref(0);
const female = ref(0);

const start_date = ref("");
const end_date = ref("");

const payment_id = ref(null);
const viewItem = (id) => {
  showViewDialog.value = true;
  payment_id.value = id;
};
const resetBtnFunc = () => {
  getDashboardForAdmin();
};

const resetBtnFuncCashier = () => {
  getDashboardForCashierManager();
};
const selectDate = async () => {
  if (
    start_date.value === "" ||
    start_date.value === null ||
    end_date.value === "" ||
    end_date.value === null
  ) {
    $q.notify({
      type: "negative",
      timeout: 3000,
      position: "top",
      message:
        "Starting date or End date cannot be empty, Please select the date!",
    });
  } else {
    planTotals = [];
    plantNames = [];
    $q.loading.show();
    await api
      .get(
        `/api/dashboard/branches/selectDate/${route.params.slug}`,
        {
          params: {
            start_date: start_date.value,
            end_date: end_date.value,
            branchId: route.params.id,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + newToken.value,
          },
        }
      )
      .then((response) => {
        console.log(response);
        $q.loading.hide();
        totalTransactions.value = response.data.totalTransactions;
        totalStaff.value = response.data.totalStaff;
        totalBarber.value = response.data.totalBarber;
        totalCashier.value = response.data.totalCashier;

        let totalIncome = parseFloat(
          response.data.totalIncomeTransactions.total
        )
          .toFixed(2)
          .split(".");
        totalIncomeTransactions.value =
          response.data.totalIncomeTransactions.total != null
            ? "P" +
              totalIncome[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
              (totalIncome[1] ? "." + totalIncome[1] : "")
            : 0;

        let totalCash = parseFloat(
          response.data.totalIncomeTransactionsCash.total
        )
          .toFixed(2)
          .split(".");
        totalIncomeTransactionsCash.value =
          response.data.totalIncomeTransactionsCash.total != null
            ? "P" +
              totalCash[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
              (totalCash[1] ? "." + totalCash[1] : "")
            : 0;

        let totalGCash = parseFloat(
          response.data.totalIncomeTransactionsGCash.total
        )
          .toFixed(2)
          .split(".");
        totalIncomeTransactionsGCash.value =
          response.data.totalIncomeTransactionsGCash.total != null
            ? "P" +
              totalGCash[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
              (totalGCash[1] ? "." + totalGCash[1] : "")
            : 0;

        let totalDis = parseFloat(response.data.totalDiscounts.total)
          .toFixed(2)
          .split(".");
        totalDiscounts.value =
          response.data.totalDiscounts.total != null
            ? "P" +
              totalDis[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
              (totalDis[1] ? "." + totalDis[1] : "")
            : 0;

        let totalService = parseFloat(response.data.totalServiceIncome.total)
          .toFixed(2)
          .split(".");
        totalServiceIncome.value =
          response.data.totalServiceIncome.total != null
            ? "P" +
              totalService[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
              (totalService[1] ? "." + totalService[1] : "")
            : 0;

        let totalProduct = parseFloat(response.data.totalProductIncome.total)
          .toFixed(2)
          .split(".");
        totalProductIncome.value =
          response.data.totalProductIncome.total != null
            ? "P" +
              totalProduct[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
              (totalProduct[1] ? "." + totalProduct[1] : "")
            : 0;
      })
      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          $q.notify({
            type: "negative",
            timeout: 3000,
            position: "top",
            message: "Error!, Something went wrong!",
          });
          $q.loading.hide();
        }, 3000);
      });
  }
};
const getDashboardForAdmin = async () => {
  planTotals = [];
  plantNames = [];
  $q.loading.show();
  await api
    .get(
      `/api/dashboard/branches/${route.params.slug}`,
      {
        params: {
          start_date: start_date.value,
          end_date: end_date.value,
          branchId: route.params.id,
        },
      },
      {
        headers: {
          Authorization: "Bearer " + newToken.value,
        },
      }
    )
    .then((response) => {
      console.log(response);

      mainStore.loc = response.data.branch.name + " Dashboard";
      $q.loading.hide();
      totalTransactions.value = response.data.totalTransactions;
      totalStaff.value = response.data.totalStaff;
      totalBarber.value = response.data.totalBarber;
      totalCashier.value = response.data.totalCashier;

      let totalIncome = parseFloat(response.data.totalIncomeTransactions.total)
        .toFixed(2)
        .split(".");
      totalIncomeTransactions.value =
        response.data.totalIncomeTransactions.total != null
          ? "P" +
            totalIncome[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
            (totalIncome[1] ? "." + totalIncome[1] : "")
          : 0;

      let totalCash = parseFloat(
        response.data.totalIncomeTransactionsCash.total
      )
        .toFixed(2)
        .split(".");
      totalIncomeTransactionsCash.value =
        response.data.totalIncomeTransactionsCash.total != null
          ? "P" +
            totalCash[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
            (totalCash[1] ? "." + totalCash[1] : "")
          : 0;

      let totalGCash = parseFloat(
        response.data.totalIncomeTransactionsGCash.total
      )
        .toFixed(2)
        .split(".");
      totalIncomeTransactionsGCash.value =
        response.data.totalIncomeTransactionsGCash.total != null
          ? "P" +
            totalGCash[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
            (totalGCash[1] ? "." + totalGCash[1] : "")
          : 0;

      let totalDis = parseFloat(response.data.totalDiscounts.total)
        .toFixed(2)
        .split(".");
      totalDiscounts.value =
        response.data.totalDiscounts.total != null
          ? "P" +
            totalDis[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
            (totalDis[1] ? "." + totalDis[1] : "")
          : 0;

      let totalService = parseFloat(response.data.totalServiceIncome.total)
        .toFixed(2)
        .split(".");
      totalServiceIncome.value =
        response.data.totalServiceIncome.total != null
          ? "P" +
            totalService[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
            (totalService[1] ? "." + totalService[1] : "")
          : 0;

      let totalProduct = parseFloat(response.data.totalProductIncome.total)
        .toFixed(2)
        .split(".");
      totalProductIncome.value =
        response.data.totalProductIncome.total != null
          ? "P" +
            totalProduct[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
            (totalProduct[1] ? "." + totalProduct[1] : "")
          : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getDashboardForCashierManager = async () => {
  planTotals = [];
  plantNames = [];
  $q.loading.show();
  await api
    .get(
      `/api/${route.params.slug}/dashboard`,
      {
        params: {
          start_date: start_date.value,
          end_date: end_date.value,
          branchName: LocalStorage.getItem("branchName"),
        },
      },
      {
        headers: {
          Authorization: "Bearer " + newToken.value,
        },
      }
    )
    .then((response) => {
      console.log(response);
      $q.loading.hide();

      let totalIncome = parseFloat(
        response.data.Cashier_totalIncomeTransactions.total
      )
        .toFixed(2)
        .split(".");
      Cashier_totalIncomeTransactions.value =
        response.data.Cashier_totalIncomeTransactions.total != null
          ? "P" +
            totalIncome[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
            (totalIncome[1] ? "." + totalIncome[1] : "")
          : 0;

      let totalCash = parseFloat(
        response.data.Cashier_totalIncomeTransactionsCash.total
      )
        .toFixed(2)
        .split(".");
      Cashier_totalIncomeTransactionsCash.value =
        response.data.Cashier_totalIncomeTransactionsCash.total != null
          ? "P" +
            totalCash[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
            (totalCash[1] ? "." + totalCash[1] : "")
          : 0;

      let totalGCash = parseFloat(
        response.data.Cashier_totalIncomeTransactionsGCash.total
      )
        .toFixed(2)
        .split(".");
      Cashier_totalIncomeTransactionsGCash.value =
        response.data.Cashier_totalIncomeTransactionsGCash.total != null
          ? "P" +
            totalGCash[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
            (totalGCash[1] ? "." + totalGCash[1] : "")
          : 0;

      let totalDis = parseFloat(response.data.Cashier_totalDiscounts.total)
        .toFixed(2)
        .split(".");
      Cashier_totalDiscounts.value =
        response.data.Cashier_totalDiscounts.total != null
          ? "P" +
            totalDis[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
            (totalDis[1] ? "." + totalDis[1] : "")
          : 0;

      let totalService = parseFloat(
        response.data.Cashier_totalServiceIncome.total
      )
        .toFixed(2)
        .split(".");
      Cashier_totalServiceIncome.value =
        response.data.Cashier_totalServiceIncome.total != null
          ? "P" +
            totalService[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
            (totalService[1] ? "." + totalService[1] : "")
          : 0;

      let totalProduct = parseFloat(
        response.data.Cashier_totalProductIncome.total
      )
        .toFixed(2)
        .split(".");
      Cashier_totalProductIncome.value =
        response.data.Cashier_totalProductIncome.total != null
          ? "P" +
            totalProduct[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
            (totalProduct[1] ? "." + totalProduct[1] : "")
          : 0;
    })
    .catch((error) => {
      console.log(error);
    });
};
const pagination = reactive({
  sortBy: "time",
  rowsPerPage: 15,
  sortOrder: "ad",
});
const columns = reactive([
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left",
    sortable: true,
  },
  {
    name: "time",
    label: "Updated At",
    field: "itimed",
    align: "left",
  },
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
  },

  {
    name: "time_in",
    label: "Time In",
    field: "time_in",
    align: "left",
    sortable: true,
  },
  {
    name: "time_out",
    label: "Time Out",
    field: "time_out",
    align: "left",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
]);

const pagination2 = reactive({
  sortBy: "time",
  rowsPerPage: 50,
  sortOrder: "ad",
});
const columns2 = reactive([
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left",
    sortable: true,
  },
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
  },
  {
    name: "membership",
    label: "Membership",
    field: "membership",
    align: "left",
  },

  {
    name: "amount",
    label: "Amount",
    field: "amount",
    align: "left",
    sortable: true,
  },

  {
    name: "qty",
    label: "Qty",
    field: "qty",
    align: "left",
    sortable: true,
  },

  {
    name: "discount",
    label: "Discount",
    field: "discount",
    align: "left",
    sortable: true,
  },
  {
    name: "payment",
    label: "Payment",
    field: "payment",
    align: "left",
    sortable: true,
  },
  {
    name: "cash",
    label: "Cash Entered",
    field: "cash",
    align: "left",
    sortable: true,
  },
  {
    name: "change",
    label: "Change",
    field: "change",
    align: "left",
    sortable: true,
  },
]);
const myChart = ref(null);
onMounted(() => {
  mainStore.loc = "Main-Dashboard";
  // userStore.getUserDetails();
  // userStore.onChangeName("Dashboard");

  setTimeout(() => {
    if (userStore.userDetails.roles[0] === "owner") {
      getDashboardForAdmin();
    } else if (
      userStore.userDetails.roles[0] === "cashier" ||
      userStore.userDetails.roles[0] === "manager"
    ) {
      getDashboardForCashierManager();
    }
  }, 500);

  // var options = {
  //   chart: {
  //     type: "line",
  //   },
  //   series: [
  //     {
  //       name: "sales",
  //       data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
  //     },
  //   ],
  //   xaxis: {
  //     categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
  //   },
  // };
  // var chartOrigin = document.querySelector("#chart");
  // if (chartOrigin) {
  //   var chart = new ApexCharts(myChart.value, options);
  //   chart.render();
  // }
});
</script>
