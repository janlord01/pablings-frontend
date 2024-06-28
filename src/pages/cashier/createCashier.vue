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
        <q-toolbar-title class="text-h6">Create Billing</q-toolbar-title>
      </q-toolbar>
      <q-card-section>
        <q-form
          class="column shawdow full-width block"
          :class="$q.screen.gt.xs ? 'q-pa-md' : ''"
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
              <!-- <q-card
                class="my-card col-3 q-mr-sm q-mb-sm"
                v-for="item in productStore.rowDatasPlan"
                :key="item.id"
                style="width: auto"
              > -->
              <!-- <img :src="item.product_img" width="100" /> -->

              <!-- <q-card-section class="block full-width" style="width: 100%">
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
                </q-card-section> -->
              <q-card
                flat
                bordered
                class="my-card col-3 q-mr-sm q-mb-sm"
                v-for="item in productStore.rowDatasPlan"
                :key="item.id"
                :style="
                  $q.screen.gt.xs
                    ? 'min-width: 100px; width: 200px'
                    : 'width: 47%'
                "
              >
                <q-img src="/images/images.jpeg" />
                <!-- <q-icon name="image" /> -->
                <q-card-section>
                  <!-- <q-btn
                    fab
                    color="primary"
                    icon="place"
                    class="absolute"
                    style="top: 0; right: 12px; transform: translateY(-50%)"
                  /> -->

                  <div class="row no-wrap items-center">
                    <div
                      :class="$q.screen.gt.xs ? 'text-h6' : 'text-subtitle2'"
                      class="col ellipsis"
                    >
                      {{ item.name }}
                    </div>
                    <div
                      class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
                    >
                      <!-- <q-icon name="place" />
                      250 ft -->
                    </div>
                  </div>

                  <!-- <q-rating v-model="stars" :max="5" size="32px" /> -->
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <div class="text-subtitle1">P{{ item.price }}</div>
                  <div class="text-caption text-grey">
                    {{ item.description }}
                  </div>
                </q-card-section>

                <q-separator />

                <q-card-actions>
                  <!-- <q-btn flat round icon="event" /> -->
                  <q-btn
                    color="blue"
                    class="full-width"
                    icon="o_shopping_cart"
                    :size="$q.screen.gt.xs ? 'md' : 'sm'"
                    @click="AddToCart(item.id)"
                  >
                    Add to cart
                  </q-btn>
                </q-card-actions>
              </q-card>
              <!-- </q-card> -->
            </div>
          </div>
        </q-form>
      </q-card-section>
    </div>
  </q-page>
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

/***
 *
 * Add to cart function for billing
 * will pass ID to pina or state management then get
 * the necessary data for the billing
 *
 */
const AddToCart = (id) => {
  // console.log(id);
  productStore.AddToCartToCheckout(id);
};

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
  // productStore.onSearchPlan(name);
  // console.log(name);
  productStore.onSearchPlan(name);
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
  // productStore.getAllProducts(route.params.id);
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
src/stores/branch/productStores
