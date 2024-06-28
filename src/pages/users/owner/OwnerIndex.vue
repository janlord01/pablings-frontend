<template>
  <q-page>
    <div
      :class="
        $q.dark.isActive
          ? 'shadow-1 q-pa-md rounded-borders text-white bg-dark q-pa-lg'
          : 'shadow-1 q-pa-md rounded-borders text-dark bg-white q-pa-lg'
      "
      style="border-radius: 20px"
    >
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Owner</q-toolbar-title>

        <!-- <q-input
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmit"
          label="Search Staff"
          outlined
          class="search_input"
          :style="!$q.screen.gt.sm ? 'display:none' : ''"
        >
          <template v-slot:append>
            <q-icon name="search" size="sm" />
          </template>
        </q-input> -->
        <q-btn
          icon="add_circle"
          color="blue-9"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: -10px"
          :label="$q.screen.gt.xs ? 'Create Owner' : 'Create'"
          @click="createDialog"
        />
      </q-toolbar>
      <!-- <div class="q-pd-md"> -->
      <ownerList />
      <!-- </div> -->

      <q-dialog v-model="showCreateDialog">
        <createOwner
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>

      <!-- <q-dialog v-model="showImportDialog">
        <importMember
          @hide-import-dialog="showImportDialog = !showImportDialog"
        />
      </q-dialog> -->
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useCodeData } from "stores/membership/storeCodes";
import { useUserData } from "stores/users/store";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import ownerList from "src/components/users/owner/ownerList.vue";
import createOwner from "src/components/users/owner/createOwner.vue";
import importMember from "src/components/users/member/importMember.vue";
import { useMainStoreData } from "stores/store";
import { useRoute } from "vue-router";
import { useCompanyData } from "stores/company/store";
const companyStore = useCompanyData();

const route = useRoute();

const mainStore = useMainStoreData();

const codesStore = useCodeData();
const userStore = useUserData();

const searchUser = ref(null);
const onSearchSubmit = () => {
  userStore.onSearchStaff(searchUser.value);
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
  codesStore.getAllCodes();
  mainStore.loc = "Owner";
  companyStore.getAllOwners(route.params.slug);
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
