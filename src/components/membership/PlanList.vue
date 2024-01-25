<template>
  <q-table
    flat
    :pagination="pagination"
    class="q-pa-sm"
    :class="$q.dark.isActive ? 'text-white bg-blue-grey-10' : 'text-dark'"
    :rows="planStore.rowDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['name', 'description', 'price', 'type', 'action']
        : ['name', 'description', 'price', 'type', 'action']
    "
  >
    <template #body="props">
      <q-tr
        :props="props"
        :class="props.row.name == 'Nehemiah Privileges' ? 'bg-grey-5' : ''"
      >
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>

        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>
        <q-td key="price" :props="props">
          {{ props.row.price }}
        </q-td>
        <q-td key="type" :props="props">
          {{ props.row.days }}
        </q-td>
        <q-td key="action" :props="props">
          <q-btn
            color="blue"
            icon="edit"
            size="sm"
            @click="EditPlanDialog(props.row.id)"
            v-if="props.row.name != 'Nehemiah Privileges'"
          />
          <q-btn
            color="grey-7"
            @click="cantEditFunc()"
            icon="edit"
            size="sm"
            v-else
          />
          <!-- <q-btn
            color="orange"
            icon="camera_alt"
            size="sm"
            :to="'/user/members/' + props.row.id + '/update-photo'"
          />
          <q-btn
            color="grey"
            icon="password"
            size="sm"
            @click="passwordDialog(props.row.id)"
          /> -->
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- Edit Member -->
  <q-dialog v-model="showEditDialog">
    <EditPlan
      :plan-id="plan_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Edit Member -->
</template>

<script setup>
import { api } from "src/boot/axios";
import { usePlanData } from "src/stores/membership/storePlans";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import EditPlan from "./EditPlan.vue";
// import snapPicture from "./snapPicture.vue";

const $q = useQuasar();

const imgTest = ref(null);

const planStore = usePlanData();
const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const plan_id = ref(null);
const EditPlanDialog = (id) => {
  plan_id.value = "";
  showEditDialog.value = true;
  plan_id.value = id;
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
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left",
    sortable: true,
  },
  {
    name: "price",
    label: "Price",
    field: "price",
    align: "left",
    sortable: true,
  },

  {
    name: "type",
    label: "Type",
    field: "type",
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
