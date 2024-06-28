<template>
  <q-card style="max-width: 900px; width: 900px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-blue text-white">
      <q-toolbar-title> Commission </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-table
        grid
        :pagination="pagination"
        :rows="cashierStore.commissions"
        :columns="columns"
        flat
        :loading="cashierStore.commissionLoading"
        row-key="id"
        separator="none"
        hide-pagination
        :visible-columns="$q.screen.gt.xs ? ['name', 'qty'] : ['name', 'qty']"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template v-slot:item="props">
          <q-card
            class="my-card row q-mb-md q-mr-sm"
            :style="$q.screen.gt.sm ? 'width: 47%' : 'width: 100%'"
          >
            <q-card-section class="full-width">
              <div style="font-size: 14px">
                <span class="text-bold">Service/Product</span> <br />{{
                  props.row.name
                }}
                <br />
                <span class="text-bold">Total</span> <br />P{{
                  props.row.sub_total_item
                }}
                <br />
                <span class="text-bold">Remaining Total</span> <br />P{{
                  props.row.remaining_amount
                }}
                <br />

                <q-select
                  filled
                  class="q-mt-md"
                  v-model="props.row.worker"
                  label="Select Worker"
                  :options="cashierStore.commissionWorker"
                  behavior="menu"
                />
                <q-select
                  filled
                  class="q-mt-sm"
                  v-model="props.row.type"
                  label="Select Type"
                  :options="['Percentage', 'Amount']"
                  behavior="menu"
                />
                <q-input
                  filled
                  v-model="props.row.number"
                  :label="props.row.type == 'Amount' ? 'Amount' : 'Number'"
                  class="q-mt-sm full-width"
                  type="number"
                  @keyup.enter="
                    addCommission(
                      props.row.id,
                      props.row.worker,
                      props.row.type,
                      props.row.number,
                      props.row.remaining_amount,
                      props.row.sub_total_item
                    )
                  "
                >
                  <template v-slot:prepend>
                    <q-icon
                      :name="
                        props.row.type == 'Amount' ? 'attach_money' : 'percent'
                      "
                    />
                  </template>
                </q-input>
                <q-btn
                  color="primary"
                  icon="add"
                  label="Add"
                  class="q-mt-sm"
                  size="sm"
                  @click="
                    addCommission(
                      props.row.id,
                      props.row.worker,
                      props.row.type,
                      props.row.number,
                      props.row.remaining_amount,
                      props.row.sub_total_item
                    )
                  "
                />
                <q-table
                  :pagination="pagination2"
                  :rows="
                    cashierStore.commissions[props.row.dataID].commission_worker
                  "
                  :columns="columns2"
                  flat
                  :loading="cashierStore.commissionLoading"
                  :grid="!$q.screen.gt.sm"
                  row-key="id"
                  separator="none"
                  hide-pagination
                  :visible-columns="
                    $q.screen.gt.xs
                      ? ['worker', 'number', 'amount', 'action']
                      : ['worker', 'number', 'amount', 'action']
                  "
                >
                  <template v-slot:loading>
                    <q-inner-loading showing color="primary" />
                  </template>
                  <template v-slot:item="props">
                    <div
                      class="q-pa-sm"
                      style="
                        border: solid #c2c2c2 1px;
                        width: 47%;
                        margin-right: 5px;
                      "
                    >
                      <span class="text-bold">Worker Name</span> <br />{{
                        props.row.worker_name
                      }}
                      <br />
                      <span class="text-bold">Type</span> <br />{{
                        props.row.type
                      }}
                      <br />
                      <span class="text-bold">Number</span> <br />{{
                        props.row.number_label
                      }}
                      <br />
                      <span class="text-bold">Commission</span> <br />P{{
                        props.row.commission
                      }}
                      <br />
                      <q-btn
                        class="q-mt-md"
                        v-if="props.row.status === 'pending'"
                        color="red"
                        icon="delete"
                        size="sm"
                        @click="DeleteDialog(props.row.id, props.row.worker)"
                      />
                      <q-btn
                        class="q-mt-md"
                        v-else
                        color="grey-5"
                        icon="delete"
                        size="sm"
                        disable
                      />
                    </div>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="worker" :props="props">
                        {{ props.row.worker_name }}
                      </q-td>
                      <q-td key="type" :props="props">
                        {{ props.row.type }}
                      </q-td>
                      <q-td key="number" :props="props">
                        {{ props.row.number_label }}
                      </q-td>
                      <q-td key="amount" :props="props">
                        {{ props.row.commission }}
                      </q-td>

                      <q-td key="action" :props="props">
                        <q-btn
                          v-if="props.row.status === 'pending'"
                          color="red"
                          icon="delete"
                          size="sm"
                          @click="DeleteDialog(props.row.id, props.row.worker)"
                        />
                        <q-btn
                          v-else
                          color="grey-5"
                          icon="delete"
                          size="sm"
                          disable
                        />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </q-card-section>
            <q-card-actions>
              <q-btn
                label="Save"
                color="primary"
                icon="save"
                size="md"
                @click="saveDialog(props.row.dataID)"
              />
              <!-- <q-btn v-else label="Save" color="grey-9" icon="save" size="md" /> -->
            </q-card-actions>
          </q-card>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeMount, computed, watch } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";
import searchProduct from "components/branches/cashier/SearchProduct.vue";
import CheckoutDialog from "./CheckoutDialog.vue";
import searchPlan from "components/branches/cashier/SearchPlan.vue";
import { useCashierData } from "src/stores/branch/cashierStore";
const route = useRoute();

const cashierStore = useCashierData();
const DeleteDialog = (id, worker) => {
  cashierStore.removeWorkerCommission([id, worker]);
};
const emit = defineEmits(["hideCommissioneDialog"]);
const props = defineProps(["paymentId"]);
const $q = useQuasar();

const saveDialog = (dataId) => {
  $q.loading.show();
  api
    .post(
      `/api/payment/commission/store`,
      {
        commissions: cashierStore.commissions[dataId],
      },
      {
        headers: {
          Authorization: "Bearer " + newToken.value,
        },
      }
    )
    .then((response) => {
      console.log(response);
      if (response.data.status === 200) {
        setTimeout(() => {
          $q.notify({
            position: "bottom",
            type: "positive",
            timeout: 3000,
            message: response.data.message,
          });
          // emit("hideCommissioneDialog");
          $q.loading.hide();
        }, 500);
      } else {
        setTimeout(() => {
          $q.notify({
            position: "bottom",
            type: "negative",
            timeout: 3000,
            message: response.data.message,
          });
          $q.loading.hide();
        }, 3000);
      }
    })
    .catch((error) => {
      console.log(error);
      setTimeout(() => {
        $q.notify({
          position: "bottom",
          type: "negative",
          timeout: 3000,
          message: "Error, Something went wrong!",
        });
        $q.loading.hide();
      }, 3000);
    });
};
const addCommission = (id, worker, type, number, remaining, total) => {
  if (typeof worker.value == "undefined" || type == "" || number == "") {
    $q.notify({
      position: "top",
      type: "negative",
      timeout: 3000,
      message: "Please provide necessary field",
    });
  } else if (type == "Percentage" && number > 100) {
    $q.notify({
      position: "top",
      type: "negative",
      timeout: 3000,
      message: "Percentage should not greater than 100%",
    });
  } else {
    const objWithIdIndex = cashierStore.commissions.findIndex(
      (item) => item.id === id
    );
    const commissionIndex = cashierStore.commissions[
      objWithIdIndex
    ].commission_worker.findIndex((item) => item.worker === worker.value);
    // console.log(commissionIndex);

    if (commissionIndex > -1) {
      $q.notify({
        position: "top",
        type: "negative",
        timeout: 3000,
        message: "worker is already selected, please select other worker",
      });
    } else {
      let commission =
        type === "Percentage"
          ? (parseFloat(number) / 100) * parseFloat(total)
          : parseFloat(number);

      let data = [
        {
          id: id,
          worker: worker.value,
          worker_name: worker.label,
          type: type,
          number_label: type == "Percentage" ? number + "%" : "P" + number,
          number: number,
          commission: commission,
          status: "pending",
        },
      ];
      if (parseFloat(commission) > parseFloat(remaining)) {
        $q.notify({
          position: "top",
          type: "negative",
          timeout: 3000,
          message:
            "Amount entered should not be greater than the remaining amount",
        });
      } else if (remaining === 0) {
        $q.notify({
          position: "top",
          type: "negative",
          timeout: 3000,
          message: "Insufficient remaining amount",
        });
      } else {
        cashierStore.commissions[objWithIdIndex].remaining_amount =
          cashierStore.commissions[objWithIdIndex].remaining_amount -
          commission;
        cashierStore.addCommissionToWorker([id, data]);
      }
    }
  }
};

const newToken = ref(LocalStorage.getItem("jwt"));
const allMembers = reactive([]);
const filterMember = reactive({});
const loading = ref(true);
const items = reactive([
  //   {
  //     id: null,
  //     name: null,
  //     title: null,
  //     qty: null,
  //   },
]);

const searchMember = ref(null);
const seletedMember = ref(null);
const searchVisible = ref(false);
const showCheckoutDialog = ref(false);
const status = ref(null);

const productStore = useProductDatas();

const getItem = async () => {
  await api
    .get("/api/payment/item/" + props.paymentId, {
      params: {
        branch: route.params.id,
      },
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      console.log(response);

      setTimeout(() => {
        Object.entries(response.data.data).map(([key, val]) => {
          // console.log(item.name);
          items.push(val);
        });
        loading.value = false;
      }, 500);

      // console.log(items);
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  // getItem();
  cashierStore.getItemCommission([props.paymentId, route.params.id]);
  //   getCodesFunc();
  // console.log(codes);
});

const pagination = reactive({
  sortBy: "name",
  rowsPerPage: 0,
});
const columns = reactive([
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
  },
  {
    name: "qty",
    label: "Qty",
    field: "qty",
    align: "left",
  },
]);

const pagination2 = reactive({
  sortBy: "name",
  rowsPerPage: 0,
});
const columns2 = reactive([
  {
    name: "worker",
    label: "Name",
    field: "worker",
    align: "left",
  },
  {
    name: "type",
    label: "Type",
    field: "type",
    align: "left",
  },
  {
    name: "number",
    label: "Number",
    field: "number",
    align: "left",
  },
  {
    name: "amount",
    label: "Amount",
    field: "amount",
    align: "left",
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
]);

const memberToggle = ref(true);
const guestName = ref(null);
const formData = reactive({
  type: null,
  worker: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
