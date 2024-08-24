<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> View Coop </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-table
        flat
        :pagination="pagination"
        class="q-pa-sm"
        :rows="coopStore.rowDatas"
        :columns="columns"
        row-key="id"
        :separator="$q.screen.gt.xs ? 'horizontal' : 'none'"
        :visible-columns="
          $q.screen.gt.xs ? ['name', 'action'] : ['name', 'action']
        "
      >
        <template #body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              {{ props.row.id }}
            </q-td>

            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="amount" :props="props"> P{{ props.row.amount }} </q-td>

            <q-td key="action" :props="props">
              <q-btn
                color="primary"
                icon="visibility"
                size="sm"
                @click="viewDialog(props.row.id)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useBenefitsData } from "src/stores/branch/benefitStore";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
// import EditBenefit from "./EditBenefit.vue";
import { useCoopData } from "src/stores/branch/coopStore";

const coopStore = useCoopData();

const route = useRoute();

const benefitStore = useBenefitsData();

const $q = useQuasar();

const showViewDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const coop_id = ref(null);

const cantEditFunc = () => {
  $q.notify({
    type: "negative",
    message: "Can't edit this section!",
    icon: "error",
    position: "top",
  });
};

const viewDialog = (id) => {
  coop_id.value = "";
  showViewDialog.value = true;
  coop_id.value = id;
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
