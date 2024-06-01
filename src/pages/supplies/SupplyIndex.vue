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
        <q-toolbar-title class="text-h6">Supplies</q-toolbar-title>
        <q-input
          bottom-slots
          v-model="searchProduct"
          @keyup="onSearchSubmit"
          label="Search Supply"
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
          :label="$q.screen.gt.xs ? 'Add Supply' : ''"
          @click="createDialog"
        />
      </q-toolbar>
      <supplyList />

      <q-dialog v-model="showCreateDialog">
        <CreateSupply
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useSupplyData } from "stores/supplies/supplyStore";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import supplyList from "src/components/supplies/ListSupplies.vue";
import createBranch from "src/components/branches/CreateBranch.vue";
import importMember from "src/components/users/member/importMember.vue";
import CreateSupply from "src/components/supplies/CreateSupply.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const supplyStore = useSupplyData();
const searchSupply = ref(null);
const searchProduct = ref("");

const onSearchSubmit = () => {
  supplyStore.onSearch([searchProduct.value, route.params.slug]);
  // supplyStore.onSearch(searchSupply.value);
};
const onSearchDelete = () => {
  // console.log("delete");
  supplyStore.onSearchDelete();
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
  supplyStore.getAllProducts(route.params.slug);
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
