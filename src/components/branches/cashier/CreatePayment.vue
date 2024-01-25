<template>
  <q-card style="max-width: 960px; width: 960px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Create Payment </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <span>
            <q-toggle
              v-model="memberToggle"
              color="green"
              label="Guest"
              left-label
            />Member</span
          >
          <div class="col-12 q-mr-sm">
            <q-input
              v-if="memberToggle"
              filled
              v-model="searchMember"
              label="Search Member"
              class="col-3 full-width"
              type="text"
              @click="searchVisible = true"
              @keyup="searchMemberFunc"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-list
              bordered
              separator
              class="full-width text-white z-max bg-grey-10"
              v-if="searchVisible && memberToggle"
            >
              <p
                clickable
                v-ripple
                v-for="item in filterMember"
                v-bind:key="item.id"
              >
                <q-item
                  clickable
                  v-ripple
                  v-for="member in item"
                  :key="member.id"
                  @click="selectStudent(member)"
                >
                  <q-item-section>
                    <q-item-label class="text-white">{{
                      member.name
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </p>
            </q-list>
            <q-input
              v-if="!memberToggle"
              filled
              v-model="guestName"
              label="Guest Name*"
              class="col-3 full-width"
              type="text"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>
          </div>
          <div class="col-12 q-mr-sm" v-if="status">
            Status:
            <q-chip dense>
              <q-avatar
                :color="
                  status == 'No Plan'
                    ? 'orange'
                    : status == 'Expired' || status == 'Please Assign code'
                    ? 'red'
                    : 'green'
                "
                text-color="white"
              ></q-avatar>
              {{ status }}
            </q-chip>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div style="width: 190px">
            <q-btn
              unelevated
              label="Search Product"
              class="text-center"
              color="primary"
              size="md"
              type="button"
              icon="search"
              @click="SearchProductFunc"
            />
          </div>
          <div style="width: 170px" v-if="memberToggle">
            <q-btn
              unelevated
              label="Search Plan"
              class="text-center"
              color="primary"
              size="md"
              type="button"
              icon="search"
              @click="SearchPlanFunc"
            />
          </div>
        </div>
        <q-table
          :pagination="pagination"
          class="q-pa-sm"
          :rows="productStore.tempCashierProductDatas"
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
                <span v-if="props.row.sale === 'true'"
                  ><span class="text-strike" style="margin-right: 2px"
                    >P{{ props.row.price }}</span
                  >P{{ props.row.sale_price }}</span
                >
                <span v-else> P{{ props.row.price }}</span>
                <!-- P{{ props.row.sale == true ? '<span class"text-strike">'+props.row.price+'</span>'+props.row.sale_price : props.row.price }} -->
              </q-td>
              <q-td key="qty" :props="props">
                {{ props.row.qty }}
                <q-popup-edit
                  v-model.number="props.row.qty"
                  title="Update Quantity"
                  :validate="changeQty(props.row.id, props.row.qty)"
                  buttons
                  v-slot="scope"
                >
                  <q-input
                    type="number"
                    v-model="scope.value"
                    dense
                    autofocus
                  />
                </q-popup-edit>
                <!-- <q-popup-edit
                  v-model.number="props.row.qty"
                  title="Update Quantity"
                  :validate="changeQty(props.row.id, props.row.qty)"
                  buttons
                  v-slot="scope"
                >
                  <q-input
                    filled
                    v-model="scope.value"
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
                          <q-date v-model="scope.value">
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
                </q-popup-edit> -->
              </q-td>

              <q-td key="action" :props="props">
                <q-btn
                  color="red"
                  icon="delete"
                  size="sm"
                  @click="removeProductFunc(props.row.id)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <!-- Plan Table-->
        <q-table
          v-if="memberToggle"
          :pagination="pagination2"
          class="q-pa-sm"
          :rows="productStore.tempCashierPlanDatas"
          :columns="columns2"
          row-key="id"
          separator="cell"
          :visible-columns="
            $q.screen.gt.xs
              ? ['id', 'name', 'description', 'price', 'start', 'end', 'action']
              : ['id', 'name', 'description', 'price', 'start', 'end', 'action']
          "
        >
          <template #body="props">
            <q-tr :props="props">
              <q-td key="id" :props="props">
                {{ props.row.id }}
              </q-td>

              <q-td key="name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="description" :props="props">
                {{ props.row.description }}
              </q-td>
              <q-td key="price" :props="props">
                <span> P{{ props.row.price }}</span>
                <!-- P{{ props.row.sale == true ? '<span class"text-strike">'+props.row.price+'</span>'+props.row.sale_price : props.row.price }} -->
              </q-td>

              <q-td key="start" :props="props">
                <span> {{ props.row.start }}</span>
                <q-popup-edit
                  v-model="props.row.start"
                  title="Change Start Date"
                  :validate="changeStart(props.row.id, props.row.start)"
                  buttons
                  v-slot="scope"
                >
                  <q-input
                    filled
                    v-model="scope.value"
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
                          <q-date v-model="scope.value">
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
                </q-popup-edit>
              </q-td>
              <q-td key="end" :props="props">
                <span> {{ props.row.end }}</span>
                <q-popup-edit
                  v-model="props.row.end"
                  title="Change End Date"
                  :validate="changeEnd(props.row.id, props.row.end)"
                  buttons
                  v-slot="scope"
                >
                  <q-input
                    filled
                    v-model="scope.value"
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
                          <q-date v-model="scope.value">
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
                </q-popup-edit>
              </q-td>
              <!-- <q-td key="qty" :props="props">
                {{ props.row.qty }}
                <q-popup-edit
                  v-model.number="props.row.qty"
                  title="Update Quantity"
                  :validate="changeQty(props.row.id, props.row.qty)"
                  buttons
                  v-slot="scope"
                >
                  <q-input
                    type="number"
                    v-model="scope.value"
                    dense
                    autofocus
                  />
                </q-popup-edit>
              </q-td> -->

              <q-td key="action" :props="props">
                <q-btn
                  color="red"
                  icon="delete"
                  size="sm"
                  @click="removePlanFunc(props.row.id)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <div class="row align-center q-mt-md">
          <q-btn
            unelevated
            label="Checkout"
            class="text-center"
            color="primary"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
  <!-- Search Products -->
  <q-dialog v-model="showSearchProductDialog">
    <searchProduct
      @hide-create-dialog="showSearchProductDialog = !showSearchProductDialog"
    />
  </q-dialog>

  <!-- Search Plan -->
  <q-dialog v-model="showSearchPlanDialog">
    <searchPlan
      @hide-create-dialog="showSearchPlanDialog = !showSearchPlanDialog"
    />
  </q-dialog>

  <!-- Search Products -->
  <q-dialog v-model="showCheckoutDialog">
    <CheckoutDialog
      @hide-checkout-dialog="showCheckoutDialog = !showCheckoutDialog"
      :member-id="seletedMember"
      :guest-name="formData.guestName"
    />
  </q-dialog>
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

const newToken = ref(LocalStorage.getItem("jwt"));
const allMembers = reactive([]);
const filterMember = reactive({});

const searchMember = ref(null);
const seletedMember = ref(null);
const searchVisible = ref(false);
const showCheckoutDialog = ref(false);
const status = ref(null);

const productStore = useProductDatas();

const changeQty = (id, qty) => {
  //   console.log(qty);
  productStore.updateQty([id, qty]);
};

const changeStart = (id, qty) => {
  //   console.log(qty);
  productStore.updateStart([id, qty]);
};

const changeEnd = (id, qty) => {
  //   console.log(qty);
  productStore.updateEnd([id, qty]);
};

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
    label: "Product Name",
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

const pagination2 = reactive({
  sortBy: "id",
  rowsPerPage: 20,
});
const columns2 = reactive([
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
    label: "Plan Name",
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
    name: "start",
    label: "Start Date",
    field: "start",
    align: "left",
    sortable: true,
  },
  {
    name: "end",
    label: "End Date",
    field: "end",
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

const showSearchProductDialog = ref(false);
const showSearchPlanDialog = ref(false);

const removeProductFunc = (id) => {
  productStore.removeProduct(id);
};

const removePlanFunc = (id) => {
  productStore.removePlan(id);
};
const SearchProductFunc = () => {
  showSearchProductDialog.value = true;
};

const SearchPlanFunc = () => {
  showSearchPlanDialog.value = true;
};

const selectStudent = async (member) => {
  // console.log(subject);
  // this.searchSubject = null;
  seletedMember.value = null;
  searchMember.value = member.name;
  seletedMember.value = member.id;
  formData.member_id = member.id;
  searchVisible.value = false;

  await api
    .get("/api/userplan/" + member.id, {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      console.log(response);
      status.value = response.data.plan;
      //   allMembers.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });

  // console.log(this.formData.subject_id);
};
const getMembers = async () => {
  await api
    .get("/api/members/", {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      // console.log(response);
      allMembers.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });

  //   console.log(allMembers.value);
};

const searchMemberFunc = () => {
  // console.log("work!!");
  searchVisible.value = true;
  const query =
    searchMember.value != null ? searchMember.value.toLowerCase() : "";
  if (searchMember.value == "" || searchMember.value == null) {
    filterMember.value = allMembers.value;
  } else {
    filterMember.value = allMembers.value.filter((student) => {
      return Object.values(student).some((word) =>
        String(word).toLowerCase().includes(query)
      );
    });
    // console.log(filterMember.value);
  }
};

const onSubmit = () => {
  if (memberToggle.value == true) {
    guestName.value = "";
    // console.log("true");
    if (seletedMember.value == null || seletedMember.value == "") {
      $q.notify({
        type: "negative",
        color: "negative",
        timeout: 3000,
        position: "top",
        message: "Member name is required!",
      });
    } else if (
      productStore.tempCashierProductDatas.length == 0 &&
      productStore.tempCashierPlanDatas.length == 0
    ) {
      $q.notify({
        type: "negative",
        color: "negative",
        timeout: 3000,
        position: "top",
        message: "Please add product or plan!",
      });
    } else {
      let a = 0;
      // console.log(productStore.tempCashierProductDatas);
      if (
        productStore.tempCashierProductDatas.length > 0 ||
        productStore.tempCashierPlanDatas.length > 0
      ) {
        productStore.tempCashierProductDatas.forEach((element) => {
          if (element.qty == 0 || element.qty == "" || element.qty == null) {
            $q.notify({
              type: "negative",
              color: "negative",
              timeout: 5000,
              position: "top",
              message: "Invalid quantity please set it to 1 or more!",
            });
            a++;
          }
        });
      }
      if (productStore.tempCashierPlanDatas.length > 0) {
        if (
          productStore.tempCashierPlanDatas[0].start == "" ||
          productStore.tempCashierPlanDatas[0].start == null ||
          productStore.tempCashierPlanDatas[0].end == "" ||
          productStore.tempCashierPlanDatas[0].end == null
        ) {
          $q.notify({
            type: "negative",
            color: "negative",
            timeout: 5000,
            position: "top",
            message:
              "Please set the start and end date of the plan subscription before checking out!",
          });
          a++;
        }
      }
      if (a == 0) {
        // console.log("ready to go!");
        showCheckoutDialog.value = true;
      }
      //   else {
      //     console.log("Ready to go!");
      //   }
    }
  } else {
    // console.log(guestName.value);
    formData.guestName = guestName.value;
    seletedMember.value = "";
    if (guestName.value == null || guestName.value == "") {
      $q.notify({
        type: "negative",
        color: "negative",
        timeout: 3000,
        position: "top",
        message: "Guest name is required!",
      });
    } else if (productStore.tempCashierProductDatas.length == 0) {
      $q.notify({
        type: "negative",
        color: "negative",
        timeout: 3000,
        position: "top",
        message: "Please add product!",
      });
    } else {
      let a = 0;
      // console.log(productStore.tempCashierProductDatas);
      if (productStore.tempCashierProductDatas.length > 0) {
        productStore.tempCashierProductDatas.forEach((element) => {
          if (element.qty == 0 || element.qty == "" || element.qty == null) {
            $q.notify({
              type: "negative",
              color: "negative",
              timeout: 5000,
              position: "top",
              message: "Invalid quantity please set it to 1 or more!",
            });
            a++;
          }
        });
      }

      if (a == 0) {
        // console.log("ready to go!");
        showCheckoutDialog.value = true;
      }
      //   else {
      //     console.log("Ready to go!");
      //   }
    }
  }
};
// watch(
//   () => productStore.tempCashierProductDatas,
//   (newValue, oldValue) => {
//     console.log("new value" + newValue);
//   }
// );
// computed(
//   () => productStore.tempCashierProductDatas,
//   (value) => {
//     //   productStore.tempCashierProductDatas;
//     console.log(value);
//     //   return "something";
//   }
// );
onMounted(() => {
  getMembers();
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
