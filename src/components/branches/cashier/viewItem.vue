<template>
  <q-card style="max-width: 500px; width: 500px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-blue text-white">
      <q-toolbar-title> View Item </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-table
        :pagination="pagination"
        :rows="items"
        :columns="columns"
        flat
        :loading="loading"
        row-key="id"
        separator="none"
        hide-pagination
        :visible-columns="$q.screen.gt.xs ? ['name', 'qty'] : ['name', 'qty']"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template #body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name != null ? props.row.name : props.row.title }}
            </q-td>
            <q-td key="qty" :props="props">
              {{ props.row.qty }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <!-- <div v-for="(val, index) in items" :key="index">
        <span>{{
          val.name != null
            ? val.name + " (" + val.qty + ")"
            : val.title + " (" + val.qty + ")"
        }}</span>
      </div> -->
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
const loading = ref(true);
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
      // console.log(response);

      setTimeout(() => {
        Object.entries(response.data.data).map(([key, val]) => {
          // console.log(item.name);
          items.push({
            id: val.id,
            name: val.service_name,
            title: val.title,
            qty: val.qty,
          });
        });
        loading.value = false;
      }, 500);

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

const pagination = reactive({
  sortBy: "name",
  rowsPerPage: 0,
});
const columns = reactive([
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
  },
  {
    name: "qty",
    label: "Qty",
    field: "qty",
    align: "left",
  },
]);

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
