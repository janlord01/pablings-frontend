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
      <q-toolbar class="q-mt-sm">
        <q-toolbar-title class="text-h6 invisible">Branches</q-toolbar-title>
      </q-toolbar>
      <!-- <branchList /> -->
    </div>
  </q-page>
</template>

<script setup>
import { defineComponent, ref, onMounted } from "vue";
import { useUserData } from "stores/users/store";

import branchList from "src/components/branches/BranchList.vue";
import { useMainStoreData } from "stores/store";

const mainStore = useMainStoreData();
const userStore = useUserData();
onMounted(() => {
  // userStore.getUserDetails();

  mainStore.loc = "Dashboard";
});
</script>
