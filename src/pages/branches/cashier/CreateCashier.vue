<template>
  <q-page class="">
    <div
      :class="
        $q.dark.isActive
          ? 'shadow-1  rounded-borders text-white bg-dark '
          : 'shadow-1  rounded-borders text-dark bg-white '
      "
      style="border-radius: 20px"
    >
      <q-toolbar class="q-mt-sm">
        <q-toolbar-title
          :class="$q.screen.gt.xs ? ' full-width  text-h6' : 'hidden'"
          >{{ mainStore.loc }}
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section>
        <q-form
          class="column shawdow full-width block"
          :class="$q.screen.gt.xs ? '' : ''"
          ref="formName"
          @submit="onSubmit"
        >
          <q-tabs
            v-model="tab"
            no-caps
            align="left"
            inline-label
            indicator-color="transparent"
            active-color="white"
            :style="$q.screen.gt.xs ? 'margin-left: 20px;' : ''"
            :class="
              $q.dark.isActive
                ? 'text-grey-4 bg-blue-grey-10'
                : 'text-grey-4 bg-white'
            "
          >
            <q-tab
              name="services"
              class="bg-blue text-white"
              icon="content_cut"
              label="Services"
              @click="clearSearch"
            />
            <q-tab
              name="products"
              class="bg-blue text-white"
              icon="fastfood"
              label="Products"
              @click="clearSearch"
            />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="services">
              <div class="row q-col-gutter-none relative-position">
                <div class="col-12 q-mr-sm">
                  <q-input
                    filled
                    v-model="searchProduct"
                    label="Search Service"
                    class="col-3 full-width"
                    type="text"
                    @keyup="searchItem('services')"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="row relative-position q-mt-lg full-width">
                  <div
                    v-for="item in serviceStore.rowDatas"
                    :key="item.id"
                    :class="$q.screen.gt.sm ? '' : 'full-width'"
                  >
                    <q-card
                      flat
                      ripple
                      bordered
                      v-if="item.status == 1"
                      class="q-mr-sm q-mb-sm"
                      :style="
                        $q.screen.gt.sm
                          ? 'min-width: 100px; width: 200px'
                          : 'width: 99%'
                      "
                    >
                      <div
                        @click="AddToCheckout(item.id, 'services')"
                        style="cursor: pointer"
                      >
                        <q-img
                          :src="item.image"
                          :height="$q.screen.gt.xs ? '180px' : '120px'"
                        />
                        <q-card-section>
                          <div class="row no-wrap items-center">
                            <div
                              :style="
                                $q.screen.gt.xs
                                  ? 'font-size: 16px; font-weight:bold'
                                  : 'font-size: 10px; font-weight:bold'
                              "
                              class="col ellipsis"
                            >
                              {{ item.service_name }}
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
                          <div
                            :style="
                              $q.screen.gt.xs
                                ? 'font-size: 14px;'
                                : 'font-size: 10px;'
                            "
                          >
                            P{{ item.service_price }}
                          </div>
                          <!-- <div class="text-caption text-grey">
                        {{ item.service_descr }}
                      </div> -->
                          <!-- <div class="text-caption text-grey">
                        Qty: {{ item.qty_remaining }}
                      </div> -->
                        </q-card-section>
                      </div>
                      <q-separator />

                      <q-card-actions v-if="$q.screen.gt.xs">
                        <!-- <q-btn flat round icon="event" /> -->
                        <q-btn
                          color="blue"
                          class="full-width"
                          icon="o_shopping_cart"
                          :size="$q.screen.gt.xs ? 'md' : 'sm'"
                          @click="AddToCheckout(item.id, 'services')"
                        >
                          Add to cart
                        </q-btn>
                      </q-card-actions>
                    </q-card>
                  </div>

                  <!-- </q-card> -->
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="products">
              <div class="row q-col-gutter-none relative-position">
                <div class="col-12 q-mr-sm">
                  <q-input
                    filled
                    v-model="searchProduct"
                    label="Search Product"
                    class="col-3 full-width"
                    type="text"
                    @keyup="searchItem('products')"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div
                  class="row relative-position q-mt-lg"
                  v-for="item in productStores.rowBranchProductDatas"
                  :key="item.id"
                >
                  <q-card
                    flat
                    ripple
                    bordered
                    class="my-card col-3 q-mr-sm q-mb-sm"
                    v-if="item.qty !== 0"
                    :style="
                      $q.screen.gt.md
                        ? 'min-width: 100px; width: 200px'
                        : 'width: 46%'
                    "
                  >
                    <div
                      @click="AddToCheckout(item.id, 'products')"
                      style="cursor: pointer"
                    >
                      <q-img
                        :src="item.product_img"
                        :height="$q.screen.gt.xs ? '180px' : '120px'"
                      />
                      <q-card-section>
                        <div class="row no-wrap items-center">
                          <div
                            :style="
                              $q.screen.gt.xs
                                ? 'font-size: 16px; font-weight:bold'
                                : 'font-size: 10px; font-weight:bold'
                            "
                            class="col ellipsis"
                          >
                            {{ item.title }}
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
                        <div
                          :style="
                            $q.screen.gt.xs
                              ? 'font-size: 14px; '
                              : 'font-size: 10px; '
                          "
                        >
                          P{{ item.price }}
                        </div>
                        <!-- <div class="text-caption text-grey">
                        {{ item.description }}
                      </div> -->
                        <div
                          :style="
                            $q.screen.gt.xs
                              ? 'font-size: 14px; '
                              : 'font-size: 10px; '
                          "
                        >
                          Qty: {{ item.qty }}
                        </div>
                      </q-card-section>

                      <q-separator />
                    </div>
                    <div>
                      <q-card-actions v-if="$q.screen.gt.xs">
                        <!-- <q-btn flat round icon="event" /> -->
                        <q-btn
                          color="blue"
                          class="full-width"
                          icon="o_shopping_cart"
                          :size="$q.screen.gt.xs ? 'md' : 'sm'"
                          @click="AddToCheckout(item.id, 'products')"
                        >
                          Add to cart
                        </q-btn>
                      </q-card-actions>
                    </div>
                  </q-card>
                  <!-- </q-card> -->
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-form>
      </q-card-section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";
import { useCashierData } from "stores/branch/cashierStore";
import { useServicesData } from "stores/branch/servicesStore";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";

import { useMainStoreData } from "stores/store";
const mainStore = useMainStoreData();
const route = useRoute();

const emit = defineEmits(["hideCreateDialog"]);

const newToken = ref(LocalStorage.getItem("jwt"));
const allMembers = reactive([]);
const filterMember = reactive({});

const searchProduct = ref(null);
const seletedMember = ref(null);
const searchVisible = ref(false);
const status = ref(null);

const productStores = useProductDatas();
const cashierStore = useCashierData();
const serviceStore = useServicesData();

const $q = useQuasar();

const clearSearch = () => {
  searchProduct.value = null;
};

/***
 *
 * Add to cart function for billing
 * will pass ID to pina or state management then get
 * the necessary data for the billing
 *
 */
const AddToCart = (id) => {
  // console.log(id);
  productStores.AddToCartToCheckout(id);
};

const AddToCheckout = (id, type) => {
  // cashierStore.AddToCartToCheckout(id);
  if (type === "products") {
    const prods = productStores.rowBranchProductDatas.findIndex(
      (item) => item.id === id
    );
    const checkProds = cashierStore.rowDatas.some((item) => item.id === id);
    if (checkProds) {
      $q.notify({
        type: "negative",
        position: "bottom",
        timeout: 3000,
        message: "Item already in the cart!",
      });
    } else {
      cashierStore.AddToCartToCheckout([
        productStores.rowBranchProductDatas[prods],
        type,
      ]);
    }
  } else {
    const serv = serviceStore.rowDatas.findIndex((item) => item.id === id);

    const checkProds = cashierStore.rowDatas.some((item) => item.id === id);
    if (checkProds) {
      $q.notify({
        type: "negative",
        position: "bottom",
        timeout: 3000,
        message: "Item already in the cart!",
      });
    } else {
      cashierStore.AddToCartToCheckout([serviceStore.rowDatas[serv], type]);
    }
  }
};

// const getCodesFunc = () => {
//   Object.entries(codesStore.rowDatas).map(([key, val]) => {
//     codes.push({
//       label: val.code,
//       value: val.id,
//     });
//   });
// };
const tab = ref("services");

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

  //   productStores.tempCashierPlanDatas.forEach((element) => {
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
        productStores.addPlanCashier(response.data.data);
      }
      // this.studentSubjects = response.data.data;
      // console.log(this.studentSubjects);
    })
    .catch((error) => {
      console.log(error);
    });
  //   }
};

const searchItem = (item) => {
  if (item == "products") {
    var name = searchProduct.value;
    productStores.onSearchBranchProduct([name, route.params.id]);
  } else {
    var name = searchProduct.value;
    serviceStore.onSearch([name, route.params.id]);
  }
  // productStores.onSearchPlan(name);
  // console.log(name);
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
          productStores.getAllProducts(route.params.id);
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

const getBranch = async () => {
  api
    .get(`api/branch/${route.params.id}`, {
      headers: {
        Authorization: "Bearer " + LocalStorage.getItem("jwt"),
      },
    })
    .then((response) => {
      mainStore.loc = response.data.branch.name + " Cashier Transaction";
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
onMounted(() => {
  mainStore.loc = "Cashier Transaction";
  getBranch();
  //   getMembers();
  // productStores.getAllProducts(route.params.id);
  cashierStore.clearPos();
  serviceStore.getAllServicesBranch(route.params.id);

  setTimeout(() => {
    productStores.getAllBranchProducts(route.params.id);
    $q.loading.hide();
  }, 500);

  cashierStore.rowDatas = [];
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
<!-- src/stores/branch/productStoress -->
