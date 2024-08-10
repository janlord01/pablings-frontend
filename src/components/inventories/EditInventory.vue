<template>
  <q-card style="max-width: 900px; width: 900px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10' : 'bg-blue text-white'
      "
    >
      <q-toolbar-title> Update Inventory </q-toolbar-title>
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
          ></div>
          <!-- <div
            :class="
              $q.screen.gt.xs ? 'col-md-12 q-mr-sm q-mb-md' : 'full-width'
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
          </div> -->
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-5 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              readonly
              v-model="formData.orderDate"
              label="Order Date"
              :rules="['date']"
              mask="date"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <!-- <q-popup-proxy
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
                  </q-popup-proxy> -->
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
              readonly
              v-model="formData.orderArrived"
              label="Order Arrived"
              mask="date"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <!-- <q-popup-proxy
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
                  </q-popup-proxy> -->
                </q-icon>
              </template>
            </q-input>
          </div>
          <!-- <div
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
          </div> -->
          <q-table
            :grid="!$q.screen.gt.xs"
            flat
            :pagination="pagination"
            class="q-pa-sm full-width"
            :rows="inventoryStore.rowTempProducts"
            :columns="columns"
            row-key="id"
            :loading="loading"
            separator="cell"
            :visible-columns="
              $q.screen.gt.xs
                ? ['product', 'qty', 'msrp', 'srp', 'action']
                : ['product', 'qty', 'msrp', 'srp', 'action']
            "
          >
            <template v-slot:loading>
              <q-inner-loading showing color="primary" />
            </template>
            <template v-slot:item="props" v-if="!$q.screen.gt.xs">
              <q-card class="my-card row q-mb-md q-mr-sm" style="width: 45%">
                <q-card-section>
                  <div style="font-size: 12px">
                    {{
                      props.row.label != null
                        ? props.row.label
                        : props.row.product.label
                    }}
                  </div>
                  <div style="font-size: 10px">
                    <span class="text-bold">Qty: </span> <br />{{
                      props.row.qty
                    }}
                  </div>
                  <div style="font-size: 10px">
                    <span
                      ><span class="text-bold">MSRP: </span> <br />
                      {{ props.row.msrp }}
                    </span>
                    <br />
                    <span
                      ><span class="text-bold">SRP: </span> <br />
                      {{ props.row.srp }}
                    </span>
                    <br />
                  </div>
                </q-card-section>

                <q-card-actions class="q-pt-none">
                  <!-- <q-btn
                    color="red"
                    icon="delete"
                    size="sm"
                    @click="DeleteDialog(props.row.id)"
                  /> -->
                </q-card-actions>
              </q-card>
            </template>
            <template #body="props">
              <q-tr :props="props">
                <q-td key="product" :props="props">
                  {{
                    props.row.label != null
                      ? props.row.label
                      : props.row.product.label
                  }}
                </q-td>
                <q-td key="purchase_price" :props="props">
                  {{ props.row.purchase_price }}
                  <q-popup-edit
                    v-model="props.row.purchase_price"
                    v-slot="scope"
                  >
                    <q-input
                      v-model="scope.value"
                      dense
                      autofocus
                      counter
                      @keyup.enter="scope.set"
                    />
                  </q-popup-edit>
                </q-td>
                <q-td key="qty" :props="props">
                  {{ props.row.qty }}
                  <q-popup-edit v-model="props.row.qty" v-slot="scope">
                    <q-input
                      v-model="scope.value"
                      dense
                      autofocus
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
                </q-td>
                <q-td key="srp" :props="props">
                  {{ props.row.srp }}
                </q-td>

                <q-td key="action" :props="props">
                  <!-- <q-btn
                    color="red"
                    icon="delete"
                    size="sm"
                    @click="DeleteDialog(props.row.id)"
                  /> -->
                  <q-btn
                    color="primary"
                    icon="save"
                    @click="updateQty(props.row.inv_prod_id, props.row.qty)"
                    size="sm"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>

        <div class="row q-col-gutter-none q-mt-md relative-position">
          <div :class="$q.screen.gt.xs ? 'full-width q-mr-sm' : 'full-width'">
            <q-input
              filled
              readonly
              label="Remarks"
              class="q-mr-sm full-width"
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
              readonly
              v-model="formData.status"
              :options="['Order Arrived']"
              label="Status"
            >
              <template v-slot:prepend>
                <q-icon name="receipt" />
              </template>
            </q-select>
          </div>
        </div>

        <div class="row align-center">
          <!-- <q-btn
            unelevated
            label="Update"
            class="text-center"
            :class="$q.screen.gt.xs ? '' : 'q-mt-md'"
            color="blue"
            size="md"
            type="submit"
          /> -->
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

const props = defineProps(["inventoryId"]);

const route = useRoute();
const loading = ref(true);
const emit = defineEmits(["hideEditDialog"]);

const supplyStore = useSupplyData();

const showSelectDialog = ref(false);

const updateQty = async (id, qty) => {
  // /inventory/item/{
  loading.value = true;
  const newToken = LocalStorage.getItem("jwt");
  await api
    .patch(
      `api/inventory/item/${id}`,
      {
        qty: qty,
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
          $q.notify({
            position: "top",
            type: "positive",
            message: response.data.message,
            timeout: 3000,
          });

          getInventoryData();
        }, 1000);
      } else {
        setTimeout(() => {
          $q.notify({
            position: "top",
            type: "negative",
            message: response.data.message,
            timeout: 3000,
          });
        }, 3000);
      }
    })
    .catch((error) => {
      console.log(error);
      setTimeout(() => {
        $q.notify({
          position: "top",
          type: "negative",
          message: "System Error! Please try again!",
          timeout: 3000,
        });
      }, 3000);
    });
};

const closeFunc = () => {
  inventoryStore.clearTempProducts();
};

const getInventoryData = async () => {
  loading.value = true;
  const newToken = LocalStorage.getItem("jwt");
  await api
    .get(`api/${route.params.slug}/inventory/${props.inventoryId}/edit`, {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      // console.log(response);
      setTimeout(() => {
        loading.value = false;
        formData.supplier = response.data.data.supplier_name;
        formData.supplier_id = response.data.data.supplier_id;
        // formData.supplier.label = response.data.data.supplier_name;
        formData.orderDate = response.data.data.order_date;
        formData.orderArrived = response.data.data.order_arrived;
        formData.remark = response.data.data.remarks;
        formData.status = response.data.data.status;

        inventoryStore.getAddedProductInventory(response.data.items);
      }, 1000);
    })
    .catch((error) => {
      console.log(error);
    });
};

const selectFunc = () => {
  showSelectDialog.value = true;
};

const DeleteDialog = (id) => {
  const objWithIdIndex = inventoryStore.rowTempProducts.findIndex(
    (obj) => obj.id === id
  );

  // console.log(objWithIdIndex);

  $q.dialog({
    title: "Remove Product",
    message:
      "Are you sure you want to delete this product? All the date will be removed and this action cannot be undone. Please type the word “DELETE” to proceed!",
    prompt: {
      model: "",
      isValid: (val) => val.length > 2, // << here is the magic
      type: "text", // optional
    },
    ok: {
      push: true,
      color: "negative",
      label: "Delete",
    },
    cancel: {
      push: true,
      color: "grey-6",
    },
    persistent: true,
  }).onOk((data) => {
    // console.log('>>>> OK, received', data)
    if (data === "DELETE") {
      if (objWithIdIndex > -1) {
        inventoryStore.rowTempProducts.splice(objWithIdIndex, 1);
        $q.notify({
          type: "positive",
          message: "Item Removed!",
          position: "top",
          timeout: 3000,
        });
        $q.dialog({
          title: "Reminder",
          message: 'Click the "Update" button below to save all the changes',
          ok: {
            color: "blue",
          },
        })
          .onOk(() => {
            // console.log('OK')
          })
          .onCancel(() => {
            // console.log('Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      }
    } else {
      $q.notify({
        type: "negative",
        message: "Invalid! Please try again.",
        position: "top",
        timeout: 3000,
      });
    }
  });
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
    sortable: true,
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
    classes: "bg-grey-4",
  },
  {
    name: "srp",
    label: "SRP",
    field: "srp",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
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

  $q.dialog({
    title: "Confirm",
    message: "Please review all the changes before proceed!",
    ok: {
      push: true,
      color: "blue",
      label: "Proceed & Update",
    },
    cancel: {
      label: "Review",
      push: true,
      color: "grey-6",
    },
    persistent: true,
  })
    .onOk(() => {
      // console.log('>>>> OK')
      $q.loading.show();
      let prods = [];
      Object.entries(inventoryStore.rowTempProducts).map(([key, product]) => {
        prods[key] = product.id;
      });
      console.log(
        typeof formData.supplier.value !== "undefined"
          ? formData.supplier.value
          : formData.supplier_id
      );
      api
        .patch(
          `/api/${route.params.slug}/inventory/${props.inventoryId}`,
          {
            products: inventoryStore.rowTempProducts,
            supplier:
              typeof formData.supplier.value !== "undefined"
                ? formData.supplier.value
                : formData.supplier_id,
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
          console.log(response);
          if (response.data.status == 200) {
            setTimeout(() => {
              $q.loading.hide();
              $q.notify({
                type: "positive",
                icon: "save",
                timeout: 3000,
                position: "bottom",
                message: response.data.message,
              });
              inventoryStore.getAllInventories(route.params.slug);
              emit("hideEditDialog");
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
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    });
};
onMounted(() => {
  getAllSupplier();
  getInventoryData();
  //   getCodesFunc();
  // console.log(codes);
});

const formData = reactive({
  supplier: null,
  supplier_id: null,
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
