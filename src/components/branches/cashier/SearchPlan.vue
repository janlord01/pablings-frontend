<template>
  <q-card style="max-width: 720px; width: 720px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Search Plan </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="col-12 q-mr-sm">
            <q-input
              filled
              v-model="searchProduct"
              label="Search Plan"
              class="col-3 full-width"
              type="text"
              @keyup="searchMemberFunc"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="row relative-position q-mt-lg">
            <q-card
              class="my-card col-3 q-mr-sm q-mb-sm"
              v-for="item in productStore.rowDatasPlan"
              :key="item.id"
              style="width: auto"
            >
              <!-- <img :src="item.product_img" width="100" /> -->

              <q-card-section class="block full-width" style="width: 100%">
                <div class="text-h6">{{ item.name }}</div>
                <div class="text-subtitle2">{{ item.description }}</div>
                <div class="text-subtitle3">
                  <span> P{{ item.price }}</span>
                </div>
                <q-btn
                  unelevated
                  label="Add"
                  class="text-center"
                  color="primary"
                  @click="addProduct(item.id)"
                  size="md"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- <q-table
          :pagination="pagination"
          class="q-pa-sm"
          :rows="productStore.rowDatas"
          :columns="columns"
          row-key="id"
          separator="cell"
          :visible-columns="
            $q.screen.gt.xs
              ? ['id', 'name', 'description', 'price', 'qty', 'action']
              : ['id', 'name', 'description', 'price', 'qty', 'action']
          "
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td key="id" :props="props">
                {{ props.row.id }}
              </q-td>

              <q-td key="name" :props="props">
                {{ props.row.title }}
              </q-td>
              <q-td key="description" :props="props">
                {{ props.row.description }}
              </q-td>
              <q-td key="price" :props="props">
                <span v-if="props.row.sale == true"
                  ><span class="text-strike" style="margin-right: 2px"
                    >P{{ props.row.price }}</span
                  >P{{ props.row.sale_price }}</span
                >
                <span v-else> P{{ props.row.price }}</span>
              </q-td>
              <q-td key="qty" :props="props">
                {{ props.row.qty }}
              </q-td>

              <q-td key="action" :props="props">
                <q-btn
                  color="blue"
                  icon="edit"
                  size="sm"
                  @click="EditDialog(props.row.id)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table> -->

        <!-- <div class="row align-center">
          <q-btn
            unelevated
            label="Add"
            class="text-center"
            color="primary"
            size="md"
            type="submit"
          />
        </div> -->
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
import { useRoute } from "vue-router";
const route = useRoute();

const emit = defineEmits(["hideCreateDialog"]);

const newToken = ref(LocalStorage.getItem("jwt"));
const allMembers = reactive([]);
const filterMember = reactive({});

const searchProduct = ref(null);
const seletedMember = ref(null);
const searchVisible = ref(false);
const status = ref(null);

const productStore = useProductDatas();

const $q = useQuasar();

// const getCodesFunc = () => {
//   Object.entries(codesStore.rowDatas).map(([key, val]) => {
//     codes.push({
//       label: val.code,
//       value: val.id,
//     });
//   });
// };

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
        emit("hideCreateDialog");
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
      "/api/products",
      {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        qty: formData.qty,
        sale: formData.sale,
        sale_price: formData.sale_price,
        branch_id: route.params.id,
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
          productStore.getAllProducts(route.params.id);
          emit("hideCreateDialog");
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
};
onMounted(() => {
  //   getMembers();
  productStore.getAllProducts(route.params.id);
  productStore.getAllPlans();
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
