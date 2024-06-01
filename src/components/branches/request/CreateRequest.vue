<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Create Request </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mr-sm">
            <q-editor v-model="description" min-height="10rem" />
          </div>
        </div>

        <div class="row align-center q-mt-md">
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
import { useProductDatas } from "src/stores/branch/productStores";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";
const route = useRoute();

const description = ref("");
const emit = defineEmits(["hideCreateDialog"]);

const productStore = useProductDatas();

const codes = reactive([]);
const $q = useQuasar();
const isPwd = ref(true);
const isPwdCon = ref(true);

// const getCodesFunc = () => {
//   Object.entries(codesStore.rowDatas).map(([key, val]) => {
//     codes.push({
//       label: val.code,
//       value: val.id,
//     });
//   });
// };

const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();

  var fileData = new FormData();
  // fileData.append("img", formData.img != null ? formData.img[0] : null);
  // fileData.append("name", formData.name);
  // fileData.append("description", formData.description);
  // fileData.append("price", formData.price);
  // fileData.append("qty", formData.qty);
  // fileData.append("sale", formData.sale);
  // fileData.append("sale_price", formData.sale_price);
  fileData.append("description", description.value);
  fileData.append("branch_id", route.params.id);
  fileData.append("slug", route.params.slug);
  fileData.append("_method", "POST");

  api
    .post(
      "/api/products/branch/request/store",
      fileData,
      // {
      //   name: formData.name,
      //   description: formData.description,
      //   price: formData.price,
      //   qty: formData.qty,
      //   sale: formData.sale,
      //   sale_price: formData.sale_price,
      //   img: formData.img,
      //   branch_id: route.params.id,
      // },
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
          productStore.getAllRequestBranch(route.params.id);
          emit("hideCreateDialog");
        }, 1000);
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
        }, 3000);
      }
    })
    .catch((error) => {
      console.log(error);

      $q.loading.hide();
    });
};
onMounted(() => {
  //   getCodesFunc();
  // console.log(codes);
});

const formData = reactive({
  name: null,
  description: null,
  price: 0,
  qty: 0,
  sale: false,
  sale_price: 0,
  img: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
src/stores/branch/productStores
