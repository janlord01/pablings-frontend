<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10' : 'bg-blue text-white'
      "
    >
      <q-toolbar-title> Update Product </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-5 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              label="Product Name*"
              name="code"
              class="full-width"
              type="text"
              v-model="formData.name"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="fastfood" />
              </template>
            </q-input>
          </div>
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-2 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              label="MSRP*"
              name="code"
              class="col-3full-width"
              type="text"
              v-model="formData.msrp"
              :rules="[(val) => !!val || 'Price is required']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-2 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              label="SRP*"
              name="code"
              class="col-3full-width"
              type="text"
              v-model="formData.price"
              :rules="[(val) => !!val || 'Price is required']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-2 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              label="SKU*"
              class="col-3 full-width"
              v-model="formData.sku"
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
          <div
            :class="$q.screen.gt.xs ? 'col-md-5 q-mr-sm' : 'col-sm-1'"
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-file
              filled
              class="q-mr-sm col-3 full-width"
              type="file"
              label="Change Image"
              v-model="formData.img"
            >
              <template v-slot:before>
                <q-avatar
                  v-if="formData.img !== null && formData.img === oldImage"
                >
                  <img :src="formData.img" />
                </q-avatar>
                <!-- <q-avatar v-else-if="formData.img !== oldImage" color="grey">
                  <q-icon name="image" color="white" />
                </q-avatar> -->
                <!-- -->
                <q-avatar v-else color="grey">
                  <q-icon name="image" color="white" />
                </q-avatar>
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="formData.img !== null"
                  name="close"
                  @click.stop.prevent="formData.img = null"
                  class="cursor-pointer"
                />
                <q-icon name="image" @click.stop.prevent />
              </template>
            </q-file>
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

const emit = defineEmits(["hideEditDialog"]);

const props = defineProps(["productId"]);

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
const getProduct = () => {
  var newToken = LocalStorage.getItem("jwt");
  api
    .get(`/api/${route.params.slug}/products/${props.productId}/edit`, {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      // console.log(response);
      formData.name = response.data.data.title;
      formData.description = response.data.data.description;
      formData.price = response.data.data.price;
      formData.sku = response.data.data.sku;
      formData.msrp = response.data.data.msrp;
      formData.img = response.data.img;
      oldImage.value = response.data.img;
    })
    .catch((error) => {
      console.log(error);
    });
};
const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();

  var fileData = new FormData();
  // if (formData.img != null) {
  //   fileData.append("img", formData.img[0]);
  // }
  fileData.append("img", formData.img != null ? formData.img : null);
  fileData.append("name", formData.name);
  fileData.append("description", formData.description);
  fileData.append("price", formData.price);
  fileData.append("msrp", formData.msrp);
  fileData.append("sku", formData.sku);
  fileData.append("type", "Product");
  fileData.append("_method", "PATCH");

  api
    .post(`/api/${route.params.slug}/products/${props.productId}`, fileData, {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      // console.log(response);
      // console.log(formData.img);
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
          productStore.getAllProducts(route.params.slug);
          emit("hideEditDialog");
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
  getProduct();
  // console.log(codes);
});

const oldImage = ref(null);

const formData = reactive({
  name: null,
  description: null,
  price: null,
  msrp: null,
  sku: null,
  //   sale: false,
  //   sale_price: 0,
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
