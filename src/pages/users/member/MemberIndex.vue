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
      <q-toolbar class="">
        <q-toolbar-title class="text-h6 invisible">Clients</q-toolbar-title>

        <q-input
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmit"
          label="Search Client"
          outlined
          class="search_input"
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
          :label="$q.screen.gt.xs ? 'Create Client' : ''"
          @click="createDialog"
        />
      </q-toolbar>
      <memberList />

      <q-dialog v-model="showCreateDialog">
        <createMember
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useCodeData } from "stores/membership/storeCodes";
import { useUserData } from "stores/users/store";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import memberList from "src/components/users/member/memberList.vue";
import createMember from "src/components/users/member/createMember.vue";
import importMember from "src/components/users/member/importMember.vue";
import { useMainStoreData } from "stores/store";

import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const mainStore = useMainStoreData();
const codesStore = useCodeData();
const userStore = useUserData();

const searchUser = ref(null);
const onSearchSubmit = () => {
  userStore.onSearch(searchUser.value);
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
  // codesStore.getAllCodes();
  mainStore.loc = "Clients";
  // getCodesFunc();
  // console.log(codes);
  userStore.getAllMembers(route.params.slug);
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
