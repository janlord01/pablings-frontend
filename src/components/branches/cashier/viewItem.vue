<template>
  <q-card style="max-width: 500px; width: 500px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-blue text-white">
      <q-toolbar-title> View Item </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <div v-for="(val, index) in items" :key="index">
        <span>{{
          val.name != null ? val.name : val.title + " (" + val.qty + ")"
        }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeMount, computed, watch } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";
import searchProduct from "components/branches/cashier/SearchProduct.vue";
import CheckoutDialog from "./CheckoutDialog.vue";
import searchPlan from "components/branches/cashier/SearchPlan.vue";
const route = useRoute();

const emit = defineEmits(["hideCreateDialog"]);
const props = defineProps(["paymentId"]);

const newToken = ref(LocalStorage.getItem("jwt"));
const allMembers = reactive([]);
const filterMember = reactive({});

const items = reactive([
  //   {
  //     id: null,
  //     name: null,
  //     title: null,
  //     qty: null,
  //   },
]);

const searchMember = ref(null);
const seletedMember = ref(null);
const searchVisible = ref(false);
const showCheckoutDialog = ref(false);
const status = ref(null);

const productStore = useProductDatas();

const getItem = async () => {
  await api
    .get("/api/payment/item/" + props.paymentId, {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      console.log(response);
      Object.entries(response.data.data).map(([key, val]) => {
        // console.log(item.name);
        items.push({
          id: val.id,
          name: val.service_name,
          title: val.title,
          qty: val.qty,
        });
      });

      // console.log(items);
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  getItem();
  //   getCodesFunc();
  // console.log(codes);
});

const memberToggle = ref(true);
const guestName = ref(null);
const formData = reactive({
  name: null,
  description: null,
  price: 0,
  qty: 0,
  sale: false,
  sale_price: 0,
  guestName: 0,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
<!-- src/stores/branch/productStores -->
