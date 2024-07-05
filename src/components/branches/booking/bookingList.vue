<template>
  <q-table
    :pagination="pagination"
    :rows="cashierStore.paymentRowDatas"
    :columns="columns"
    flat
    row-key="id"
    separator="none"
    :visible-columns="[
      'name',
      'service',
      'amount',
      'date',
      'time',
      'status',
      'action',
    ]"
  >
    <!-- <template v-slot:item="props" v-if="!$q.screen.gt.xs">
      <q-card
        class="my-card row q-mb-md q-mr-sm"
        style="width: 47%"
        :class="props.row.mop === 'gcash' ? 'bg-blue-4 text-white' : ''"
      >
        <q-card-section class="full-width">
          <div style="font-size: 12px">
            <span class="text-bold">Date</span> <br />
            {{ date.formatDate(props.row.created_at, "MMMM DD, YYYY H:mm A") }}
            <span class="text-bold">
              <br />{{
                props.row.name != null
                  ? props.row.name
                  : props.row.guest != null
                  ? props.row.guest
                  : "Guest"
              }}</span
            >
          </div>
          <div style="font-size: 10px">
            <span class="text-bold">Total</span> <br />P{{ props.row.total }}
            <br />
            <span class="text-bold">Remarks</span> <br />{{
              props.row.description
            }}
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn
            label="void"
            color="red"
            icon="delete"
            size="xs"
            class="full-width q-mb-xs"
            dense
            @click="VoidDialog(props.row.id)"
          />
          <q-btn
            label="print"
            color="purple"
            dense
            icon="print"
            class="full-width q-mb-xs"
            size="xs"
            @click="printDialog(props.row.id)"
          />
          <q-btn
            color="grey"
            dense
            label="More"
            class="full-width q-mb-xs"
            icon="more_vert"
            size="xs"
          >
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  @click="commissionFunc(props.row.id)"
                >
                  <q-item-section>Commission </q-item-section>
                </q-item>

                <q-separator />
              </q-list>
            </q-menu>
          </q-btn>
        </q-card-actions>
      </q-card>
    </template> -->
    <template #body="props">
      <q-tr
        :props="props"
        :class="props.row.mop === 'gcash' ? 'bg-blue-4 text-white' : ''"
      >
        <q-td key="date" :props="props">
          {{ date.formatDate(props.row.created_at, "MMMM DD, YYYY H:mm A") }}
        </q-td>

        <q-td key="name" :props="props">
          {{
            props.row.name != null
              ? props.row.name
              : props.row.guest != null
              ? props.row.guest
              : "Guest"
          }}
        </q-td>
        <q-td key="service" :props="props">
          {{ props.row.service }}
        </q-td>
        <q-td key="amout" :props="props">
          {{ props.row.amout }}
        </q-td>
        <q-td key="date" :props="props">
          {{ props.row.date }}
        </q-td>
        <q-td key="time" :props="props">
          {{ props.row.time }}
        </q-td>

        <q-td key="status" :props="props">
          {{ props.row.status }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="red"
            icon="delete"
            size="sm"
            @click="VoidDialog(props.row.id)"
          />
          <q-btn
            color="purple"
            icon="print"
            size="sm"
            @click="printDialog(props.row.id)"
          />
          <!-- <q-btn
            color="grey"
            icon="more_vert"
            size="sm"
            @click="printDialog(props.row.id)"
          /> -->

          <q-btn color="grey" icon="more_vert" size="sm">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  @click="commissionFunc(props.row.id)"
                >
                  <q-item-section>Commission </q-item-section>
                </q-item>

                <q-separator />

                <!-- <q-item clickable v-close-popup>
                  <q-item-section>Print</q-item-section>
                </q-item> -->
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useProductDatas } from "src/stores/branch/productStores";
import { LocalStorage, date } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
// import viewItemPaid from "./viewItem.vue";
import { useCashierData } from "src/stores/branch/cashierStore";
// import SelectAdminTovoid from "./selectAdminTovoid.vue";
// import printReceiptOutside from "./printReceiptOutside.vue";
// import commissionDialog from "./CommissionDialog.vue";
const showSelectDialog = ref(false);
const showPrintDialog = ref(false);
const showCommissionDialog = ref(false);

const cashierStore = useCashierData();
const route = useRoute();

const productStore = useProductDatas();
const newToken = ref(LocalStorage.getItem("jwt"));
const $q = useQuasar();

const showViewDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const payment_id = ref(null);

const printDialog = (id) => {
  payment_id.value = id;
  showPrintDialog.value = true;
};
const commissionFunc = (id) => {
  payment_id.value = id;
  showCommissionDialog.value = true;
};
const VoidDialog = (id) => {
  payment_id.value = id;
  showSelectDialog.value = true;
  // $q.dialog({
  //   title: "Confirm",
  //   message: "Please Enter the owner`s password or manager password.",
  //   prompt: {
  //     model: "",
  //     type: "select", // optional
  //   },
  //   cancel: {
  //     color: "grey",
  //   },
  //   ok: {
  //     color: "red",
  //     label: "Void",
  //   },
  //   persistent: true,
  // })
  //   .onOk((data) => {
  //     api
  //       .delete(`/api/branch/cashier/void/${id}`, {
  //         headers: {
  //           Authorization: "Bearer " + newToken.value,
  //         },
  //       })
  //       .then((response) => {
  //         console.log(response);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   })
  //   .onCancel(() => {
  //     // console.log('>>>> Cancel')
  //   })
  //   .onDismiss(() => {
  //     // console.log('I am triggered on both OK and Cancel')
  //   });
};

const viewItem = (id) => {
  payment_id.value = "";
  showViewDialog.value = true;
  payment_id.value = id;
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
  sortBy: "created_at",
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
    label: "Client Name",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "service",
    label: "Service",
    field: "service",
    align: "left",
    sortable: true,
  },

  {
    name: "amount",
    label: "amount",
    field: "amount",
    align: "left",
    sortable: true,
  },
  {
    name: "date",
    label: "Date",
    field: "date",
    align: "left",
    sortable: true,
  },
  {
    name: "time",
    label: "Time",
    field: "time",
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
  //   branchData.getAllStaff();
  // productStore.getAllPayments(route.params.id);
});
</script>

<style></style>
<!-- src/stores/branch/productStores -->
