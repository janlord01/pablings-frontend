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
          >Supplier</q-toolbar-title
        >
        <q-input
          bottom-slots
          v-model="searchSupply"
          @keyup="onSearchSubmit($event)"
          @keyup.delete="onSearchDelete"
          label="Search Supplier"
          outlined
          class="search_input"
          :style="$q.screen.gt.sm ? '' : 'width: 150px;'"
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
          :label="$q.screen.gt.xs ? 'Create Supplier' : 'Create'"
          @click="createDialog"
        />
      </q-toolbar>
      <supplierList />

      <q-dialog v-model="showCreateDialog">
        <CreateSupplier
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
import supplierList from "src/components/suppliers/ListSupplier.vue";
import createBranch from "src/components/branches/CreateBranch.vue";
import importMember from "src/components/users/member/importMember.vue";
import CreateSupplier from "src/components/suppliers/CreateSupplier.vue";
import { useRoute } from "vue-router";
import { useMainStoreData } from "stores/store";

const mainStore = useMainStoreData();

const route = useRoute();

const supplierStore = useSupplierData();
const searchSupply = ref(null);

const onSearchSubmit = ($event) => {
  supplierStore.onSearch([searchSupply.value, route.params.slug]);
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
  supplierStore.getAllSupplier(route.params.slug);
  mainStore.loc = "Supplier";
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
