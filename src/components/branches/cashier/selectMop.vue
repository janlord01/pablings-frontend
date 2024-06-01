<template>
  <q-card style="max-width: 400px; width: 400px; min-height: 300px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-blue text-white">
      <q-toolbar-title> Select Mode of Payment </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        @submit="onSubmit"
        ref="formName"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="col-12 q-mr-sm">
            <q-select
              filled
              v-model="formData.type"
              clearable
              :options="['cash', 'gcash', 'bank']"
              label="Select mode of payment"
              class="q-mb-md"
            />

            <div v-if="formData.type === 'gcash' || formData.type === 'bank'">
              <q-input
                filled
                label="Reference #"
                class="full-width q-mb-sm"
                v-model="formData.ref"
              >
                <template v-slot:prepend>
                  <q-icon name="numbers" />
                </template>
              </q-input>
            </div>

            <q-input
              filled
              label="Amount"
              name="code"
              class="full-width q-mb-sm"
              type="number"
              v-model="formData.amount"
            >
              <template v-slot:prepend>
                <q-icon name="currency_ruble" />
              </template>
            </q-input>
            <q-btn
              unelevated
              label="Select"
              class="text-center q-mt-lg"
              color="blue"
              size="md"
              type="submit"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";
import { useDiscountData } from "stores/branch/discountStore";
import { useCashierData } from "stores/branch/cashierStore";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute, useRouter } from "vue-router";
// import router from "src/router";
const route = useRoute();
const router = useRouter();
const mopList = ref("");
const emit = defineEmits("selectMop");

const newToken = ref(LocalStorage.getItem("jwt"));

const productStore = useProductDatas();
const cashierStore = useCashierData();

const $q = useQuasar();

const pagination = reactive({
  sortBy: "type",
  rowsPerPage: 20,
});
const columns = reactive([
  {
    name: "type",
    label: "Type",
    field: "type",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "mop",
    label: "Mop",
    field: "mop",
    align: "left",
    sortable: true,
  },
  {
    name: "amount",
    label: "Amount",
    field: "amount",
    align: "left",
    sortable: true,
  },
  {
    name: "change",
    label: "Change",
    field: "change",
    align: "left",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
    sortable: true,
  },
]);

const onSubmit = () => {
  if (formData.type === "" || formData.amount == 0 || formData.amount == "") {
    $q.notify({
      type: "negative",
      position: "top",
      timeout: 3000,
      message: "Some fields are required!",
    });
  } else {
    cashierStore.selectMop(formData);
    emit("selectMop");
  }
};
onMounted(() => {});

const formData = reactive({
  type: "",
  ref: "",
  proof: "",
  amount: 0,
  change: 0,
});
</script>
