<template>
  <q-table
    :pagination="pagination"
    class="q-pa-sm"
    :rows="supplyStore.rowDatas"
    :columns="columns"
    flat
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['name', 'description', 'action']
        : ['name', 'description', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props" v-if="props.row.type == 'Supply'">
        <q-td key="id" :props="props">
          {{ props.row.sku }}
        </q-td>

        <q-td key="name" :props="props">
          <q-avatar>
            <q-img
              :src="props.row.product_img"
              v-if="props.row.product_img"
              width="50px"
            />
            <q-avatar
              v-else
              color="grey"
              text-color="white"
              icon="image_not_supported"
            >
              <!-- <img src="https://cdn.quasar.dev/img/avatar.png" /> -->
            </q-avatar>
          </q-avatar>
          {{ props.row.title }}
        </q-td>
        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>

        <q-td key="msrp" :props="props">
          {{ props.row.msrp }}
        </q-td>

        <!-- <q-td key="srp" :props="props">
          {{ props.row.price }}
        </q-td> -->

        <q-td key="action" :props="props">
          <q-btn
            color="blue"
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
    <EditSupply
      :product-id="product_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Capture Image -->

  <!-- Edit Member -->
</template>

<script setup>
import { api } from "src/boot/axios";
import { useSupplyData } from "stores/supplies/supplyStore";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import EditSupply from "./EditSupply.vue";

const route = useRoute();

const supplyStore = useSupplyData();

const $q = useQuasar();

const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const product_id = ref(null);

const EditDialog = (id) => {
  product_id.value = "";
  showEditDialog.value = true;
  product_id.value = id;
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
    label: "SKU",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "name",
    label: "Product Name",
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
    name: "msrp",
    label: "MSRP",
    field: "msrp",
    align: "left",
    sortable: true,
  },
  {
    name: "srp",
    label: "SRP",
    field: "srp",
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
  //   supplyStore.getAllProducts();
});
</script>

<style></style>
