<template>
  <q-table
    flat
    :pagination="pagination"
    class="q-pa-sm"
    :class="$q.dark.isActive ? 'text-white bg-blue-grey-10' : 'text-dark'"
    :rows="companyStore.rowDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['company', 'number', 'action']
        : ['company', 'number', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="company" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="number" :props="props">
          {{ props.row.contact }}
        </q-td>
        <q-td key="action" :props="props">
          <q-btn
            color="blue"
            icon="edit"
            label="edit"
            size="sm"
            @click="EditCompanyDialog(props.row.id)"
          />
          <q-btn
            color="green"
            icon="group"
            label="owner(s)"
            size="sm"
            :to="`/company/${props.row.slug}/owner`"
          />
          <q-btn
            color="purple"
            icon="store"
            label="branches"
            size="sm"
            :to="`${props.row.slug}/branches`"
          />
          <q-btn
            color="orange"
            icon="inventory"
            label="Inventory"
            size="sm"
            :to="`${props.row.slug}/branches`"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <q-dialog v-model="showEditDialog">
    <EditCompany
      :company-id="company_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>
</template>

<script setup>
import { api } from "src/boot/axios";
import { usePlanData } from "src/stores/membership/storePlans";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useCompanyData } from "stores/company/store";
import EditCompany from "./editCompany.vue";

const companyStore = useCompanyData();
// import snapPicture from "./snapPicture.vue";

const $q = useQuasar();

const imgTest = ref(null);

const planStore = usePlanData();
const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const company_id = ref(null);
const EditPlanDialog = (id) => {
  company_id.value = "";
  showEditDialog.value = true;
  company_id.value = id;
};
const EditCompanyDialog = (id) => {
  company_id.value = "";
  showEditDialog.value = true;
  company_id.value = id;
};

const cantEditFunc = () => {
  $q.notify({
    type: "negative",
    message: "Can't edit this section!",
    icon: "error",
    position: "top",
  });
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
    classes: $q.dark.isActive ? "text-white bg-grey-10" : "text-dark bg-grey-4",
  },
  {
    name: "company",
    label: "Company Name",
    field: "company",
    align: "left",
    sortable: true,
  },

  {
    name: "number",
    label: "Contact Number",
    field: "number",
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
  planStore.getAllPlans();
});
</script>

<style></style>
