<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="productStore.paymentRowDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? [
            'id',
            'name',
            'branches',
            'users',
            'total',
            'cash',
            'change',
            'action',
          ]
        : [
            'id',
            'name',
            'branches',
            'users',
            'total',
            'cash',
            'change',
            'action',
          ]
    "
  >
    <template #body="props">
      <q-tr
        :props="props"
        :class="props.row.guest == null ? 'bg-green-2' : 'bg-grey-4'"
      >
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>

        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="branches" :props="props">
          {{ props.row.branches }}
        </q-td>
        <q-td key="users" :props="props">
          {{ props.row.users }}
        </q-td>
        <q-td key="item" :props="props">
          <!-- {{ props.row.description }} -->
          <q-btn
            color="blue"
            icon="visibility"
            size="sm"
            @click="viewItem(props.row.id)"
          />
        </q-td>
        <q-td key="total" :props="props">
          {{ props.row.total }}
        </q-td>
        <q-td key="cash" :props="props">
          {{ props.row.cash }}
        </q-td>

        <q-td key="change" :props="props">
          {{ props.row.change }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="red"
            icon="delete"
            size="sm"
            @click="EditDialog(props.row.id)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- Edit Product -->
  <!-- <q-dialog v-model="showViewDialog">
    <viewItemPaid
      :payment-id="payment_id"
      @hide-view-dialog="showViewDialog = !showViewDialog"
    />
  </q-dialog> -->

  <!-- Capture Image -->

  <!-- Edit Member -->
</template>

<script setup>
import { api } from "src/boot/axios";
import { useProductDatas } from "src/stores/branch/productStores";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
// import viewItemPaid from "./viewItem.vue";

const route = useRoute();

const productStore = useProductDatas();

const $q = useQuasar();

const showViewDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const payment_id = ref(null);

const viewItem = (id) => {
  payment_id.value = "";
  showViewDialog.value = true;
  payment_id.value = id;
};

const passwordDialog = (id) => {
  branch_id.value = "";
  showPasswordDialog.value = true;
  branch_id.value = id;
};
const capturedImg = (id) => {
  branch_id.value = "";
  showCaptureImg.value = true;
  branch_id.value = id;
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
  },
  {
    name: "name",
    label: "Transaction By",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "branches",
    label: "Branches",
    field: "branches",
    align: "left",
    sortable: true,
  },

  {
    name: "users",
    label: "Users",
    field: "users",
    align: "left",
    sortable: true,
  },

  {
    name: "item",
    label: "Product/Item",
    field: "item",
    align: "left",
    sortable: true,
  },
  {
    name: "total",
    label: "Total",
    field: "total",
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
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
]);
const copyText = (code) => {
  navigator.clipboard.writeText(code);
  $q.notify({
    type: "positive",
    color: "positive",
    timeout: 1000,
    position: "top",
    message: "Copy Code: " + code,
  });
};
onMounted(() => {
  //   branchData.getAllStaff();
  productStore.getAllPayments(route.params.id);
});
</script>

<style></style>
src/stores/branch/productStores
