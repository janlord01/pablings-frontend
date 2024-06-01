<template>
  <q-card style="max-width: 500px; width: 500px; min-height: 300px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-blue text-white">
      <q-toolbar-title> Select User for validation </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <div class="full-width q-pa-md">
        <q-select
          filled
          v-model="selectUser"
          use-input
          input-debounce="0"
          label="Select Admin For Validation"
          :options="options"
          @filter="filterFn"
          behavior="menu"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-select>
        <q-input
          color="teal"
          v-if="selectUser"
          class="q-mt-sm"
          filled
          type="password"
          v-model="password"
          label="Enter Password"
        >
          <template v-slot:prepend>
            <q-icon name="password" />
          </template>
        </q-input>
        <q-btn
          unelevated
          label="Void"
          class="text-center q-mt-md"
          @click="VoidFunc"
          color="red"
          icon="delete"
          size="md"
          type="button"
        />
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeMount, computed, watch } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";

import { useCashierData } from "src/stores/branch/cashierStore";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";
import searchProduct from "components/branches/cashier/SearchProduct.vue";
import CheckoutDialog from "./CheckoutDialog.vue";
import searchPlan from "components/branches/cashier/SearchPlan.vue";
const route = useRoute();
const password = ref("");
const emit = defineEmits(["hideViewDialog"]);
const props = defineProps(["paymentId"]);
const $q = useQuasar();
const newToken = ref(LocalStorage.getItem("jwt"));
const allMembers = reactive([]);
const filterMember = reactive({});
const stringOptions = reactive([]);
const options = ref(stringOptions);
const selectUser = ref("");
const cashierStore = useCashierData();
const productStore = useProductDatas();
const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      options.value = stringOptions;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = stringOptions.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};
const VoidFunc = () => {
  if (selectUser.value === "") {
    $q.notify({
      type: "negative",
      position: "top",
      timeout: 3000,
      message: "Please select user!",
    });
  } else if (password.value === "") {
    $q.notify({
      type: "negative",
      position: "top",
      timeout: 3000,
      message: "Please enter password!",
    });
  } else {
    $q.loading.show();
    api
      .delete(
        `/api/branch/cashier/void/${props.paymentId}`,
        {
          params: {
            user: selectUser.value ? selectUser.value.value : selectUser.value,
            password: password.value,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + newToken.value,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.status === 200) {
          setTimeout(() => {
            $q.notify({
              type: "positive",
              position: "top",
              timeout: 3000,
              message: response.data.message,
            });

            cashierStore.getAllBranchPaymentTransaction(route.params.id);
            emit("hideViewDialog");
            $q.loading.hide();
          }, 1000);
        } else {
          setTimeout(() => {
            $q.notify({
              type: "negative",
              position: "top",
              timeout: 3000,
              message: response.data.message,
            });
            $q.loading.hide();
          }, 3000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
const items = reactive([]);

const searchMember = ref(null);
const seletedMember = ref(null);
const searchVisible = ref(false);
const showCheckoutDialog = ref(false);
const status = ref(null);

const getItem = async () => {
  await api
    .get("/api/branch/cashier/void/admin/" + route.params.slug, {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      console.log(response);
      Object.entries(response.data.data).map(([key, val]) => {
        stringOptions.push({
          value: val.id,
          label: val.name,
        });
      });
      Object.entries(response.data.managers).map(([key, val]) => {
        stringOptions.push({
          value: val.id,
          label: val.name,
        });
      });
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
