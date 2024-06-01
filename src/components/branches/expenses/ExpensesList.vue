<template>
  <q-table
    flat
    :pagination="pagination"
    class="q-pa-sm"
    :rows="expenseStore.rowDatas"
    :columns="columns"
    row-key="id"
    :separator="$q.screen.gt.xs ? 'horizontal' : 'none'"
    :visible-columns="
      $q.screen.gt.xs
        ? ['id', 'staff', 'expenses', 'amount', 'action']
        : ['id', 'staff', 'expenses', 'amount', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>

        <q-td key="staff" :props="props">
          {{ props.row.userName }}
        </q-td>
        <q-td key="expenses" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="amount" :props="props"> P{{ props.row.amount }} </q-td>

        <q-td key="action" :props="props">
          <q-btn
            :disable="props.row.expense_status !== 'pending'"
            :color="
              props.row.expense_status !== 'pending' ? 'grey-6' : 'primary'
            "
            icon="edit"
            size="sm"
            @click="EditDialog(props.row.id)"
          />

          <!-- <q-btn
            color="green"
            icon="bar_chart"
            size="sm"
            :to="'/user/members/' + props.row.id + '/update-photo'"
          />

          <q-btn
            color="orange"
            icon="fastfood"
            size="sm"
            :to="'/branches/' + props.row.id + '/products'"
          />
          <q-btn
            color="secondary"
            icon="shopping_cart"
            size="sm"
            @click="passwordDialog(props.row.id)"
          />

          <q-btn
            color="info"
            icon="monitor"
            size="sm"
            @click="passwordDialog(props.row.id)"
          /> -->
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- Edit Product -->
  <q-dialog v-model="showEditDialog">
    <EditProducts
      :expenses-id="expenses_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Capture Image -->

  <!-- Edit Member -->
</template>

<script setup>
import { api } from "src/boot/axios";
import { useExpensesData } from "stores/branch/expensesStore";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import EditProducts from "./EditExpenses.vue";

const route = useRoute();

const expenseStore = useExpensesData();

const $q = useQuasar();

const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const expenses_id = ref(null);

const cantEditFunc = () => {
  $q.notify({
    type: "negative",
    message: "Can't edit this section!",
    icon: "error",
    position: "top",
  });
};

const EditDialog = (id) => {
  expenses_id.value = "";
  showEditDialog.value = true;
  expenses_id.value = id;
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
    name: "expenses",
    label: "Expenses",
    field: "expenses",
    align: "left",
    sortable: true,
  },
  {
    name: "amount",
    label: "Amount",
    field: "amount",
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
