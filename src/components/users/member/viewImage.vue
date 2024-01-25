<template>
  <q-card style="max-width: 800px; width: 800px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Create Member </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="col-12 q-mr-sm q-pr-xl">
            <img :src="imgFile" />
          </div>
        </div>
        <div class="row align-center">
          <q-btn
            unelevated
            label="Create"
            class="text-center"
            color="primary"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useCodeData } from "stores/membership/storeCodes";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
const emit = defineEmits(["hideCreateDialog"]);
const prop = defineProps(["imgFile"]);

const codesStore = useCodeData();
const userStore = useUserData();

const codes = reactive([]);
const $q = useQuasar();

const getCodesFunc = () => {
  Object.entries(codesStore.rowDatas).map(([key, val]) => {
    codes.push({
      label: val.code,
      value: val.id,
    });
  });
};

const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  api
    .post(
      "/api/members",
      {
        firstname: formData.firstname,
        middlename: formData.middlename,
        lastname: formData.lastname,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        contact: formData.phone,
        code: formData.code.label,
        email: formData.email,
        know: formData.from,
      },
      {
        headers: {
          Authorization: "Bearer " + newToken,
        },
      }
    )
    .then((response) => {
      // console.log(response);
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
          userStore.getAllMembers();
          emit("hideCreateDialog");
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
onMounted(() => {
  getCodesFunc();
  // console.log(codes);
});

const formData = reactive({
  firstname: null,
  middlename: null,
  lastname: null,
  dob: null,
  gender: null,
  phone: null,
  address: null,
  profession: null,
  email: null,
  code: null,
  from: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
