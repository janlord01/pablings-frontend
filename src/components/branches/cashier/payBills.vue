<template>
  <q-card style="max-width: 500px; width: 500px; min-height: 300px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-blue text-white">
      <q-toolbar-title> Checkout </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        @submit="onSubmit"
        ref="formName"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="col-12 q-mr-sm">
            <q-input
              filled
              label="Total"
              readonly
              name="code"
              class="full-width q-mb-sm"
              type="text"
              v-model="cashierStore.total"
            >
              <template v-slot:prepend>
                <q-icon name="currency_ruble" />
              </template>
            </q-input>
            <q-input
              filled
              label="Cash Entered"
              name="code"
              class="full-width q-mb-sm"
              type="text"
              @keyup="cashEntereFunc"
              v-model="cashierStore.cash"
            >
              <template v-slot:prepend>
                <q-icon name="currency_ruble" />
              </template>
            </q-input>
            <q-input
              filled
              label="Change"
              readonly
              name="code"
              class="full-width q-mb-sm"
              type="text"
              v-model="cashierStore.change"
            >
              <template v-slot:prepend>
                <q-icon name="currency_ruble" />
              </template>
            </q-input>
            <q-input
              filled
              label="Remarks(you can add OR here)"
              name="code"
              class="full-width"
              type="textarea"
              v-model="cashierStore.remarks"
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>
            <q-btn
              unelevated
              label="Pay"
              class="text-center q-mt-lg"
              color="blue"
              size="md"
              type="submit"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";
import { useDiscountData } from "stores/branch/discountStore";
import { useCashierData } from "stores/branch/cashierStore";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute, useRouter } from "vue-router";
// import router from "src/router";
const route = useRoute();
const router = useRouter();

const emit = defineEmits(["hideDiscountDialog"]);

const discountStore = useDiscountData();

const newToken = ref(LocalStorage.getItem("jwt"));
const allMembers = reactive([]);
const filterMember = reactive({});

const searchProduct = ref(null);
const seletedMember = ref(null);
const searchVisible = ref(false);
const status = ref(null);

const productStore = useProductDatas();
const cashierStore = useCashierData();

const $q = useQuasar();
const stringOptions = reactive([]);

const options = ref(null);

const discount = ref(null);
const getBranchDiscounts = async () => {
  const newToken = LocalStorage.getItem("jwt");
  await api
    .get("api/discount/" + route.params.id, {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      // console.log(response);
      Object.entries(response.data.data).map(([key, val]) => {
        stringOptions.push({
          value: val.id,
          label: val.description,
          id: val.id,
          description: val.description,
          number: val.number,
          type: val.type,
        });
      });

      // stringOptions.response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
const cashEntereFunc = () => {
  cashierStore.cashCalcute();
};
const AddDiscount = () => {
  if (discount.value != null) {
    cashierStore.applyDiscount(discount.value);
    emit("hidePayDialog");
  } else {
    $q.notify({
      type: "negative",
      position: "top",
      timeout: 3000,
      message: "Please select discount",
    });
  }
};

const pagination = reactive({
  sortBy: "id",
  rowsPerPage: 20,
});
const columns = reactive([
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "name",
    label: "Product/Plan Name",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left",
    sortable: true,
  },
  {
    name: "price",
    label: "Price",
    field: "price",
    align: "left",
    sortable: true,
  },
  {
    name: "qty",
    label: "Quantity",
    field: "qty",
    align: "left",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
]);

const addProduct = async (product_id) => {
  // console.log(this.courseId);
  //   let a = 0;

  //   productStore.tempCashierPlanDatas.forEach((element) => {
  //     // console.log(element);
  //     if (element.id == product_id) {
  //       // console.log("error");
  //       a++;
  //       $q.notify({
  //         type: "negative",
  //         color: "negative",
  //         timeout: 3000,
  //         position: "top",
  //         message: "Already Added on the list!",
  //       });
  //       return;
  //     }
  //   });
  //   if (a >= 1) {
  //     return false;
  //   } else {
  await api
    .get(
      "/api/products/add/plan/" + product_id,
      {
        params: {
          branch_id: route.params.id,
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
      if (response.data.status == 404) {
        setTimeout(() => {
          $q.notify({
            type: "negative",
            color: "negative",
            timeout: 3000,
            position: "top",
            message: response.data.message,
          });
        }, 100);
      } else {
        setTimeout(() => {
          $q.notify({
            type: "positive",
            color: "positive",
            timeout: 3000,
            position: "top",
            message: response.data.message,
          });
        }, 100);
        emit("hidePayDialog");
        productStore.addPlanCashier(response.data.data);
      }
      // this.studentSubjects = response.data.data;
      // console.log(this.studentSubjects);
    })
    .catch((error) => {
      console.log(error);
    });
  //   }
};

const searchMemberFunc = () => {
  var name = searchProduct.value;
  productStore.onSearchPlan(name);
  //   console.log(name);
};

const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  api
    .post(
      "/api/branch/cashier/store",
      {
        items: cashierStore.rowDatas,
        branch: route.params.id,
        subTotal: cashierStore.subTotal,
        total: cashierStore.total,
        totalDiscount: cashierStore.totalDiscount,
        discount_id: cashierStore.discountId,
        cash: cashierStore.cash,
        change: cashierStore.change,
        remarks: cashierStore.remarks,
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
          // productStore.getAllProducts(route.params.id);
          emit("hidePayDialog");
          router.go(-1);
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
        }, 3000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
onMounted(() => {
  //   getMembers();
  // productStore.getAllProducts(route.params.id);
  // productStore.getAllPlans();
  cashierStore.cash = "";
  cashierStore.change = 0;
  cashierStore.remarks = "";
  getBranchDiscounts();
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
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
<!-- src/stores/branch/productStores -->
