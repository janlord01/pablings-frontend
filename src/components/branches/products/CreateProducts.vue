<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Create Product </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="col-5 q-mr-sm">
            <q-input
              filled
              label="Product Name*"
              name="code"
              class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
              type="text"
              v-model="formData.name"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="fastfood" />
              </template>
            </q-input>
          </div>
          <div class="col-3 q-mr-sm">
            <q-input
              filled
              label="Price*"
              name="code"
              class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
              type="text"
              v-model="formData.price"
              :rules="[(val) => !!val || 'Price is required']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>
          <div class="col-3 q-mr-sm">
            <q-input
              filled
              label="Quantity*"
              class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
              type="number"
              v-model="formData.qty"
              :rules="[(val) => !!val || 'Price is required']"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-col-gutter-none relative-position">
          <div class="col-12">
            <q-input
              filled
              label="Description*"
              class="q-mr-sm col-3 full-width"
              type="textarea"
              v-model="formData.description"
              :rules="[(val) => !!val || 'Description is required']"
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none q-mb-xl relative-position">
          <div class="col-3">
            <q-input
              filled
              label=""
              class="q-mr-sm col-3 full-width"
              type="file"
              v-model="formData.img"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
            </q-input>
          </div>
        </div>
        <q-separator color="orange" inset />
        <div class="row q-col-gutter-none relative-position">
          <q-toggle v-model="formData.sale" label="On Sale?" />
        </div>

        <div
          class="row q-col-gutter-none relative-position q-mb-lg"
          v-if="formData.sale"
        >
          <q-input
            filled
            label="Sale Price"
            class="q-mr-sm col-3"
            type="text"
            v-model="formData.sale_price"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
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
import { useProductDatas } from "src/stores/branch/productStores";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";
const route = useRoute();

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
  fileData.append("img", formData.img != null ? formData.img[0] : null);
  fileData.append("name", formData.name);
  fileData.append("description", formData.description);
  fileData.append("price", formData.price);
  fileData.append("qty", formData.qty);
  fileData.append("sale", formData.sale);
  fileData.append("sale_price", formData.sale_price);
  fileData.append("branch_id", route.params.id);
  fileData.append("_method", "POST");

  api
    .post(
      "/api/products",
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
          productStore.getAllProducts(route.params.id);
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
