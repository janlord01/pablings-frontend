<template>
  <q-markup-table v-if="supplierStore.skeleton">
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
  </q-markup-table>
  <q-table
    v-else
    :pagination="pagination"
    class="q-pa-sm"
    :rows="supplierStore.rowDatas"
    :columns="columns"
    flat
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['name', 'location', 'number', 'action']
        : ['name', 'location', 'number', 'action']
    "
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="name" :props="props">
          {{ props.row.supplier_name }}
        </q-td>
        <q-td key="location" :props="props">
          {{ props.row.supplier_location }}
        </q-td>

        <q-td key="number" :props="props">
          {{ props.row.supplier_number }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="blue"
            icon="edit"
            label="edit"
            size="sm"
            @click="EditDialog(props.row.id)"
          />
          <q-btn
            color="red"
            icon="delete"
            label="delete"
            size="sm"
            @click="DeleteDialog(props.row.id)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- Edit Product -->
  <q-dialog v-model="showEditDialog">
    <EditSupplier
      :supplier-id="supplier_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useSupplierData } from "stores/supplier/supplierStore";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import EditSupplier from "./EditSupplier.vue";

const route = useRoute();

const supplierStore = useSupplierData();

const $q = useQuasar();

const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const supplier_id = ref(null);

const DeleteDialog = (id) => {
  const newToken = LocalStorage.getItem("jwt");
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this? All data will be deleted.",
    ok: {
      push: true,
      label: "Delete",
      color: "negative",
    },
    cancel: {
      push: true,
      color: "grey",
    },
    persistent: true,
  })
    .onOk(() => {
      $q.loading.show();
      api
        .delete(`/api/${route.params.slug}/supplier/${id}`, {
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

                supplierStore.getAllSupplier(route.params.slug);
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
  supplier_id.value = "";
  showEditDialog.value = true;
  supplier_id.value = id;
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
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "location",
    label: "Location",
    field: "location",
    align: "left",
    sortable: true,
  },
  {
    name: "number",
    label: "Phone Number",
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
  //   supplierStore.getAllSupplier();
  //   supplyStore.getAllProducts();
});
</script>

<style></style>
