<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="">
        <q-toolbar-title class="text-h6">Generated Codes List</q-toolbar-title>

        <q-btn
          icon="add_circle"
          color="primary"
          size="sm"
          style="
            padding-top: 15px;
            padding-bottom: 15px;
            margin-top: 5px;
            margin-bottom: 5px;
          "
          :label="$q.screen.gt.xs ? 'Generate Code' : ''"
          @click="showCreateDialog = true"
        />
      </q-toolbar>
      <codeList />

      <q-dialog v-model="showCreateDialog">
        <generateCodes
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { LocalStorage } from "quasar";
import generateCodes from "src/components/membership/CreateCodes.vue";
import codeList from "src/components/membership/codeList.vue";

const showCreateDialog = ref(false);

const createDialog = () => {
  //   showCreateDialog = true;
  // console.log("test");
};
</script>
<style></style>
