<template>
  <!-- <q-markup-table v-if="inventoryStore.skeleton">
    <thead>
      <tr>
        <th class="text-left" style="width: 150px">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="n in 5" :key="n">
        <td class="text-left">
          <q-skeleton animation="blink" type="text" width="85px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="50px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="35px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="65px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="25px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="85px" />
        </td>
      </tr>
    </tbody>
  </q-markup-table> -->

  <q-table
    flat
    :grid="!$q.screen.gt.xs"
    :pagination="pagination"
    class="q-pa-sm"
    :rows="inventoryStore.rowDatas"
    :columns="columns"
    row-key="id"
    separator="cell"
    :loading="inventoryStore.loading"
    :visible-columns="
      $q.screen.gt.xs
        ? [
            'id',
            // 'supplier',
            'order_date',
            'order_arrived',
            'status',
            'remarks',
            'action',
          ]
        : [
            'id',
            // 'supplier',
            'order_date',
            'order_arrived',
            'status',
            'remarks',
            'action',
          ]
    "
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>
    <template v-slot:item="props" v-if="!$q.screen.gt.xs">
      <q-card class="my-card row q-mb-md q-mr-sm" style="width: 47%">
        <q-card-section>
          <div style="font-size: 12px">
            <span class="text-bold">Supplier: </span><br />{{
              props.row.supplier_name
            }}
          </div>
          <div style="font-size: 10px">
            <span class="text-bold">Order Date:</span> <br />
            {{ date.formatDate(props.row.order_date, "MMMM DD, YYYY") }}
          </div>
          <div style="font-size: 10px">
            <span class="text-bold">Order Arrived: </span><br />{{
              date.formatDate(props.row.order_arrived, "MMMM DD, YYYY")
            }}
          </div>
          <div style="font-size: 10px">
            <span class="text-bold">Remarks: </span><br />{{
              props.row.remarks
            }}
          </div>
          <div style="font-size: 10px">
            <span class="text-bold">Status: </span>
            <q-chip
              v-if="props.row.status === 'Order Placed'"
              color="blue"
              text-color="white"
              class="q-ma-none"
              style="font-size: 8px"
              size="sm"
              >{{ props.row.status }}</q-chip
            >
            <q-chip
              v-else-if="props.row.status === 'In Transit'"
              color="orange"
              text-color="white"
              class="q-ma-none"
              style="font-size: 8px"
              size="sm"
              >{{ props.row.status }}</q-chip
            >
            <q-chip
              v-else-if="props.row.status === 'Order Arrived'"
              color="green"
              size="sm"
              class="q-ma-none"
              style="font-size: 8px"
              text-color="white"
              >{{ props.row.status }}</q-chip
            >
            <q-chip
              v-else
              color="red"
              class="q-ma-none"
              style="font-size: 8px"
              size="sm"
              text-color="white"
              >{{ props.row.status }}</q-chip
            >
          </div>
        </q-card-section>
        <q-card-actions class="q-pt-none">
          <q-btn
            color="blue"
            label="view"
            style="font-size: 8px; margin: 0 3px 3px 0"
            @click="EditDialog(props.row.id)"
          />
          <q-btn
            color="red"
            label="delete"
            size="sm"
            style="font-size: 8px; margin: 0 3px 3px 0"
            @click="DeleteDialog(props.row.id)"
          />
        </q-card-actions>
      </q-card>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>

        <q-td key="supplier" :props="props">
          {{ props.row.supplier_name }}
        </q-td>
        <q-td key="order_date" :props="props">
          {{ date.formatDate(props.row.order_date, "MMMM DD, YYYY") }}
        </q-td>

        <q-td key="order_arrived" :props="props">
          {{ date.formatDate(props.row.order_arrived, "MMMM DD, YYYY") }}
        </q-td>
        <q-td key="remarks" :props="props">
          {{ props.row.remarks }}
        </q-td>

        <q-td key="status" :props="props">
          <q-chip
            v-if="props.row.status === 'Order Placed'"
            color="blue"
            text-color="white"
            >{{ props.row.status }}</q-chip
          >
          <q-chip
            v-else-if="props.row.status === 'In Transit'"
            color="orange"
            text-color="white"
            >{{ props.row.status }}</q-chip
          >
          <q-chip
            v-else-if="props.row.status === 'Order Arrived'"
            color="green"
            text-color="white"
            >{{ props.row.status }}</q-chip
          >
          <q-chip v-else color="red" text-color="white">{{
            props.row.status
          }}</q-chip>
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="blue"
            icon="visibility"
            label="view"
            size="sm"
            @click="EditDialog(props.row.id)"
          />
          <!-- <q-btn
            color="red"
            icon="delete"
            label="delete"
            size="sm"
            @click="DeleteDialog(props.row.id)"
          /> -->
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- Edit Inventory -->
  <q-dialog v-model="showEditDialog" persistent>
    <EditInventory
      :inventory-id="inventory_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useSupplierData } from "stores/supplier/supplierStore";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar, date } from "quasar";
import { useRoute } from "vue-router";
import EditInventory from "./EditInventory.vue";
import { useInventoryData } from "stores/inventories/inventoryStore.js";

const inventoryStore = useInventoryData();
// import EditSupply from "./EditSupply.vue";

const route = useRoute();

const supplierStore = useSupplierData();

const $q = useQuasar();

const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const inventory_id = ref(null);

const DeleteDialog = (id) => {
  const newToken = LocalStorage.getItem("jwt");
  $q.dialog({
    title: "Prompt",
    message:
      "Are you sure you want to delete this inventory? All the date will be removed and this action cannot be undone. Please type the word “DELETE” to proceed!",
    prompt: {
      model: "",
      isValid: (val) => val.length > 2, // << here is the magic
      type: "text", // optional
    },
    ok: {
      push: true,
      color: "negative",
      label: "Delete",
    },
    cancel: {
      push: true,
      color: "grey-6",
    },
    persistent: true,
  })
    .onOk(() => {
      $q.loading.show();
      api
        .delete(`/api/${route.params.slug}/inventory/${id}`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          if (response.data.status == 200) {
            setTimeout(
              () => {
                $q.notify({
                  type: "positive",
                  icon: "delete",
                  position: "bottom",
                  timeout: 2000,
                  message: response.data.message,
                });
                $q.loading.hide();

                inventoryStore.getAllInventories(route.params.slug);
              },

              2000
            );
          } else {
            setTimeout(() => {
              $q.notify({
                type: "negative",
                icon: "error",
                position: "top",
                timeout: 3000,
                message: response.data.message,
              });
              $q.loading.hide();
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .onCancel(() => {
      //   console.log(">>>> Cancel");
    })
    .onDismiss(() => {
      //   console.log("I am triggered on both OK and Cancel");
    });
};

const EditDialog = (id) => {
  inventory_id.value = "";
  showEditDialog.value = true;
  inventory_id.value = id;
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
    label: "id",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "product",
    label: "Product",
    field: "product",
    align: "left",
    sortable: true,
  },

  {
    name: "supplier",
    label: "Supplier",
    field: "supplier",
    align: "left",
    sortable: true,
  },
  {
    name: "order_date",
    label: "Order Date",
    field: "order_date",
    align: "left",
    sortable: true,
  },
  {
    name: "order_arrived",
    label: "Order Arrived",
    field: "order_date",
    align: "left",
    sortable: true,
  },
  {
    name: "purchase_price",
    label: "Purchase Price",
    field: "purchase_price",
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
    name: "qty",
    label: "Qty",
    field: "qty",
    align: "left",
    sortable: true,
  },
  {
    name: "mfg",
    label: "Mfg",
    field: "mfg",
    align: "left",
    sortable: true,
  },
  {
    name: "exp",
    label: "Exp",
    field: "exp",
    align: "left",
    sortable: true,
  },
  {
    name: "remarks",
    label: "Remarks",
    field: "remarks",
    align: "left",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    field: "status",
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
  //   supplierStore.getAllSupplier();
  //   supplyStore.getAllProducts();
});
</script>

<style></style>
