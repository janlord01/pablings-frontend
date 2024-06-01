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
          >Staff</q-toolbar-title
        >

        <!-- <q-input
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmit"
          label="Search Member"
          outlined
          class="search_input"
          :style="!$q.screen.gt.sm ? 'display:none' : ''"
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
        </q-input> -->
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
          color="blue"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-bottom: 10px"
          :label="$q.screen.gt.xs ? 'Create Staff' : 'Create'"
          @click="createDialog"
          v-if="users > countUser"
        />
        <q-btn
          v-else
          disable
          icon="add_circle"
          color="blue"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-bottom: 10px"
          :label="$q.screen.gt.xs ? 'Create Staff' : 'Create'"
          @click="createDialog"
        />
      </q-toolbar>
      <staffList />

      <q-dialog v-model="showCreateDialog" persistent>
        <createStaff
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
          @create-staff="getBranchUserCount"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useBranchData } from "stores/branch/store";
import { LocalStorage, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import staffList from "src/components/staff/StaffList.vue";

import createStaff from "src/components/staff/CreateBarberStaff.vue";
import importMember from "src/components/users/member/importMember.vue";
import { useMainStoreData } from "stores/store";
import { useUserData } from "stores/users/store";

const router = useRouter();

const userStore = useUserData();
import { useRoute, useRouter } from "vue-router";

const $q = useQuasar();

const route = useRoute();

const mainStore = useMainStoreData();

const codesStore = useBranchData();

const searchUser = ref(null);
const onSearchSubmit = () => {};
const onLoadAllData = () => {};

const countBranch = ref(null);
const branches = ref(null);
const countUser = ref(null);
const users = ref(null);

const getBranchUserCount = async () => {
  const newToken = LocalStorage.getItem("jwt");
  await api
    .get(`/api/company/branches-users/${route.params.slug}`, {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      // console.log(response);
      countUser.value = parseInt(response.data.users);
      users.value = response.data.data.users;
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
  getBranchUserCount();

  mainStore.loc = "Staff";
  // if (route.params.slug) {
  //   if (userStore.userDetails.slug !== route.params.slug) {
  //     setTimeout(() => {
  //       $q.notify({
  //         type: "negative",
  //         position: "top",
  //         timeout: 5000,
  //         message:
  //           "Access Denied! You don't have permission to access this section!",
  //       });
  //       router.go(-1);
  //     }, 500);
  //   }
  // }
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
