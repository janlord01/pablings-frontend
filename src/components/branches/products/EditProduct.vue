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
            label="Update"
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
const props = defineProps(["productId"]);

const emit = defineEmits(["hideEditDialog"]);

const productStore = useProductDatas();

const $q = useQuasar();

const getProduct = () => {
  var newToken = LocalStorage.getItem("jwt");
  api
    .get("/api/products/" + props.productId + "/edit", {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      // console.log(response);
      formData.name = response.data.data.title;
      formData.description = response.data.data.description;
      formData.price = response.data.data.price;
      formData.qty = response.data.data.qty;
      formData.sale = JSON.parse(response.data.data.sale);
      formData.sale_price = response.data.data.sale_price;
      formData.temp_img = response.data.img;
    })
    .catch((error) => {
      console.log(error);
    });
};

const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  let fileDat = new FormData();

  if (formData.img != null) {
    fileDat.append("img", formData.img[0]);
  }
  fileDat.append("temp_img", formData.temp_img);
  fileDat.append("name", formData.name);
  fileDat.append("description", formData.description);
  fileDat.append("price", formData.price);
  fileDat.append("qty", formData.qty);
  fileDat.append("sale", formData.sale);
  fileDat.append("sale_price", formData.sale_price);
  fileDat.append("branch_id", route.params.id);
  fileDat.append("_method", "PATCH");

  // console.log(fileDat);

  api
    .post(
      "/api/products/" + props.productId,
      fileDat,
      // {
      //   name: formData.name,
      //   description: formData.description,
      //   price: formData.price,
      //   qty: formData.qty,
      //   sale: formData.sale,
      //   sale_price: formData.sale_price,
      //   branch_id: route.params.id,
      // },
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
          productStore.getAllProducts(route.params.id);
          emit("hideEditDialog");
        }, 2000);
      } else {
        setTimeout(() => {
          $q.loading.hide();
          $q.notify({
            type: "negative",
            icon: "error",
            timeout: 5000,
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
  getProduct();
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
  temp_img: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
src/stores/branch/productStores
