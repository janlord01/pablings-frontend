<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10' : 'bg-blue text-white'
      "
    >
      <q-toolbar-title> Select Company </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'full-width q-mb-md' : 'full-width'">
            <q-select
              filled
              v-model="company"
              use-input
              input-debounce="0"
              label="Search Company"
              :options="options"
              @filter="filterFn"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div :class="$q.screen.gt.xs ? 'col-5 q-mr-sm ' : 'full-width'">
            <q-input
              filled
              v-model="startDate"
              label="Start Date"
              mask="date"
              :rules="['date']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="startDate">
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
          </div>
          <div :class="$q.screen.gt.xs ? 'col-5' : 'full-width'">
            <q-input
              filled
              v-model="endDate"
              label="End Date"
              mask="date"
              :rules="['date']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="endDate">
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
          </div>
        </div>

        <div class="row align-center">
          <q-btn
            unelevated
            label="CheckOut"
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
import { useRoute, useRouter } from "vue-router";
import { useCompanyData } from "stores/company/store";

const companyStore = useCompanyData();
const company = ref(null);
const route = useRoute();
const router = useRouter();
const props = defineProps(["companyId"]);
const emit = defineEmits(["hideEditDialog"]);

const productStore = useProductData();

const codes = reactive([]);
const $q = useQuasar();
const isPwd = ref(true);
const isPwdCon = ref(true);

let companies = reactive([]);
const endDate = ref(null);
const startDate = ref(null);
let options = ref();
const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      options.value = companies;

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = companies.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const getAllCompany = async () => {
  var newToken = LocalStorage.getItem("jwt");
  await api
    .get("api/company", {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      // console.log(response);
      Object.entries(response.data.data).map(([key, val]) => {
        companies.push({
          label: val.name,
          value: val.id,
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const onSubmit = () => {
  if (startDate.value == null || startDate.value == "") {
    $q.notify({
      type: "negative",
      icon: "error",
      timeout: 1000,
      position: "bottom",
      message: "Please Select Start Date",
    });
  } else if (endDate.value == null || endDate.value == "") {
    $q.notify({
      type: "negative",
      icon: "error",
      timeout: 1000,
      position: "bottom",
      message: "Please Select End Date",
    });
  } else {
    var newToken = LocalStorage.getItem("jwt");
    $q.loading.show();

    api
      .post(
        `/api/company/plan/store`,
        {
          // Compnay Plan Assogning
          plan: productStore.selectedPlan[1].id,
          start: startDate.value,
          end: endDate.value,
          branches: productStore.addToCartPlan.branches,
          users: productStore.addToCartPlan.users,
          // Payment Transactions
          company_name: company.value.label,
          company_id: company.value.value,
          users: productStore.addToCartPlan.users,
          sub_total: productStore.addToCartPlan.subTotal,
          discount: productStore.addToCartPlan.discount,
          total: productStore.addToCartPlan.total,
          cash: productStore.addToCartPlan.cash,
          change: productStore.addToCartPlan.change,
        },
        {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        }
      )
      .then((response) => {
        // console.log(response);
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
            // companyStore.getAllCompanies();
            router.go(-1);
            // productStore.getAllProducts();
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
  }
};
onMounted(() => {
  companyStore.getAllCompanies();
  getAllCompany();
  // getCompanyDetails();
  //   getCodesFunc();
  // console.log(codes);
});

const formData = reactive({
  name: null,
  address_detailed: null,
  contact: null,
  slug: null,
  sku: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
src/stores/branch/productStores
