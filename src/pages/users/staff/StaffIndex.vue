<template>
  <q-page>
    <div
      class="text-black shadow-1 q-pa-md rounded-borders bg-white"
      style="border-radius: 20px"
    >
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Staff List</q-toolbar-title>

        <q-input
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmit"
          label="Search Staff"
          outlined
          class="search_input"
          :style="!$q.screen.gt.sm ? 'display:none' : ''"
        >
          <template v-slot:append>
            <!-- <q-icon
              v-if="searchUser !== ''"
              name="close"
              @click="onLoadAllData"
              class="cursor-pointer"
            /> -->
            <q-icon name="search" size="sm" />
          </template>
        </q-input>
        <!-- <q-btn
          icon="download"
          color="green"
          size="sm"
          :label="$q.screen.gt.xs ? 'member_template.xlsx' : ''"
          class="q-mr-sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: -10px"
          href="/files/template-file-member.xlsx"
        >
          &nbsp;
        </q-btn>
        <q-btn
          icon="cloud_upload"
          color="secondary"
          size="sm"
          class="q-mr-sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: -10px"
          :label="$q.screen.gt.xs ? 'Import Member' : ''"
          @click="ImportDialog"
        /> -->
        <q-btn
          icon="add_circle"
          color="primary"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: -10px"
          :label="$q.screen.gt.xs ? 'Create Staff' : ''"
          @click="createDialog"
        />
      </q-toolbar>
      <!-- <div class="q-pd-md"> -->
      <staffList />
      <!-- </div> -->

      <q-dialog v-model="showCreateDialog">
        <createStaff
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
import staffList from "src/components/users/staff/staffList.vue";
import createStaff from "src/components/users/staff/createStaff.vue";
import importMember from "src/components/users/member/importMember.vue";
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
