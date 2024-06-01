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
          >Product Inventory</q-toolbar-title
        >
        <q-input
          bottom-slots
          v-model="searchSupply"
          @keyup="onSearchSubmit($event)"
          @keyup.delete="onSearchDelete"
          label="Search Inventory"
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
          :label="$q.screen.gt.xs ? 'Create Inventory' : 'Create'"
          @click="createDialog"
        />
      </q-toolbar>
      <ListInventories />

      <q-dialog v-model="showCreateDialog" persistent>
        <CreateInventory
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
import ListInventories from "src/components/inventories/ListInventories.vue";
import createBranch from "src/components/branches/CreateBranch.vue";
import importMember from "src/components/users/member/importMember.vue";
import CreateInventory from "src/components/inventories/CreateInventory.vue";
import { useRoute } from "vue-router";
import { useMainStoreData } from "stores/store";
const mainStore = useMainStoreData();

import { useInventoryData } from "stores/inventories/inventoryStore.js";

const inventoryStore = useInventoryData();

const route = useRoute();

const supplierStore = useSupplierData();
const searchSupply = ref(null);

const onSearchSubmit = ($event) => {
  inventoryStore.onSearch([searchSupply.value, route.params.slug]);
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
  inventoryStore.getAllInventories(route.params.slug);
  mainStore.loc = "Inventory";

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
