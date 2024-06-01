<template>
  <div class="row" v-if="payrollStore.userName">
    <div>
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
</template>

<script setup>
import { api } from "src/boot/axios";
import { useBranchData } from "stores/branch/store";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useUserData } from "stores/users/store";
import { useRoute } from "vue-router";

import { usePayrollData } from "src/stores/branch/payrollStore";
const payrollStore = usePayrollData();

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
onMounted(() => {
  //   branchData.getAllStaff();
});
</script>

<style></style>
