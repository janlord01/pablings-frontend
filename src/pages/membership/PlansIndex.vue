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
        <q-toolbar-title class="text-h6 invisible"
          >Plans/Subscriptions</q-toolbar-title
        >

        <q-input
          bottom-slots
          v-model="searchPlan"
          @keyup="onSearchSubmit"
          label="Search Plan"
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
          style="padding-top: 15px; padding-bottom: 15px; margin-bottom: 10px"
          :label="$q.screen.gt.xs ? 'Create Plan' : ''"
          @click="createDialog"
        />
      </q-toolbar>
      <planList />

      <q-dialog v-model="showCreateDialog">
        <createPlan
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { usePlanData } from "stores/membership/storePlans";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import planList from "src/components/membership/PlanList.vue";
import createPlan from "src/components/membership/CreatePlan.vue";
import { useMainStoreData } from "stores/store";

const mainStore = useMainStoreData();
const planStore = usePlanData();

const searchPlan = ref(null);
const onSearchSubmit = () => {
  planStore.onSearch(searchPlan.value);
  //   console.log(searchPlan.value)
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
  mainStore.loc = "Plans/Subscriptions";
  //   codesStore.getAllBranches();
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
