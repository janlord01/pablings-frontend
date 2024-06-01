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
          :class="$q.screen.gt.xs ? 'text-h6' : 'text-h6 invisible'"
          >Bookings</q-toolbar-title
        >
        <!-- <q-input
          bottom-slots
          v-model="searchProduct"
          @keyup="onSearchSubmit($event)"
          label="Search Service"
          outlined
          class="search_input"
          :style="$q.screen.gt.xs ? '' : 'width: 150px;'"
        >
          <template v-slot:append>
            <q-icon name="search" size="sm" />
          </template>
        </q-input> -->
        <q-btn
          icon="add_circle"
          color="blue"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: -10px"
          :label="$q.screen.gt.xs ? 'Create Booking' : 'Create Booking'"
          @click="createDialog"
        />
      </q-toolbar>
      <servicesList />

      <q-dialog v-model="showCreateDialog">
        <CreateService
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useServicesData } from "stores/branch/servicesStore";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import servicesList from "src/components/branches/services/ServicesList.vue";
import createBranch from "src/components/branches/CreateBranch.vue";
import importMember from "src/components/users/member/importMember.vue";
import CreateService from "src/components/branches/services/CreateService.vue";
import { useRoute } from "vue-router";
import { useMainStoreData } from "stores/store";
const mainStore = useMainStoreData();

const route = useRoute();

const servicesStore = useServicesData();

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
  mainStore.loc = "Services";

  servicesStore.getAllServicesBranch(route.params.id);
  servicesStore.getAllServices(route.params.slug);
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
