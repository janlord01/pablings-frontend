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
        <q-toolbar-title
          :class="$q.screen.gt.xs ? 'text-h6' : 'text-h6 invisible'"
          >Products</q-toolbar-title
        >
        <q-input
          bottom-slots
          v-model="searchProduct"
          @keyup="onSearchSubmit($event)"
          label="Search Product"
          outlined
          class="search_input"
          :style="$q.screen.gt.xs ? '' : 'width: 150px;'"
        >
          <template v-slot:append>
            <q-icon name="search" size="sm" />
          </template>
        </q-input>
        <q-btn
          icon="add_circle"
          color="blue"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: -10px"
          :label="$q.screen.gt.xs ? 'Add Product' : 'add'"
          @click="createDialog"
        />
      </q-toolbar>
      <productList />

      <q-dialog v-model="showCreateDialog">
        <CreateProducts
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
// import { useProductData } from "stores/products/productStore";
import { useProductDatas } from "stores/branch/productStores";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import productList from "src/components/products/ListProducts.vue";
import CreateProducts from "src/components/products/CreateProducts.vue";
import { useRoute } from "vue-router";
import { useMainStoreData } from "stores/store";

const mainStore = useMainStoreData();

const route = useRoute();

// const productStore = useProductData();
const productStores = useProductDatas();

const searchProduct = ref(null);

const onSearchSubmit = ($event) => {
  productStores.onSearch([searchProduct.value, route.params.slug]);
};
const onSearchDelete = () => {
  // console.log("delete");
  productStores.onSearchDelete();
};
const onLoadAllData = () => {};

const showCreateDialog = ref(false);

const createDialog = () => {
  showCreateDialog.value = true;
};
onMounted(() => {
  productStores.getAllProducts(route.params.slug);
  // productStores.getAllBranchProducts(route.params.id);
  mainStore.loc = "Products";
  // getCodesFunc();
  // console.log(codes);
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
