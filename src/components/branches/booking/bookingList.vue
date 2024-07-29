<template>
  <q-table
    :pagination="pagination"
    :rows="bookingStore.rowDatasItem"
    :columns="columns"
    flat
    :loading="bookingStore.loading"
    row-key="id"
    separator="none"
    :visible-columns="[
      'date',
      'time',
      'name',
      'number',
      'service',
      'amount',
      'status',
      'action',
    ]"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>
    <template #body="props">
      <q-tr
        :props="props"
        :class="
          props.row.status == 'confirmed'
            ? 'bg-green-2'
            : props.row.status == 'pending'
            ? 'bg-blue-2'
            : 'bg-red-2'
        "
      >
        <q-td key="date" :props="props">
          {{ date.formatDate(props.row.created_at, "MMMM DD, YYYY") }}
        </q-td>

        <q-td key="time" :props="props">
          {{ formatTime(props.row.start_hour) }}
        </q-td>

        <q-td key="name" :props="props">
          {{
            props.row.name != null ? props.row.name : props.row.guest_name
          }} </q-td
        ><q-td key="number" :props="props">
          {{ props.row.number }}
        </q-td>
        <q-td key="service" :props="props">
          {{ props.row.service_name }}
        </q-td>
        <q-td key="amount" :props="props">
          {{ props.row.price ? props.row.price : props.row.service_price }}
        </q-td>

        <q-td key="status" :props="props">
          {{ props.row.status }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="positive"
            icon="check_circle"
            size="sm"
            @click="changeStatus(props.row.id, 'confirmed')"
          />
          <q-btn
            color="negative"
            icon="cancel"
            size="sm"
            @click="changeStatus(props.row.id, 'cancelled')"
          />
          <q-btn
            color="primary"
            icon="edit"
            size="sm"
            @click="updateBookingFunc(props.row.id)"
          />
          <!-- <q-btn color="grey" icon="more_vert" size="sm">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  @click="commissionFunc(props.row.id)"
                >
                  <q-item-section>Commission</q-item-section>
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>
          </q-btn> -->
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <q-dialog v-model="showEditDialog">
    <updateBooking
      @hide-edit-dialog="showEditDialog = !showEditDialog"
      :booking-id="booking_id"
    />
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useQuasar, date, LocalStorage } from "quasar";
import { useBookingData } from "src/stores/branch/bookingStore";
import { useProductDatas } from "src/stores/branch/productStores";
import { useCashierData } from "src/stores/branch/cashierStore";
import { api } from "src/boot/axios";
import updateBooking from "components/branches/booking/UpdateBooking.vue";

const showSelectDialog = ref(false);
const showPrintDialog = ref(false);
const showCommissionDialog = ref(false);
const bookingStore = useBookingData();
const cashierStore = useCashierData();
const route = useRoute();
const productStore = useProductDatas();
const newToken = ref(LocalStorage.getItem("jwt"));
const $q = useQuasar();

const showEditDialog = ref(false);
const booking_id = ref(null);

const updateBookingFunc = (id) => {
  booking_id.value = id;
  showEditDialog.value = true;
};

const changeStatus = (id, status) => {
  $q.dialog({
    title: "Confirm",
    message:
      status == "confirmed"
        ? "Would you like to confirm this booking?"
        : "Would you like to cancel this booking?",
    cancel: {
      label: "close",
      color: "grey",
    },
    ok: {
      label: status == "confirmed" ? "Yes, Confirm" : "Yes, Cancel",
      color: status == "confirmed" ? "positive" : "negative",
    },
    persistent: true,
  })
    .onOk(() => {
      // console.log('>>>> OK')
      $q.loading.show();
      api
        .patch(
          "/api/branch/booking/change/status/" + id,
          {
            status: status,
          },
          {
            headers: {
              Authorization: "Bearer " + newToken.value,
            },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.data.status == 200) {
            setTimeout(() => {
              $q.notify({
                position: "top",
                type: "positive",
                timeout: 3000,
                message: response.data.message,
              });

              bookingStore.getBranchItem(route.params.id);
              $q.loading.hide();
            }, 1000);
          } else {
            setTimeout(() => {
              $q.notify({
                position: "top",
                type: "negative",
                timeout: 3000,
                message: response.data.message,
              });
              $q.loading.hide();
            }, 3000);
          }
        })
        .catch((error) => {
          setTimeout(() => {
            $q.notify({
              position: "top",
              type: "negative",
              timeout: 3000,
              message: "Error! Something went wrong!",
            });
            $q.loading.hide();
          }, 3000);
          console.log(error);
        });
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
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
    name: "name",
    label: "Client Name",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "number",
    label: "Client Number",
    field: "number",
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

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12;
  return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

onMounted(() => {
  // productStore.getAllPayments(route.params.id);
});
</script>

<style></style>
