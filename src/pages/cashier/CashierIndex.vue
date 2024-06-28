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
        <q-toolbar-title class="text-h6">Cashier</q-toolbar-title>

        <q-btn
          icon="add_circle"
          color="blue-9"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-bottom: 10px"
          :label="$q.screen.gt.xs ? 'Create Payment' : 'Create'"
          to="/cashier/create"
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
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import cashierList from "src/components/cashier/adminCashierList.vue";
import { useDiscountData } from "stores/branch/discountStore";

// import CreateProducts from "src/components/branches/products/CreateProducts.vue";
import { useRoute } from "vue-router";
import CreatePayment from "src/components/branches/cashier/CreatePayment.vue";

import { useUserData } from "stores/users/store";

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
onMounted(() => {
  //   productStore.getAllProducts(route.params.id);
  // getCodesFunc();
  // console.log(codes);
  // userStore.getUserDetails();
  productStore.getAllOwnersPayments();
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
