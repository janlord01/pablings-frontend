<template>
  <q-page class="">
    <div
      :class="
        $q.dark.isActive
          ? 'no-shadow q-pa-md rounded-borders text-white bg-dark q-pa-lg'
          : 'no-shadow q-pa-md rounded-borders text-dark bg-white q-pa-lg'
      "
      style="border-radius: 20px"
    >
      <q-toolbar class="q-mt-sm">
        <q-toolbar-title class="text-h6 invisible"
          >Create Company</q-toolbar-title
        >
      </q-toolbar>
      <CreateCompanyForm />
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useMainStoreData } from "stores/store";
import CreateCompanyForm from "src/components/company/createCompanyForm.vue";

const mainStore = useMainStoreData();

onMounted(() => {
  mainStore.loc = "Create Company";
});
</script>
<style></style>
