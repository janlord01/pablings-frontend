<template>
  <div class="row" v-if="payrollStore.userName">
    <div class="col full-width">
      <q-chip class="text-h4"
        >Gross Salary: {{ payrollStore.grossSalary }}</q-chip
      >
      <q-chip class="text-h4"
        >Total Deduction: {{ payrollStore.totalExpenses }}</q-chip
      >
      <q-separator class="q-mt-md q-mb-md" />
      <q-chip color="primary" class="text-white text-h4"
        >Net Salary: {{ payrollStore.netSalary }}</q-chip
      >
    </div>
  </div>
  <div class="row q-mt-lg" v-if="payrollStore.userName">
    <q-btn
      color="positive"
      icon="save"
      label="Submit"
      :size="$q.screen.gt.sm ? 'lg' : 'md'"
      @click="onSubmit"
    />
  </div>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useBranchData } from "stores/branch/store";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useUserData } from "stores/users/store";
import { useRoute, useRouter } from "vue-router";

import { usePayrollData } from "src/stores/branch/payrollStore";
// import { route } from "quasar/wrappers";
const payrollStore = usePayrollData();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const pagination = reactive({
  sortBy: "id",
  rowsPerPage: 10,
});
const columns = reactive([
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-10",
  },
  {
    name: "transaction",
    label: "Transaction",
    field: "transaction",
    align: "left",
    sortable: true,
  },

  {
    name: "item",
    label: "Item",
    field: "item",
    align: "left",
  },
  {
    name: "commission",
    label: "Commission",
    field: "commission",
    align: "left",
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
]);

const onSubmit = () => {
  console.log("salaries: " + payrollStore.commissionData);
  console.log("expenses: " + payrollStore.ExpensesData);
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  // let product = Object.entries(productStore.tempCashierProductDatas).map(item => {

  // });
  // console.log(product);
  // console.log("proceed");
  api
    .post(
      "/api/payroll",
      {
        salaries: payrollStore.commissionData,
        expenses: payrollStore.ExpensesData,
        user: payrollStore.user.value,
        branch: route.params.id,
      },
      {
        headers: {
          Authorization: "Bearer " + newToken,
        },
      }
    )
    .then((response) => {
      console.log(response);
      // $q.loading.hide();

      if (response.data.status == 200) {
        setTimeout(() => {
          $q.loading.hide();
          $q.notify({
            type: "positive",
            icon: "save",
            timeout: 1000,
            position: "bottom",
            message: response.data.message,
          });
          $q.loading.hide();
          // productStore.resetItem();
          // productStore.getAllPayments(route.params.id);

          // emit("hideCheckoutDialog");
          payrollStore.clearData();
          router.push({ name: "branch-payroll-index" });
        }, 2000);
      } else {
        setTimeout(() => {
          $q.loading.hide();
          $q.notify({
            type: "negative",
            icon: "error",
            timeout: 3000,
            position: "bottom",
            message: response.data.message,
          });
        }, 2000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
onMounted(() => {
  //   branchData.getAllStaff();
});
</script>

<style></style>
