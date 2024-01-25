<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-blue text-white">
      <q-toolbar-title> Generate Codes </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <!-- <q-spinner-ios
        color="primary"
        size="2em"
        class="absolute-center"
        v-if="!loadingSpinner"
      /> -->
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <!-- <div class="col-3 q-mr-sm"></div> -->
          <div class="col-7 q-mr-sm">
            <q-input
              filled
              label="How Many Codes?"
              class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
              type="number"
              v-model="code"
            >
              <template v-slot:prepend>
                <q-icon name="local_offer" />
              </template>
            </q-input>
          </div>
          <div class="col-4 q-mr-sm q-mt-md">
            <q-btn
              label="Generate"
              class="text-center"
              color="blue"
              style="height: 50px; margin-top: 3px"
              size="md"
              type="submit"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref } from "vue";
import { useCodeData } from "stores/membership/storeCodes";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

import { LocalStorage } from "quasar";

const $q = useQuasar();
const emit = defineEmits(["hideCreateDialog"]);

const codesStore = useCodeData();

const code = ref(0);

const onSubmit = () => {
  // codesStore.createCodes(code);
  // console.log(code);
  $q.loading.show();
  var newToken = LocalStorage.getItem("jwt");
  api
    .post(
      "/api/codes",
      {
        code: code.value,
      },
      {
        headers: {
          Authorization: "Bearer " + newToken,
        },
      }
    )
    .then((response) => {
      console.log(response);

      if (response.data.status == 200) {
        // hiding in 2s
        setTimeout(() => {
          $q.loading.hide();
          $q.notify({
            type: "positive",
            color: "positive",
            timeout: 1000,
            position: "bottom",
            message: response.data.message,
          });
          codesStore.getAllCodes();
          emit("hideCreateDialog");
        }, 2000);
      } else {
        setTimeout(() => {
          $q.loading.hide();

          $q.notify({
            type: "negative",
            color: "negative",
            timeout: 1000,
            position: "bottom",
            message: response.data.message,
          });
        }, 2000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
