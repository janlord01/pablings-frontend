<template>
  <q-card style="max-width: 700px; width: 700px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10' : 'bg-blue text-white'
      "
    >
      <q-toolbar-title> Select Product </q-toolbar-title>
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
              $q.screen.gt.xs ? 'col-md-12 q-mb-md ' : 'full-width q-mb-md'
            "
          >
            <q-select
              filled
              v-model="formData.product"
              use-input
              input-debounce="0"
              label="Search Product"
              class="q-mb-md"
              :options="options"
              @filter="filterFn"
              @update:model-value="getProduct"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <div
              :class="
                $q.screen.gt.xs ? 'col-md-4 q-mb-md' : 'col-sm-1 full-width'
              "
              :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
            >
              <q-input
                filled
                label="MSRP"
                name="code"
                readonly
                class="col-3 full-width"
                type="text"
                v-model="formData.msrp"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_money" />
                </template>
              </q-input>
            </div>
            <div
              :class="
                $q.screen.gt.xs ? 'col-md-4 q-mb-md' : 'col-sm-1 full-width'
              "
              :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
            >
              <q-input
                filled
                label="SRP"
                class="col-3 full-width"
                readonly
                v-model="formData.srp"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_money" />
                </template>
              </q-input>
            </div>
            <!-- <div
              :class="$q.screen.gt.xs ? 'full-width ' : ' full-width'"
              :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
            >
              <q-input
                filled
                label="Purchase Price"
                name="code"
                type="text"
                v-model="formData.purchase_price"
                :rules="[(val) => !!val || 'Price Price is required']"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_money" />
                </template>
              </q-input>
            </div> -->
            <div
              :class="$q.screen.gt.xs ? 'col-md-3' : 'col-sm-1 full-width'"
              :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
            >
              <q-input
                filled
                label="Qty"
                class="col-3 full-width"
                v-model="formData.qty"
                @keyup="checkQty"
                :rules="[(val) => !!val || 'Qty is required']"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_money" />
                </template>
              </q-input>
            </div>
            <!-- <div
              :class="
                $q.screen.gt.xs ? 'col-md-4 q-mb-md' : 'col-sm-1 full-width'
              "
              :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
            >
              <q-input
                filled
                v-model="formData.mfg"
                label="Manufacturing Date(MFG)"
                mask="date"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="formData.mfg">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div> -->
            <!-- <div
              :class="$q.screen.gt.xs ? 'col-md-4' : 'col-sm-1 full-width'"
              :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
            >
              <q-input
                filled
                v-model="formData.exp"
                label="Expiration Date(exp)"
                mask="date"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="formData.exp">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div> -->
          </div>
        </div>

        <div class="row align-center">
          <q-btn
            unelevated
            label="Create"
            class="text-center"
            :class="$q.screen.gt.xs ? '' : 'q-mt-md'"
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
import { useSupplyData } from "stores/supplies/supplyStore";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage, date } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";

import { useOrderData } from "stores/order/orderStore.js";

const orderStore = useOrderData();

const route = useRoute();

const emit = defineEmits(["hideSelectDialog"]);

const supplyStore = useSupplyData();

const stringOptions = reactive([]);

const checkQty = () => {
  if (parseFloat(formData.qty) > parseFloat(formData.product.remaining_qty)) {
    $q.notify({
      position: "top",
      type: "negative",
      timeout: 3000,
      message: "Stock insuficient!",
    });
    formData.qty = null;
  }
};

const getProduct = async () => {
  var newToken = LocalStorage.getItem("jwt");
  if (formData.product === null || formData.product === "") {
    formData.msrp = null;
    formData.srp = null;
  }

  // const selectPrd = orderStore.rowTempProducts.find(
  //   (product) => product.id === formData.product.value
  // );
  await api
    .get(`api/${route.params.slug}/products/${formData.product.value}/edit`, {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      // console.log(response);
      formData.srp = response.data.data.price;
      formData.msrp = response.data.data.msrp;
      // Object.entries(response.data.data).map(([key, val]) => {
      //   stringOptions.push({
      //     label: val.title,
      //     value: val.id,
      //   });
      //   options.value = stringOptions;
      // });
    })
    .catch((error) => {
      console.log(error);
    });
};

const getAllProducts = async () => {
  var newToken = LocalStorage.getItem("jwt");
  await api
    .get(`api/${route.params.slug}/orders/products`, {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      console.log(response);
      Object.entries(response.data.data).map(([key, val]) => {
        stringOptions.push({
          label:
            val.title +
            " - Remaining Stocks: " +
            val.remaining_qty +
            "(Order Date:" +
            date.formatDate(val.order_date, "MMMM DD, YYYY") +
            ")",
          value: val.id,
          remaining_qty: val.remaining_qty,
          inventory_id: val.inventory_id,
          inventory_product_id: val.inventory_product_id,
        });
        options.value = stringOptions;
      });
    })
    .catch((error) => {
      console.log(error);
    });
  //   console.log(this.rowDatas);
};

const options = ref(null);

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      options.value = stringOptions;

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
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
  if (
    orderStore.rowTempProducts.some(
      (product) =>
        product.id === formData.product.value &&
        product.inventory_id === formData.product.inventory_id
    )
  ) {
    $q.notify({
      position: "top",
      type: "negative",
      timeout: 3000,
      message: "Product Inventory already in the list!",
    });
  } else {
    formData.id = formData.product.value;
    formData.remaining_qty = formData.qty;
    formData.inventory_id = formData.product.inventory_id;
    formData.order_product_id = null;
    formData.inventory_product_id = formData.product.inventory_product_id;
    orderStore.addProductOnCreateOrder(formData);
    emit("hideSelectDialog");
  }
};
onMounted(() => {
  getAllProducts();
  //   getCodesFunc();
  // console.log(codes);
});

const formData = reactive({
  id: null,
  product: null,
  msrp: null,
  srp: null,
  purchase_price: null,
  qty: null,
  remaining_qty: null,
  mfg: null,
  exp: null,
  inventory_id: null,
  inventory_product_id: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
