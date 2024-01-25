<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Checkout </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-table
        :pagination="pagination"
        :rows="rows"
        :columns="columns"
        :rows-per-page-options="[0]"
        row-key="name"
        class="caltable"
      />
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none">
          <q-select
            filled
            :options="discount"
            v-model="formData.type"
            label="Choose Discount"
            @update:model-value="selectedDiscount"
            :class="
              $q.screen.gt.sm
                ? 'q-mr-sm full-width q-mt-md '
                : 'full-width q-mb-md'
            "
          >
            <template v-slot:prepend>
              <q-icon name="emoji_symbols" />
            </template>
          </q-select>
          <q-input
            filled
            v-model="formData.subTotal"
            label="Subtotal"
            name="code"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="text"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.cash"
            label="Cash Entered"
            name="code"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="text"
            @update:model-value="cashEntered"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="formData.change"
            label="Change"
            name="code"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="text"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>

          <!-- <q-input
            filled
            v-model="formData.number"
            :label="formData.type == 'Amount' ? 'Amount' : 'Number'"
            name="code"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="number"
          >
            <template v-slot:prepend>
              <q-icon
                :name="formData.type == 'Amount' ? 'attach_money' : 'percent'"
              />
            </template>
          </q-input> -->
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Submit"
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
import { useDiscountData } from "stores/branch/discountStore";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const emit = defineEmits(["hideCheckoutDialog"]);
const props = defineProps(["memberId", "guestName"]);

const planTotal = ref(0);
const productTotal = ref(0);
const total = ref(0);

const discount = reactive([
  // {
  //   label: "",
  //   value: "",
  // },
]);

const totalDiscount = ref(0);

const cashEntered = () => {
  formData.change = formData.cash - formData.subTotal;
};

const selectedDiscount = () => {
  // console.log(total.value);
  formData.cash = "";
  formData.change = "";
  getTotals();
  if (discount.length == 0) {
  } else {
    // console.log(formData.type.number);
    formData.subTotal =
      formData.type.type === "Percentage"
        ? total.value -
          (parseFloat(formData.type.number) / 100) * rows[2].charges
        : // ? parseFloat(formData.number / 100) * total.value
          total.value - parseFloat(formData.type.number);

    totalDiscount.value =
      formData.type.type === "Percentage"
        ? (parseFloat(formData.type.number) / 100) * rows[2].charges
        : parseFloat(formData.type.number);
  }

  // console.log(formData.type.value);
};

const getDiscount = () => {
  // console.log(discountStore.rowDatas);
  let a = 0;
  discountStore.rowDatas.map((item) => {
    discount.push({
      label: item.description,
      value: item.id,
      type: item.type,
      number: item.number,
    });
    // discount[a].label = item.description;
    // discount[a].value = item.id;
    a++;
  });

  // console.log(discount);
};

const getTotals = () => {
  console.log(props.guestName);
  planTotal.value = 0;
  productTotal.value = 0;
  total.value = 0;
  rows[0].charges = 0;
  rows[1].charges = 0;
  rows[2].charges = 0;
  if (productStore.tempCashierProductDatas.length != 0) {
    productStore.tempCashierProductDatas.map((item) => {
      productTotal.value =
        productTotal.value +
        (item.sale === "true"
          ? parseFloat(item.sale_price * item.qty)
          : parseFloat(item.price * item.qty));
      // console.log(rows[0].charges);
    });

    rows[0].charges = productTotal.value;
  }
  if (productStore.tempCashierPlanDatas.length != 0) {
    planTotal.value =
      planTotal.value + productStore.tempCashierPlanDatas[0].price;

    rows[1].charges = parseFloat(planTotal.value);
  }

  total.value = parseFloat(planTotal.value) + parseFloat(productTotal.value);
  rows[2].charges = total.value;
  // console.log(total.value);
};
const productStore = useProductDatas();
const discountStore = useDiscountData();

const $q = useQuasar();

const columns = [
  {
    name: "description",
    required: true,
    label: "Description",
    align: "left",
    field: "description",
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: "charges", align: "center", label: "Charges", field: "charges" },
  // { name: "subtotal", label: "Total", field: "subtotal" },
  // { name: "balance", label: "Balance", field: "balance" },
];

const pagination = {
  sortBy: "id",
  rowsPerPage: 10,
};

const rows = reactive([
  {
    description: "Total Product(s)",
    charges: 0,
    credit: "",
    balance: "",
  },
  {
    description: "Total Plan",
    charges: 0,
    credit: "",
    balance: "",
  },
  {
    description: "Sub-Total",
    charges: 0,
    credit: 0,
    balance: 0,
  },
]);

const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();

  if (formData.subTotal > formData.cash) {
    $q.notify({
      type: "negative",
      color: "negative",
      timeout: 3000,
      position: "top",
      message: "Cash Entered should be greater than sub-total!",
    });
    $q.loading.hide();
  } else if (formData.cash == "") {
    $q.notify({
      type: "negative",
      color: "negative",
      timeout: 3000,
      position: "top",
      message: "Cash Entered  should not be emptied!",
    });
    $q.loading.hide();
  } else {
    // let product = Object.entries(productStore.tempCashierProductDatas).map(item => {

    // });
    // console.log(product);
    // console.log("proceed");
    api
      .post(
        "/api/payment",
        {
          products: productStore.tempCashierProductDatas,
          plan: productStore.tempCashierPlanDatas,
          discount: formData.type != null ? formData.type.value : null,
          user_id: props.memberId,
          guest: props.guestName,
          branch: route.params.id,
          subTotal: rows[2].charges,
          total_discount: totalDiscount.value,
          total: formData.subTotal,
          cash_entered: formData.cash,
          change: formData.change,
        },
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
            $q.loading.hide();
            productStore.resetItem();
            productStore.getAllPayments(route.params.id);

            emit("hideCheckoutDialog");
            router.push({ name: "cashier-index" });
          }, 2000);
        } else {
          setTimeout(() => {
            $q.loading.hide();
            $q.notify({
              type: "negative",
              icon: "error",
              timeout: 3000,
              position: "bottom",
              message: response.data.message,
            });
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
onMounted(() => {
  //   getCodesFunc();
  // console.log(codes);
  getTotals();
  getDiscount();
});

const formData = reactive({
  description: null,
  type: "",
  subTotal: total,
  total: 0,
  cash: "",
  change: 0,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
<!-- src/stores/branch/productStores -->
