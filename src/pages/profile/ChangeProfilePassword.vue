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
        <q-toolbar-title class="text-h6">Change Password</q-toolbar-title>
      </q-toolbar>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mr-sm">
            <q-input
              filled
              label="New Password"
              name="code"
              class="q-mr-sm full-width"
              v-model="formData.password"
              :type="isPwd ? 'password' : 'text'"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
          <div class="full-width q-mr-sm">
            <q-input
              filled
              label="Confirm New Password"
              name="code"
              class="q-mr-sm q-mb-md full-width"
              :type="isPwdCon ? 'password' : 'text'"
              v-model="formData.confirmed_password"
            >
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwdCon ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdCon = !isPwdCon"
                />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row align-center">
          <q-btn
            unelevated
            label="Update"
            class="text-center"
            color="blue"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref, defineEmits, onMounted, reactive } from "vue";
// import snapPicture from "./viewImage.vue";
import { useUserData } from "src/stores/users/store";

import { LocalStorage, useQuasar } from "quasar";
import { api } from "src/boot/axios";

import { useRoute } from "vue-router";
import { useCompanyData } from "stores/company/store";
import { useMainStoreData } from "stores/store";

// import { saveAs } from "file-saver";

const $q = useQuasar();
const userStore = useUserData();
const isPwd = ref(true);
const isPwdCon = ref(true);
const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  api
    .patch(
      "/api/member/change-password/" + 0,
      {
        password: formData.password,
        password_confirmation: formData.confirmed_password,
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
        setTimeout(() => {
          $q.loading.hide();
          $q.notify({
            type: "positive",
            icon: "save",
            timeout: 1000,
            position: "bottom",
            message: response.data.message,
          });
          userStore.getUserDetails();
        }, 2000);
      } else {
        setTimeout(() => {
          $q.loading.hide();
          $q.notify({
            type: "negative",
            icon: "error",
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
const formData = reactive({
  password: null,
  confirmed_password: null,
});
</script>
