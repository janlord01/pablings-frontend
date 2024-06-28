<template>
  <q-table
    grid
    :pagination="pagination"
    class="q-pa-sm"
    :rows="servicesStore.rowServiceDatas"
    :columns="columns"
    flat
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['name', 'description', 'price', 'time', 'action']
        : ['name', 'action']
    "
  >
    <template v-slot:item="props">
      <q-card
        class="my-card row q-mb-md q-mr-sm"
        style="width: 47%; max-width: 300px"
        v-if="props.row.service_name != 'FOR DELETE'"
      >
        <!-- <img src="https://cdn.quasar.dev/img/mountains.jpg" /> -->
        <q-img :src="props.row.image" v-if="props.row.image" />
        <q-avatar
          v-else
          color="grey"
          text-color="white"
          icon="image_not_supported"
        >
          <!-- <img src="https://cdn.quasar.dev/img/avatar.png" /> -->
        </q-avatar>
        <q-card-section>
          <div style="font-size: 12px">
            <span class="text-bold">Name: </span><br />{{
              props.row.service_name
            }}
          </div>
          <div style="font-size: 10px">
            <span class="text-bold">Description:</span> <br />
            {{ props.row.service_descr }}
          </div>
          <div style="font-size: 10px">
            <span class="text-bold">Price:</span> <br />
            {{ props.row.service_price }}
          </div>
          <div style="font-size: 10px">
            <span class="text-bold">Duration:</span> <br />
            {{ props.row.time_duration }}
          </div>
        </q-card-section>
        <q-card-actions class="q-pt-none full-width">
          <q-btn
            color="blue"
            icon="edit"
            label="edit"
            size="sm"
            @click="EditDialog(props.row.id)"
          />
          <!-- <q-btn
            v-if="props.row.status == 1"
            color="negative"
            label="Deactivate"
            icon="do_not_disturb"
            size="sm"
            @click="changeStatus(props.row.id, props.row.status)"
          />
          <q-btn
            v-else
            color="green"
            label="Activate"
            icon="check_circle"
            size="sm"
            @click="changeStatus(props.row.id, props.row.status)"
          /> -->
        </q-card-actions>
      </q-card>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>

        <q-td key="name" :props="props">
          <q-avatar>
            <q-img :src="props.row.image" v-if="props.row.image" width="50px" />
            <q-avatar
              v-else
              color="grey"
              text-color="white"
              icon="image_not_supported"
            >
              <!-- <img src="https://cdn.quasar.dev/img/avatar.png" /> -->
            </q-avatar>
          </q-avatar>
          {{ props.row.service_name }}
        </q-td>
        <q-td key="description" :props="props" style="width: 500px">
          <span class="read" v-if="!readActivated" @click="activateReadMore"
            ><span v-if="props.row.service_descr.length >= 80"
              >{{ props.row.service_descr.slice(0, 80) }}
              <q-btn
                flat
                style="text-transform: lowercase; font-weight: normal"
                @click="readActivated = true"
                >..read more</q-btn
              ></span
            ><span v-else>
              {{ props.row.service_descr }}
            </span>
          </span>
          <span v-else>
            {{ props.row.service_descr }}
            <q-btn
              v-if="props.row.service_descr.length >= 80"
              flat
              style="text-transform: lowercase; font-weight: normal"
              @click="readActivated = false"
              >..show less</q-btn
            >
          </span>
        </q-td>
        <q-td key="price" :props="props">
          P{{ props.row.service_price }}
          <!-- P{{ props.row.sale == true ? '<span class"text-strike">'+props.row.price+'</span>'+props.row.sale_price : props.row.price }} -->
        </q-td>
        <q-td key="time" :props="props">
          {{ props.row.time_duration }}
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
            v-if="props.row.status == 1"
            color="negative"
            label="Deactivate"
            icon="do_not_disturb"
            size="sm"
            @click="changeStatus(props.row.id, props.row.status)"
          />
          <q-btn
            v-else
            color="green"
            label="Activate"
            icon="check_circle"
            size="sm"
            @click="changeStatus(props.row.id, props.row.status)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- Edit Product -->
  <q-dialog v-model="showEditDialog">
    <EditService
      :service-id="service_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useProductDatas } from "src/stores/branch/productStores";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { useServicesData } from "stores/branch/servicesStore";

import EditService from "./EditService.vue";

const route = useRoute();

const servicesStore = useServicesData();

const $q = useQuasar();
const readActivated = ref(false);
const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const service_id = ref(null);

const EditDialog = (id) => {
  service_id.value = "";
  showEditDialog.value = true;
  service_id.value = id;
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

const changeStatus = (id, status) => {
  // console.log(id);
  const newToken = LocalStorage.getItem("jwt");

  $q.dialog({
    title: "Confirm",
    message: `Are you sure you want to ${
      status == 1 ? "deactivate" : "activate"
    } this service?`,
    cancel: {
      color: "grey",
    },
    ok: {
      color: status == 1 ? "red" : "green",
      label: status == 1 ? "Yes, Deactivate" : "Yes, Activate",
    },
    persistent: true,
  })
    .onOk(() => {
      $q.loading.show();
      // console.log('>>>> OK')
      api
        .patch(`/api/services/status/change/${id}`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.status === 200) {
            setTimeout(() => {
              $q.notify({
                type: "positive",
                position: "top",
                timeout: 3000,
                message: response.data.message,
              });
              $q.loading.hide();

              servicesStore.getAllServices(route.params.slug);
            }, 1000);
          } else {
            setTimeout(() => {
              $q.notify({
                type: "negative",
                position: "top",
                timeout: 3000,
                message: response.data.message,
              });

              $q.loading.hide();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    });
};

const pagination = reactive({
  sortBy: "id",
  rowsPerPage: 0,
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
    name: "name",
    label: "Service Name",
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
    name: "time",
    label: "Time Duration",
    field: "time",
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
  // productStore.getAllProducts(route.params.id);
});
</script>

<style></style>
src/stores/branch/productStores
