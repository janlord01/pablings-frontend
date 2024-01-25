<template>
  <q-card style="max-width: 600px; width: 600px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Import Member </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div>
            <q-file
              v-model="files"
              label="Attach Excel File"
              square
              flat
              counter
              outlined
              use-chips
              accept=".xls,.xlsx"
              max-file-size="5120000"
              class="q-mr-sm"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>

          <div class="align-center">
            <q-btn
              unelevated
              label="Upload"
              class="text-center"
              style="font-size: 14px; padding: 15px 18px"
              color="primary"
              size="lg"
              type="submit"
            />
          </div>
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
const emit = defineEmits(["hideImportDialog"]);

const codesStore = useCodeData();
const userStore = useUserData();

const files = ref(null);

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
  let formData = new FormData();
  formData.append("files", files.value);
  api
    .post("/api/member/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + newToken,
      },
    })
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
          emit("hideImportDialog");
        }, 2000);
      } else {
        setTimeout(() => {
          $q.loading.hide();
          $q.notify({
            type: "negative",
            icon: "error",
            timeout: 2000,
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

// const formData = reactive({
//   firstname: null,
//   middlename: null,
//   lastname: null,
//   dob: null,
//   gender: null,
//   phone: null,
//   address: null,
//   profession: null,
//   email: null,
//   code: null,
//   from: null,
// });

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
