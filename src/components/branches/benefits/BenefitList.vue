<template>
  <q-table
    flat
    :pagination="pagination"
    class="q-pa-sm"
    :rows="benefitStore.rowDatas"
    :columns="columns"
    row-key="id"
    :separator="$q.screen.gt.xs ? 'horizontal' : 'none'"
    :visible-columns="
      $q.screen.gt.xs
        ? ['id', 'name', 'amount', 'action']
        : ['id', 'name', 'amount', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>

        <q-td key="name" :props="props">
          {{ props.row.benefit_name }}
        </q-td>
        <q-td key="amount" :props="props"> P{{ props.row.amount }} </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="primary"
            icon="edit"
            size="sm"
            @click="EditDialog(props.row.id)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- Edit Benefit -->
  <q-dialog v-model="showEditDialog">
    <EditBenefit
      :benefit-id="benefit_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Capture Image -->

  <!-- Edit Member -->
</template>

<script setup>
import { api } from "src/boot/axios";
import { useBenefitsData } from "src/stores/branch/benefitStore";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import EditBenefit from "./EditBenefit.vue";

const route = useRoute();

const benefitStore = useBenefitsData();

const $q = useQuasar();

const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const benefit_id = ref(null);

const cantEditFunc = () => {
  $q.notify({
    type: "negative",
    message: "Can't edit this section!",
    icon: "error",
    position: "top",
  });
};

const EditDialog = (id) => {
  benefit_id.value = "";
  showEditDialog.value = true;
  benefit_id.value = id;
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
    name: "name",
    label: "Name",
    field: "name",
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
