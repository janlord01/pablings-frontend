<template>
  <q-table
    flat
    :pagination="pagination"
    class="q-pa-sm"
    :rows="payrollStore.mainDatas"
    :columns="columns"
    row-key="id"
    :loading="payrollStore.mainLoading"
    :separator="$q.screen.gt.xs ? 'horizontal' : 'none'"
    :visible-columns="
      $q.screen.gt.xs ? ['staff', 'status'] : ['staff', 'status']
    "
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary"> </q-inner-loading>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td key="staff" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="status" :props="props">
          {{ props.row.payroll_status }}
        </q-td>

        <q-td key="action" :props="props"> </q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- Edit Product -->
  <!-- <q-dialog v-model="showEditDialog">
    <EditLoan
      :loan-id="loan_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog> -->

  <!-- Capture Image -->

  <!-- Edit Member -->
</template>

<script setup>
import { api } from "src/boot/axios";
import { useLoanData } from "src/stores/branch/loanStore";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
// import EditLoan from "./EditLoan.vue";

import { usePayrollData } from "src/stores/branch/payrollStore";
const route = useRoute();

const loanStore = useLoanData();

const $q = useQuasar();

const payrollStore = usePayrollData();
const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const loan_id = ref(null);

const cantEditFunc = () => {
  $q.notify({
    type: "negative",
    message: "Can't edit this section!",
    icon: "error",
    position: "top",
  });
};

const EditDialog = (id) => {
  loan_id.value = "";
  showEditDialog.value = true;
  loan_id.value = id;
};
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
    classes: "bg-grey-4",
  },

  {
    name: "staff",
    label: "Staff",
    field: "staff",
    align: "left",
    sortable: true,
  },

  {
    name: "loan",
    label: "Loan",
    field: "loan",
    align: "left",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    field: "status",
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
onMounted(() => {
  //   branchData.getAllStaff();
  // discountStore.getAllDiscounts(route.params.id);
});
</script>

<style></style>
