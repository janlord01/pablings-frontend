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
          :class="$q.screen.gt.xs ? ' full-width  text-h6' : 'hidden'"
          >{{ mainStore.loc }}
        </q-toolbar-title>

        <q-btn
          icon="add_circle"
          color="blue"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: 0px"
          :label="$q.screen.gt.xs ? 'Create Discount' : 'Create'"
          @click="createDialog"
        />
      </q-toolbar>
      <discountList />

      <q-dialog v-model="showCreateDialog">
        <CreateDiscount
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";
import { useQuasar, LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import discountList from "src/components/branches/discount/DiscountList.vue";
import { useRoute } from "vue-router";
import CreateDiscount from "src/components/branches/discount/CreateDiscount.vue";
import { useDiscountData } from "stores/branch/discountStore";
import { useMainStoreData } from "stores/store";
const mainStore = useMainStoreData();

const discountStore = useDiscountData();
const route = useRoute();

const productStore = useProductDatas();

const searchUser = ref(null);
const onSearchSubmit = () => {};
const onLoadAllData = () => {};

const showCreateDialog = ref(false);
const showImportDialog = ref(false);

const createDialog = () => {
  showCreateDialog.value = true;
};
const ImportDialog = () => {
  showImportDialog.value = true;
};

const getBranch = async () => {
  api
    .get(`api/branch/${route.params.id}`, {
      headers: {
        Authorization: "Bearer " + LocalStorage.getItem("jwt"),
      },
    })
    .then((response) => {
      mainStore.loc = response.data.branch.name + " Voucher";
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
onMounted(() => {
  //   productStore.getAllProducts(route.params.id);
  mainStore.loc = "Product";
  getBranch();
  discountStore.getAllDiscounts(route.params.id);

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
src/stores/branch/productStores
