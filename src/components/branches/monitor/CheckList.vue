<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="monitorStore.rowDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['id', 'name', 'time_in', 'time_out']
        : ['id', 'name', 'time_in', 'time_out']
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
        <q-td key="time_in" :props="props">
          {{
            moment(props.row.time_in).format("dddd, MMMM Do YYYY, h:mm:ss a")
          }}
          <!-- {{ props.row.time_in }} -->
        </q-td>
        <q-td key="time_out" :props="props">
          {{
            props.row.time_out != null
              ? moment(props.row.time_out).format(
                  "dddd, MMMM Do YYYY, h:mm:ss a"
                )
              : ""
          }}
        </q-td>
      </q-tr>
    </template>
  </q-table>

  <!-- Capture Image -->

  <!-- Edit Member -->
</template>

<script setup>
import { api } from "src/boot/axios";
import { useMonitorData } from "src/stores/branch/monitorStore";

import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import moment from "moment";

const route = useRoute();
const monitorStore = useMonitorData();

const $q = useQuasar();

const showViewDialog = ref(false);
const payment_id = ref(null);

const viewItem = (id) => {
  payment_id.value = "";
  showViewDialog.value = true;
  payment_id.value = id;
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
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "time_in",
    label: "Time In",
    field: "time_in",
    align: "left",
    sortable: true,
  },
  {
    name: "time_out",
    label: "Time Out",
    field: "time_out",
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
});
</script>

<style></style>
