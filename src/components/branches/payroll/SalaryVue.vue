<template>
  <q-table
    v-if="payrollStore.userName"
    flat
    :pagination="pagination"
    :class="$q.dark.isActive ? 'text-white bg-primary-10' : 'text-dark'"
    :rows="payrollStore.commissionData"
    :columns="columns"
    :loading="payrollStore.loadingCommission"
    title="Commissions/Salary/Bonus"
    row-key="id"
    separator="horizontal"
    :visible-columns="
      $q.screen.gt.xs
        ? ['transaction', 'item', 'commission', 'action']
        : ['transaction', 'item', 'commission', 'action']
    "
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" label="Please Wait...." />
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="transaction" :props="props">
          {{ props.row.type }}
        </q-td>

        <q-td key="item" :props="props">
          {{ props.row.title }}
        </q-td>
        <q-td key="commission" :props="props">
          {{ props.row.amount }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            label="remove"
            color="negative"
            icon="delete"
            size="sm"
            @click="payrollStore.removeItem([props.row.uid, 'income'])"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
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
  rowsPerPage: 0,
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
    label: "Type",
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
    label: "Amount",
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
