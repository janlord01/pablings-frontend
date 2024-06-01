<template>
  <q-card style="max-width: 1200px; width: 1200px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10' : 'bg-blue text-white'
      "
    >
      <q-toolbar-title> Create Inventory </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup @click="closeFunc"></q-btn>
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
              $q.screen.gt.xs ? 'col-md-12 q-mr-sm q-mb-md' : 'full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <!-- <q-select
              filled
              v-model="formData.product"
              use-input
              input-debounce="0"
              label="Search Product"
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
            </q-select> -->
          </div>
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-12 q-mr-sm q-mb-md' : 'full-width '
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:20px;'"
          >
            <q-select
              filled
              v-model="formData.supplier"
              use-input
              input-debounce="0"
              label="Search Supplier"
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
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-5 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              v-model="formData.orderDate"
              label="Order Date"
              :rules="['date']"
              mask="date"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="formData.orderDate">
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

          <div
            :class="
              $q.screen.gt.xs ? 'col-md-5 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:20px;'"
          >
            <q-input
              filled
              v-model="formData.orderArrived"
              label="Order Arrived"
              mask="date"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="formData.orderArrived">
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
          <div
            :class="$q.screen.gt.xs ? 'col-md-5 q-mr-sm' : 'full-width row'"
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-btn
              icon="fastfood"
              label="select products"
              size="sm"
              color="blue"
              class="q-mr-sm col-5"
              @click="selectFunc"
            />
            <q-btn
              icon="add"
              label="add new product"
              size="sm"
              class="q-mr-sm col-5"
              color="blue"
              :to="'/' + route.params.slug + '/products'"
            />
          </div>
          <q-table
            flat
            :grid="!$q.screen.gt.xs"
            :pagination="pagination"
            class="q-pa-sm"
            :rows="inventoryStore.rowTempProducts"
            :columns="columns"
            row-key="id"
            separator="cell"
            :visible-columns="
              $q.screen.gt.xs
                ? [
                    'product',
                    'purchase_price',
                    'qty',
                    'remaining',
                    'msrp',
                    'srp',
                    'mfg',
                    'exp',
                    'action',
                  ]
                : [
                    'product',
                    'purchase_price',
                    'qty',
                    'remaining',
                    'msrp',
                    'srp',
                    'mfg',
                    'exp',
                    'action',
                  ]
            "
          >
            <template v-slot:item="props" v-if="!$q.screen.gt.xs">
              <q-card class="my-card row q-mb-md q-mr-sm" style="width: 45%">
                <q-card-section>
                  <div style="font-size: 12px">
                    {{ props.row.product.label }}
                  </div>
                  <div style="font-size: 10px">
                    <span class="text-bold">Purchase Price: </span> <br />{{
                      props.row.purchase_price
                    }}
                    <q-btn flat size="sm" color="blue">Edit</q-btn>
                    <q-popup-edit
                      v-model="props.row.purchase_price"
                      v-slot="scope"
                      buttons
                      class="bg-grey-5"
                    >
                      <q-input
                        v-model="scope.value"
                        dense
                        label="Purchase Price"
                        filled
                        counter
                        @keyup.enter="scope.set"
                      />
                    </q-popup-edit>
                  </div>
                  <div style="font-size: 10px">
                    <span class="text-bold">Qty: </span> <br />{{
                      props.row.qty
                    }}
                    <q-btn flat size="sm" color="blue">Edit</q-btn>
                    <q-popup-edit
                      v-model="props.row.qty"
                      buttons
                      class="bg-grey-5"
                      v-slot="scope"
                    >
                      <q-input
                        v-model="scope.value"
                        dense
                        label="Qty"
                        filled
                        counter
                        @keyup.enter="scope.set"
                      />
                    </q-popup-edit>
                  </div>
                  <div style="font-size: 10px">
                    <span
                      ><span class="text-bold">Remaining: </span> <br />
                      {{ props.row.remaining_qty }}
                    </span>
                    <br />

                    <span
                      ><span class="text-bold">MSRP: </span> <br />
                      {{ props.row.msrp }}
                      <q-btn flat size="sm" color="blue">Edit</q-btn>
                      <q-popup-edit
                        v-model="props.row.msrp"
                        buttons
                        class="bg-grey-5"
                        v-slot="scope"
                      >
                        <q-input
                          v-model="scope.value"
                          dense
                          label="MSRP"
                          filled
                          counter
                          @keyup.enter="scope.set"
                        />
                      </q-popup-edit>
                    </span>
                    <br />
                    <span
                      ><span class="text-bold">SRP: </span> <br />
                      {{ props.row.srp }}
                      <q-btn flat size="sm" color="blue">Edit</q-btn>
                      <q-popup-edit
                        v-model="props.row.srp"
                        v-slot="scope"
                        buttons
                        class="bg-grey-5"
                      >
                        <q-input
                          v-model="scope.value"
                          dense
                          label="SRP"
                          filled
                          counter
                          @keyup.enter="scope.set"
                        />
                      </q-popup-edit>
                    </span>
                    <br />
                  </div>
                  <div style="font-size: 10px">
                    <span class="text-bold">MFG: </span> <br />{{
                      date.formatDate(props.row.mfg, "MMMM DD, YYYY")
                    }}
                    <q-btn flat size="sm" color="blue">Edit</q-btn>

                    <q-popup-edit
                      v-model="props.row.mfg"
                      buttons
                      class="bg-grey-5"
                      v-slot="scope"
                    >
                      <q-input
                        filled
                        v-model="scope.value"
                        label="MFG Date"
                        @keyup.enter="scope.set"
                        mask="date"
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
                  </div>
                  <div style="font-size: 10px">
                    <span class="text-bold">EXP: </span> <br />{{
                      date.formatDate(props.row.exp, "MMMM DD, YYYY")
                    }}
                    <q-btn flat size="sm" color="blue">Edit</q-btn>

                    <q-popup-edit
                      v-model="props.row.exp"
                      buttons
                      class="bg-grey-5"
                      v-slot="scope"
                    >
                      <q-input
                        filled
                        v-model="scope.value"
                        label="EXP Date"
                        @keyup.enter="scope.set"
                        mask="date"
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
                  </div>
                </q-card-section>

                <q-card-actions class="q-pt-none">
                  <q-btn
                    color="red"
                    icon="delete"
                    size="sm"
                    @click="DeleteDialog(props.row.id)"
                  />
                </q-card-actions>
              </q-card>
            </template>
            <template #body="props">
              <q-tr :props="props">
                <q-td key="product" :props="props">
                  {{ props.row.product.label }}
                </q-td>
                <q-td key="purchase_price" :props="props">
                  {{ props.row.purchase_price }}
                  <q-btn flat size="sm" color="blue">Edit</q-btn>
                  <q-popup-edit
                    v-model="props.row.purchase_price"
                    v-slot="scope"
                  >
                    <q-input
                      v-model="scope.value"
                      dense
                      counter
                      label="Purchase Price"
                      @keyup.enter="scope.set"
                    />
                  </q-popup-edit>
                </q-td>
                <q-td key="qty" :props="props">
                  {{ props.row.qty }}
                  <q-btn flat size="sm" color="blue">Edit</q-btn>
                  <q-popup-edit v-model="props.row.qty" v-slot="scope">
                    <q-input
                      v-model="scope.value"
                      dense
                      label="Qty"
                      counter
                      @keyup.enter="scope.set"
                    />
                  </q-popup-edit>
                </q-td>
                <q-td key="remaining" :props="props">
                  {{ props.row.remaining_qty }}
                </q-td>

                <q-td key="msrp" :props="props">
                  {{ props.row.msrp }}
                  <q-btn flat size="sm" color="blue">Edit</q-btn>
                  <q-popup-edit v-model="props.row.msrp" v-slot="scope">
                    <q-input
                      v-model="scope.value"
                      dense
                      label="MSRP"
                      counter
                      @keyup.enter="scope.set"
                    />
                  </q-popup-edit>
                </q-td>
                <q-td key="srp" :props="props">
                  {{ props.row.srp }}
                  <q-btn flat size="sm" color="blue">Edit</q-btn>
                  <q-popup-edit v-model="props.row.srp" v-slot="scope">
                    <q-input
                      v-model="scope.value"
                      dense
                      filled
                      label="SRP"
                      counter
                      @keyup.enter="scope.set"
                    />
                  </q-popup-edit>
                </q-td>

                <q-td key="mfg" :props="props">
                  {{ date.formatDate(props.row.mfg, "MMMM DD, YYYY") }}
                  <q-btn flat size="sm" color="blue">Edit</q-btn>
                  <q-popup-edit v-model="props.row.mfg" v-slot="scope">
                    <q-input
                      filled
                      v-model="scope.value"
                      label="Manufacting Date"
                      @keyup.enter="scope.set"
                      mask="date"
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
                <q-td key="exp" :props="props">
                  {{ date.formatDate(props.row.exp, "MMMM DD, YYYY") }}
                  <q-btn flat size="sm" color="blue">Edit</q-btn>
                  <q-popup-edit v-model="props.row.exp" v-slot="scope">
                    <q-input
                      filled
                      v-model="scope.value"
                      label="Expiry Date"
                      @keyup.enter="scope.set"
                      mask="date"
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

                <q-td key="action" :props="props">
                  <!-- <q-btn
                    color="blue"
                    icon="edit"
                    size="sm"
                    @click="EditDialog(props.row.id)"
                  /> -->
                  <q-btn
                    color="red"
                    icon="delete"
                    size="sm"
                    @click="DeleteDialog(props.row.id)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <!-- <div
            :class="
              $q.screen.gt.xs ? 'col-md-3 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              label="Purchase Price"
              name="code"
              class="col-3 full-width"
              type="text"
              v-model="formData.purchasePrice"
              :rules="[(val) => !!val || 'Price is required']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-4 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              label="MSRP"
              name="code"
              class="col-3 full-width"
              type="text"
              v-model="formData.msrp"
              :rules="[(val) => !!val || 'Price is required']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-4 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              label="SRP"
              class="col-3 full-width"
              v-model="formData.srp"
              :rules="[(val) => !!val || 'Price is required']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-3 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              label="Qty"
              class="col-3 full-width"
              v-model="formData.qty"
              :rules="[(val) => !!val || 'Price is required']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-4 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              v-model="formData.mfg"
              label="Manufacturing Date(MFG)"
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
          </div>
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-4 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              v-model="formData.exp"
              label="Expiration Date(exp)"
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

        <div class="row q-col-gutter-none q-mt-md relative-position">
          <div :class="$q.screen.gt.xs ? 'col-md-11 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Remarks"
              class="q-mr-sm col-3 full-width"
              type="textarea"
              v-model="formData.remark"
              :rules="[(val) => !!val || 'Description is required']"
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>
          </div>
          <div
            :class="
              $q.screen.gt.xs
                ? 'col-md-3 q-mb-md q-mr-sm'
                : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-select
              filled
              v-model="formData.status"
              :options="['Order Placed', 'In Transit', 'Order Arrived']"
              label="Status"
            >
              <template v-slot:prepend>
                <q-icon name="receipt" />
              </template>
            </q-select>
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
    <q-dialog v-model="showSelectDialog" persistent>
      <SelectProducts
        @hide-select-dialog="showSelectDialog = !showSelectDialog"
      />
    </q-dialog>
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
import SelectProducts from "./SelectProducts.vue";
import { useInventoryData } from "stores/inventories/inventoryStore.js";

const inventoryStore = useInventoryData();

const rowDatas = reactive([]);
const route = useRoute();

const emit = defineEmits(["hideCreateDialog"]);

const supplyStore = useSupplyData();

const showSelectDialog = ref(false);

const closeFunc = () => {
  inventoryStore.clearTempProducts();
};
const selectFunc = () => {
  showSelectDialog.value = true;
};

const DeleteDialog = (id) => {
  const objWithIdIndex = inventoryStore.rowTempProducts.findIndex(
    (obj) => obj.id === id
  );
  if (objWithIdIndex > -1) {
    inventoryStore.rowTempProducts.splice(objWithIdIndex, 1);
    $q.notify({
      type: "positive",
      message: "Item Removed!",
      position: "top",
      timeout: 3000,
    });
  }
};

const pagination = reactive({
  sortBy: "id",
  rowsPerPage: 10,
});
const columns = reactive([
  {
    name: "id",
    label: "id",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "product",
    label: "Product",
    field: "product",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },

  {
    name: "supplier",
    label: "Supplier",
    field: "supplier",
    align: "left",
    sortable: true,
  },
  {
    name: "order_date",
    label: "Order Date",
    field: "order_date",
    align: "left",
    sortable: true,
  },
  {
    name: "order_arrived",
    label: "Order Arrived",
    field: "order_date",
    align: "left",
    sortable: true,
  },
  {
    name: "purchase_price",
    label: "Purchase Price",
    field: "purchase_price",
    align: "left",
    sortable: false,
  },
  {
    name: "qty",
    label: "Qty",
    field: "qty",
    align: "left",
    sortable: false,
  },
  {
    name: "remaining",
    label: "Remaining Qty",
    field: "remaining",
    align: "left",
    sortable: false,
    classes: "bg-grey-4",
  },
  {
    name: "msrp",
    label: "MSRP",
    field: "msrp",
    align: "left",
    sortable: true,
  },
  {
    name: "srp",
    label: "SRP",
    field: "srp",
    align: "left",
    sortable: true,
  },
  {
    name: "mfg",
    label: "Mfg",
    field: "mfg",
    align: "left",
    sortable: true,
  },
  {
    name: "exp",
    label: "Exp",
    field: "exp",
    align: "left",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    align: "left",
    sortable: true,
  },
  {
    name: "remarks",
    label: "Remarks",
    field: "remarks",
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

const stringOptions = reactive([]);

const getAllSupplier = async () => {
  var newToken = LocalStorage.getItem("jwt");
  await api
    .get(`api/${route.params.slug}/supplier`, {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      // console.log(response);
      Object.entries(response.data.data).map(([key, val]) => {
        stringOptions.push({
          label: val.supplier_name,
          value: val.id,
        });
        options.value = stringOptions;
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
const options = ref(stringOptions);

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
      (v) => v.toLowerCase().indexOf(needle) > -1
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
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  console.log(inventoryStore.rowTempProducts);
  let prods = [];
  Object.entries(inventoryStore.rowTempProducts).map(([key, product]) => {
    prods[key] = product.id;
  });
  console.log(prods);
  api
    .post(
      `/api/${route.params.slug}/inventory`,
      {
        products: inventoryStore.rowTempProducts,
        supplier: formData.supplier.value,
        order_date: formData.orderDate,
        order_arrived: formData.orderArrived,
        status: formData.status,
        remarks: formData.remark,
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
          inventoryStore.getAllInventories(route.params.slug);
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
  inventoryStore.clearTempProducts();
  getAllSupplier();
  //   getCodesFunc();
  // console.log(codes);
});

const formData = reactive({
  supplier: null,
  orderDate: null,
  orderArrived: null,
  remark: null,
  status: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
