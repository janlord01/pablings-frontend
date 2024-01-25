<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar class="q-mt-sm">
        <q-toolbar-title class="text-h6">Monitoring</q-toolbar-title>

        <q-btn
          icon="login"
          color="primary"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: 0px"
          :label="$q.screen.gt.xs ? 'Time-in' : ''"
          @click="checkInDialogFunc"
        />
        <q-btn
          icon="logout"
          color="red"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: 0px"
          :label="$q.screen.gt.xs ? 'Time-out' : ''"
          @click="checkOutDialogFunc"
        />
      </q-toolbar>
      <CheckList />

      <q-dialog v-model="showCheckInDialog">
        <CheckInSearch
          @hide-checkin-dialog="showCheckInDialog = !showCheckInDialog"
        />
      </q-dialog>
      <q-dialog v-model="showCheckOutDialog">
        <CheckOutSearch
          @hide-checkout-dialog="showCheckOutDialog = !showCheckOutDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useDiscountData } from "stores/branch/discountStore";

// import CreateProducts from "src/components/branches/products/CreateProducts.vue";
import { useRoute } from "vue-router";
import CheckInSearch from "src/components/branches/monitor/CheckInSearch.vue";
import CheckOutSearch from "src/components/branches/monitor/CheckOutSearch.vue";
import { useMonitorData } from "src/stores/branch/monitorStore";
import CheckList from "src/components/branches/monitor/CheckList.vue";

const route = useRoute();
const discountStore = useDiscountData();

const MonitorStore = useMonitorData();

const searchUser = ref(null);
const onSearchSubmit = () => {};
const onLoadAllData = () => {};

const showCheckInDialog = ref(false);
const showCheckOutDialog = ref(false);

const checkInDialogFunc = () => {
  showCheckInDialog.value = true;
};

const checkOutDialogFunc = () => {
  showCheckOutDialog.value = true;
};
onMounted(() => {
  //   productStore.getAllProducts(route.params.id);
  // getCodesFunc();
  // console.log(codes);
  MonitorStore.getAllLogs(route.params.id);
  discountStore.getAllDiscounts(route.params.id);
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
src/stores/branch/productStores
