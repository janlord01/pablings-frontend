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
            <!-- <q-input
              filled
              label="Mode of Payment"
              readonly
              name="code"
              class="full-width q-mb-sm"
              type="text"
              v-model="cashierStore.mop"
            >
              <template v-slot:prepend>
                <q-icon name="category" />
              </template>
            </q-input> -->
            <!-- <q-btn
              label="Select mode of payment"
              @click="selectMopFunc"
              color="primary"
            /> -->
            <q-select
              filled
              v-model="formData.type"
              clearable
              :options="['cash', 'gcash', 'bank']"
              label="Select mode of payment"
              class="q-mb-md"
            />

            <div v-if="formData.type === 'gcash' || formData.type === 'bank'">
              <q-input
                filled
                label="Reference #"
                class="full-width q-mb-sm"
                v-model="formData.ref"
              >
                <template v-slot:prepend>
                  <q-icon name="numbers" />
                </template>
              </q-input>
            </div>

            <q-input
              v-if="formData.type"
              filled
              label="Amount"
              name="code"
              class="full-width q-mb-sm"
              type="number"
              @keyup.enter="selectMopFunc"
              v-model="formData.amount"
            >
              <template v-slot:prepend>
                <q-icon name="currency_ruble" />
              </template>
            </q-input>
            <q-btn
              unelevated
              label="Add"
              class="text-center"
              color="blue"
              size="md"
              @click="selectMopFunc"
            />
            <q-table
              :grid="!$q.screen.gt.xs"
              :pagination="pagination"
              :rows="cashierStore.mop"
              :columns="columns"
              flat
              hide-pagination
              row-key="id"
              separator="none"
              :visible-columns="['type', 'amount', 'change', 'action']"
            >
              <template v-slot:item="props" v-if="!$q.screen.gt.xs">
                <q-card class="my-card row q-mb-md q-mr-sm" style="width: 47%">
                  <q-card-section class="full-width">
                    <div style="font-size: 10px">
                      <span class="text-bold">Type</span> <br />{{
                        props.row.type
                      }}
                      <br />
                      <span class="text-bold">Amount</span> <br />{{
                        props.row.amount
                      }}
                      <br />
                      <span class="text-bold">Change</span> <br />{{
                        props.row.change
                      }}
                    </div>
                  </q-card-section>
                  <q-card-actions>
                    <q-btn
                      label="void"
                      color="red"
                      icon="delete"
                      size="xs"
                      @click="VoidDialog(props.row.uid)"
                    />
                  </q-card-actions>
                </q-card>
              </template>
              <template #body="props">
                <q-tr
                  :props="props"
                  :class="
                    props.row.mop === 'gcash' ? 'bg-blue-4 text-white' : ''
                  "
                >
                  <q-td key="type" :props="props">
                    {{ props.row.type }}
                  </q-td>
                  <q-td key="amount" :props="props">
                    {{ props.row.amount }}
                  </q-td>
                  <q-td key="change" :props="props">
                    {{ props.row.change }}
                  </q-td>

                  <q-td key="action" :props="props">
                    <q-btn
                      color="red"
                      icon="delete"
                      size="sm"
                      @click="VoidDialog(props.row.uid)"
                    />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <p class="bg-yellow q-pl-sm" style="width: 150px">
              Balance Due: {{ cashierStore.balanceDue }}
            </p>
            <!-- <div v-if="cashierStore.mop === 'gcash'">
              <q-input
                filled
                label="Reference #"
                class="full-width q-mb-sm"
                type="text"
                v-model="cashierStore.reference"
              >
                <template v-slot:prepend>
                  <q-icon name="numbers" />
                </template>
              </q-input>
              <q-file
                filled
                label="Upload Proof"
                class="full-width q-mb-sm"
                type="file"
                v-model="cashierStore.proof"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div> -->

            <!-- <q-input
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
            </q-input> -->
            <!-- <q-input
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
            </q-input> -->
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
            <q-file
              filled
              label="Attach File"
              class="full-width q-mt-md"
              type="file"
              v-model="cashierStore.proof"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <q-btn
              unelevated
              label="Pay"
              class="text-center q-mt-lg"
              color="blue"
              size="md"
              @click="onSubmit"
              icon="attach_money"
            />
            <!-- <q-btn
              unelevated
              label="Print"
              class="text-center q-mt-lg"
              color="blue"
              size="md"
              type="button"
              @click="printReceiptFunc"
            /> -->
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>

  <q-dialog v-model="printReceiptDialog" persistent>
    <printReceipt :receipt-id="receiptId" @hide-print="hideFunc" />
  </q-dialog>
  <q-dialog v-model="selectMopDialog" persistent>
    <selectMop @select-mop="selectMopDialog = !selectMopDialog" />
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";
import { useServicesData } from "src/stores/branch/servicesStore";
import { useDiscountData } from "stores/branch/discountStore";
import { useCashierData } from "stores/branch/cashierStore";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute, useRouter } from "vue-router";
import printReceipt from "./printReceipt.vue";
import selectMop from "./selectMop.vue";
// import router from "src/router";
const route = useRoute();
const router = useRouter();
const productStores = useProductDatas();
const serviceStore = useServicesData();

const emit = defineEmits("hidePayDialog");
const printReceiptDialog = ref(false);
const selectMopDialog = ref(false);

const discountStore = useDiscountData();
const selectMopFunc = () => {
  // selectMopDialog.value = true;
  if (formData.type === "" || formData.amount == 0 || formData.amount == "") {
    $q.notify({
      type: "negative",
      position: "top",
      timeout: 3000,
      message: "Some fields are required!",
    });
  } else {
    cashierStore.selectMop(formData);
    formData.type = "";
    formData.amount = "";
    formData.ref = "";
    // emit("selectMop");
  }
};
const hideFunc = () => {
  printReceiptDialog.value = !printReceiptDialog.value;
  emit("hidePayDialog");
};
const newToken = ref(LocalStorage.getItem("jwt"));
const allMembers = reactive([]);
const filterMember = reactive({});

const searchProduct = ref(null);
const seletedMember = ref(null);
const searchVisible = ref(false);
const status = ref(null);

const productStore = useProductDatas();
const cashierStore = useCashierData();

const VoidDialog = (id) => {
  cashierStore.removeMop(id);
};
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
  sortBy: "type",
  rowsPerPage: 0,
});
const columns = reactive([
  {
    name: "type",
    label: "Type",
    field: "type",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "mop",
    label: "Mop",
    field: "mop",
    align: "left",
    sortable: true,
  },
  {
    name: "amount",
    label: "Amount",
    field: "amount",
    align: "left",
    sortable: true,
  },
  {
    name: "change",
    label: "Change",
    field: "change",
    align: "left",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
    sortable: true,
  },
]);

const printReceiptFunc = () => {
  // setTimeout(() => {
  printReceiptDialog.value = true;
  // }, 1000);
};

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

const receiptId = ref("");

const onSubmit = () => {
  if (cashierStore.balanceDue > 0) {
    $q.notify({
      position: "top",
      type: "negative",
      timeout: 3000,
      message: "There's still balance Due, please settle it before proceeding",
    });
  } else {
    var newToken = LocalStorage.getItem("jwt");
    $q.loading.show();
    let fileData = new FormData();

    fileData.append("items", JSON.stringify(cashierStore.rowDatas));
    fileData.append("branch", route.params.id);
    fileData.append("subTotal", cashierStore.subTotal);
    fileData.append("total", cashierStore.total);
    fileData.append("totalDiscount", cashierStore.totalDiscount);
    fileData.append("discount_id", cashierStore.discountId);
    fileData.append("cash", cashierStore.cash);
    fileData.append("change", cashierStore.change);
    fileData.append("remarks", cashierStore.remarks);
    fileData.append("mop", JSON.stringify(cashierStore.mop));
    fileData.append("reference", cashierStore.reference);
    fileData.append("proof", cashierStore.proof);
    fileData.append("slug", route.params.slug);
    fileData.append(
      "client",
      cashierStore.client == "Client" && cashierStore.selectedClient != null
        ? cashierStore.selectedClient.id
        : "Guest"
    );
    api
      .post("/api/branch/cashier/store", fileData, {
        headers: {
          Authorization: "Bearer " + newToken,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.status === 200) {
          setTimeout(() => {
            $q.notify({
              type: "positive",
              icon: "save",
              timeout: 3000,
              position: "bottom",
              message: response.data.message,
            });
            // productStore.getAllProducts(route.params.id);
            // cashierStore.mop = "cash";

            receiptId.value = response.data.receipt;
            $q.loading.hide();
            serviceStore.getAllServicesBranch(route.params.id);
            productStores.getAllBranchProducts(route.params.id);

            printReceiptDialog.value = true;

            // emit("hidePayDialog");

            // $q.dialog({
            //   title: "Confirm",
            //   message: "Would you like to print the receipt?",
            //   persistent: true,
            //   ok: {
            //     push: true,
            //     label: "Print",
            //     color: "purple",
            //   },
            //   cancel: {
            //     push: true,
            //     label: "No",
            //     color: "grey",
            //   },
            // })
            //   .onOk(() => {
            //     printReceiptDialog.value = true;
            //   })
            //   .onCancel(() => {
            //     router.go(-1);
            //   });
          }, 1000);
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
        $q.loading.hide();
      });
  }
};
onMounted(() => {
  //   getMembers();
  // productStore.getAllProducts(route.params.id);
  // productStore.getAllPlans();
  cashierStore.cash = "";
  cashierStore.change = 0;
  cashierStore.remarks = "";
  cashierStore.reference = "";
  cashierStore.proof = "";
  cashierStore.mop = [];
  // cashierStore.mop = "";
  getBranchDiscounts();
  //   getCodesFunc();
  // console.log(codes);
});

const formData = reactive({
  type: "",
  ref: "",
  proof: "",
  amount: 0,
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
