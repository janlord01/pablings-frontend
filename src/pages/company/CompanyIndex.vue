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
          >Companies</q-toolbar-title
        >

        <q-input
          bottom-slots
          v-model="searchCompany"
          @keyup="onSearchSubmit"
          label="Search Company"
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
          color="blue-9"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-bottom: 10px"
          :label="$q.screen.gt.xs ? 'Create Company' : 'Create'"
          to="/company/create"
        />
      </q-toolbar>
      <companyLIst />

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
import companyLIst from "src/components/company/companyList.vue";
import createPlan from "src/components/membership/CreatePlan.vue";
import { useMainStoreData } from "stores/store";
import { useCompanyData } from "stores/company/store";

const mainStore = useMainStoreData();
const planStore = usePlanData();
const companyStore = useCompanyData();

const searchCompany = ref(null);
const onSearchSubmit = () => {
  companyStore.onSearch(searchCompany.value);
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
  mainStore.loc = "Companies";
  companyStore.getAllCompanies();
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
