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
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmit"
          label="Search Request"
          outlined
          class="search_input"
        >
          <template v-slot:append>
            <q-icon
              v-if="searchUser !== ''"
              name="close"
              @click="onLoadAllData"
              class="cursor-pointer"
            />
            <q-icon name="search" size="sm" />
          </template>
        </q-input>
        <q-btn
          icon="description"
          color="blue"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: -10px"
          :label="$q.screen.gt.xs ? 'Create Request' : 'Create Request'"
          @click="createDialog"
        />
      </q-toolbar>
      <productList />

      <q-dialog v-model="showCreateDialog">
        <CreateRequest
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";
import { LocalStorage, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import productList from "src/components/branches/request/RequestProductList.vue";
import createBranch from "src/components/branches/CreateBranch.vue";
import importMember from "src/components/users/member/importMember.vue";
import CreateRequest from "src/components/branches/request/CreateRequest.vue";
import { useRoute } from "vue-router";
import { useMainStoreData } from "stores/store";
const mainStore = useMainStoreData();

const route = useRoute();

const productStore = useProductDatas();

const searchUser = ref("");
const onSearchSubmit = () => {
  let name = searchUser.value;
  productStore.onSearchRequest(name);
};
const onLoadAllData = () => {
  searchUser.value = "";
};
const getBranch = async () => {
  api
    .get(`api/branch/${route.params.id}`, {
      headers: {
        Authorization: "Bearer " + LocalStorage.getItem("jwt"),
      },
    })
    .then((response) => {
      mainStore.loc = " Request Product (" + response.data.branch.name + ")";
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
const showCreateDialog = ref(false);
const showImportDialog = ref(false);

const createDialog = () => {
  showCreateDialog.value = true;
};
const ImportDialog = () => {
  showImportDialog.value = true;
};
onMounted(() => {
  mainStore.loc = "Product Request";
  getBranch();
  productStore.getAllRequestBranch(route.params.id);
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
src/stores/branch/productStores
