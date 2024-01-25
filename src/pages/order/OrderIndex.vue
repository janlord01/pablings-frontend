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
          class="text-h6"
          :class="$q.screen.gt.sm ? '' : 'invisible'"
          >Orders</q-toolbar-title
        >
        <q-input
          bottom-slots
          v-model="searchSupply"
          @keyup="onSearchSubmit($event)"
          @keyup.delete="onSearchDelete"
          label="Search Order"
          outlined
          class="search_input"
          :style="!$q.screen.gt.sm ? 'display:none' : ''"
        >
          <template v-slot:append>
            <q-icon name="search" size="sm" />
          </template>
        </q-input>
        <q-btn
          icon="add_circle"
          color="blue"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: -10px"
          :label="$q.screen.gt.xs ? 'Create Order' : 'Create'"
          @click="createDialog"
        />
      </q-toolbar>
      <ListOrder />

      <q-dialog v-model="showCreateDialog" persistent>
        <CreateOrder
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useSupplierData } from "stores/supplier/supplierStore";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import ListOrder from "src/components/order/ListOrder.vue";
import createBranch from "src/components/branches/CreateBranch.vue";
import importMember from "src/components/users/member/importMember.vue";
import CreateOrder from "src/components/order/createOrder.vue";
import { useOrderData } from "stores/order/orderStore.js";
import { useRoute } from "vue-router";
import { useMainStoreData } from "stores/store";

const mainStore = useMainStoreData();

const orderStore = useOrderData();

const route = useRoute();

const supplierStore = useSupplierData();
const searchSupply = ref(null);

const onSearchSubmit = ($event) => {
  orderStore.onSearch([searchSupply.value, route.params.slug]);
};
const onSearchDelete = () => {
  // console.log("delete");
  supplierStore.onSearchDelete();
};

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
  orderStore.getAllOrder(route.params.slug);
  mainStore.loc = "Orders";

  // getCodesFunc();
  // console.log(codes);
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
