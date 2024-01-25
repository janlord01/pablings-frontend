<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="codesStore.rowDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs ? ['code', 'action'] : ['id', 'code', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>

        <q-td key="code" :props="props">
          {{ props.row.code }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="green"
            icon="content_copy"
            size="sm"
            @click="copyText(props.row.code)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useCodeData } from "stores/membership/storeCodes";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

const codesStore = useCodeData();

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
    name: "code",
    label: "Codes",
    field: "code",
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
  codesStore.getAllCodes();
});
</script>

<style></style>
