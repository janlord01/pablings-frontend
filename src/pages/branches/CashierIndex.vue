<template>
  <q-page class="">
    <div
      :class="
        $q.dark.isActive
          ? 'shadow-1 q-pa-md rounded-borders text-white bg-dark q-pa-lg'
          : 'shadow-1 q-pa-md rounded-borders text-dark bg-white q-pa-lg'
      "
      style="border-radius: 20px"
    >
      <q-toolbar class="q-mt-sm">
        <q-toolbar-title
          :class="$q.screen.gt.xs ? ' full-width  text-h6' : 'hidden'"
          >{{ mainStore.loc }}
        </q-toolbar-title>
        <q-input
          filled
          v-model="startDate"
          mask="date"
          label="Start Date"
          class="q-mr-sm"
          :rules="['date']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="startDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          filled
          v-model="endDate"
          mask="date"
          label="End Date"
          class="q-mr-sm"
          :rules="['date']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="endDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-btn
          icon="search"
          color="blue"
          size="sm"
          class="q-mr-sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-bottom: 20px"
          :label="$q.screen.gt.xs ? 'Search' : 'Search'"
          @click="
            cashierStore.getAllBranchPaymentTransactionByDate([
              route.params.id,
              startDate,
              endDate,
            ])
          "
        />
        <q-btn
          icon="add_circle"
          color="blue"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-bottom: 20px"
          :label="$q.screen.gt.xs ? 'Create Payment' : 'Create'"
          :to="
            '/' +
            route.params.slug +
            '/branches/' +
            route.params.id +
            '/cashier/create'
          "
        />
      </q-toolbar>

      <cashierList />

      <q-dialog v-model="showCreateDialog">
        <CreatePayment
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";
import { useQuasar, LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import cashierList from "src/components/branches/cashier/CashierList.vue";
import { useDiscountData } from "stores/branch/discountStore";

// import CreateProducts from "src/components/branches/products/CreateProducts.vue";
import { useRoute } from "vue-router";
import CreatePayment from "src/components/branches/cashier/CreatePayment.vue";

import { useUserData } from "stores/users/store";

import { useCashierData } from "src/stores/branch/cashierStore";

import { useMainStoreData } from "stores/store";
const mainStore = useMainStoreData();

const startDate = ref("");
const endDate = ref("");

const cashierStore = useCashierData();

const userStore = useUserData();

const route = useRoute();
const discountStore = useDiscountData();

const productStore = useProductDatas();

const searchUser = ref(null);
const onSearchSubmit = () => {};
const onLoadAllData = () => {};

const showCreateDialog = ref(false);
const showImportDialog = ref(false);

const createDialog = () => {
  showCreateDialog.value = true;
};
const ImportDialog = () => {
  showImportDialog.value = true;
};

const getBranch = async () => {
  api
    .get(`api/branch/${route.params.id}`, {
      headers: {
        Authorization: "Bearer " + LocalStorage.getItem("jwt"),
      },
    })
    .then((response) => {
      mainStore.loc = response.data.branch.name + " Cashier";
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
onMounted(() => {
  mainStore.loc = "Cashier";
  getBranch();
  //   productStore.getAllProducts(route.params.id);
  // getCodesFunc();
  // console.log(codes);
  // userStore.getUserDetails();
  cashierStore.getAllBranchPaymentTransaction(route.params.id);
  // discountStore.getAllDiscounts(route.params.id);
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
src/stores/branch/productStores
