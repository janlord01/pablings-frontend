<template>
  <q-table
    :pagination="pagination"
    flat
    :grid="!$q.screen.gt.xs"
    :rows="discountStore.rowDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['id', 'description', 'type', 'number', 'action']
        : ['id', 'description', 'type', 'number', 'action']
    "
  >
    <template v-slot:item="props" v-if="!$q.screen.gt.xs">
      <q-card class="my-card row q-mb-md q-mr-sm" style="width: 47%">
        <q-card-section>
          <div style="font-size: 12px; font-weight: bold">
            {{ props.row.description }}
          </div>
          <div style="font-size: 10px">Type:{{ props.row.type }}</div>
          <div style="font-size: 10px">
            Number: {{ props.row.type == "Amount" ? "P" : "" }}
            {{ props.row.number }}
            {{ props.row.type == "Amount" ? "" : "%" }}
          </div>
        </q-card-section>

        <q-card-actions class="q-pt-none">
          <q-btn
            color="blue"
            icon="edit"
            size="sm"
            @click="EditDialog(props.row.id)"
          />
          <q-btn
            color="grey"
            disable
            @click="cantEditFunc()"
            icon="delete"
            size="sm"
          />
        </q-card-actions>
      </q-card>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>

        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>
        <q-td key="type" :props="props">
          {{ props.row.type }}
        </q-td>
        <q-td key="number" :props="props">
          {{ props.row.type == "Amount" ? "P" : "" }}
          {{ props.row.number }}
          {{ props.row.type == "Amount" ? "" : "%" }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="blue"
            icon="edit"
            size="sm"
            @click="EditDialog(props.row.id)"
            v-if="props.row.description != 'Nehemiah Privileges'"
          />
          <q-btn
            color="grey"
            @click="cantEditFunc()"
            icon="edit"
            size="sm"
            v-else
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
      :discount-id="discount_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Capture Image -->

  <!-- Edit Member -->
</template>

<script setup>
import { api } from "src/boot/axios";
import { useDiscountData } from "stores/branch/discountStore";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import EditProducts from "./EditDiscount.vue";

const route = useRoute();

const discountStore = useDiscountData();

const $q = useQuasar();

const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const discount_id = ref(null);

const cantEditFunc = () => {
  $q.notify({
    type: "negative",
    message: "Can't edit this section!",
    icon: "error",
    position: "top",
  });
};

const EditDialog = (id) => {
  discount_id.value = "";
  showEditDialog.value = true;
  discount_id.value = id;
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
    classes: "bg-grey-4",
  },

  {
    name: "description",
    label: "Description",
    field: "description",
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
    name: "number",
    label: "Number/Percentage",
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
