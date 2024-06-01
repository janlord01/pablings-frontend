<template>
  <q-card style="max-width: 400px; width: 400px; min-height: 300px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-blue text-white">
      <q-toolbar-title> Print Receipt </q-toolbar-title>
      <q-btn
        flat
        icon="close"
        round
        v-close-popup
        @click="newTransaction"
      ></q-btn>
    </q-toolbar>
    <q-card-section>
      <div class="q-mt-md" id="printMe">
        <q-img
          :src="companyStore.rowDatasCompany.logo"
          loading="lazy"
          width="80px"
          class="block q-mx-auto"
        />
        <p class="text-center q-mt-sm" style="font-size: 10px">
          {{ companyAddress }}
        </p>
        <p class="text-center q-mt-sm" style="font-size: 20px">SALES INVOICE</p>
        <p class="text-left q-mt-sm" style="font-size: 10px">
          Trans#: {{ props.receiptId }}
        </p>
        <p class="text-left" style="font-size: 10px; margin-top: -15px">
          Employee: {{ employee }}
        </p>
        <p class="text-left" style="font-size: 10px; margin-top: -15px">
          Branch: {{ branch }}
        </p>
        <p class="text-left" style="font-size: 10px; margin-top: -15px">
          Customer: {{ client }}
        </p>

        <hr class="q-mb-lg" style="margin-top: -10px" />
        <!-- <q-separator class="q-mb-lg" style="margin-top: -10px" /> -->
        <div class="text-left q-mt-sm" style="font-size: 10px">
          <p
            v-for="(item, index) in items"
            :key="index"
            style="margin-top: -15px"
          >
            <span style="margin-right: 2px">{{ item.qty }}</span
            ><span>{{ item.name }}@{{ item.srp }} </span>
            <span style="float: right">{{ item.total }}</span>
          </p>
        </div>
        <div style="font-size: 10px; margin-top: -15px">
          {{ items.length }}
          <span>Item(s)</span>
        </div>

        <!-- <q-separator class="q-mb-sm q-mt-sm" /> -->
        <hr class="q-mb-sm q-mt-sm" />
        <div class="text-left" style="font-size: 10px">
          <p>
            <span style="margin-right: 2px">Total Discount</span><span></span>
            <span></span>
            <span style="float: right; font-size: 10px">
              PHP {{ totalDiscount }}</span
            >
          </p>
          <p style="margin-top: -16px">
            <span style="margin-right: 2px">Total Due</span><span></span>
            <span></span>
            <span style="float: right; font-size: 15px">PHP {{ total }}</span>
          </p>
          <div
            v-for="(item, index) in mops"
            :key="index"
            style="margin-top: -8px; margin-bottom: -16px"
          >
            <p>
              <span style="margin-right: 2px; text-transform: uppercase">{{
                item.type
              }}</span
              ><span></span>
              <span></span>
              <span style="float: right; font-size: 10px">
                PHP {{ item.amount }}</span
              >
            </p>
            <p style="margin-top: -16px">
              <span
                style="margin-right: 2px; text-transform: uppercase"
                v-if="item.change != 0"
                >Change</span
              ><span></span>
              <span></span>
              <span
                style="float: right; font-size: 10px"
                v-if="item.change != 0"
              >
                PHP {{ item.change }}</span
              >
            </p>
          </div>
        </div>
        <hr />
        <div>
          <p class="text-red" style="font-size: 12px">
            "This is not an official receipt-for your official receipt please
            ask the authorize person from finance."
          </p>
        </div>
      </div>
      <div>
        <q-btn
          label="print"
          v-print="'#printMe'"
          icon="print"
          color="purple"
          size="sm"
        />
      </div>
      <q-inner-loading :showing="visible" />
    </q-card-section>
  </q-card>
</template>
<script>
import print from "vue3-print-nb";

export default {
  directives: {
    print,
  },

  data() {
    return {
      printLoading: true,
      printObj: {
        id: "printMe",
        popTitle: "Print Receipt",
        extraCss:
          "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
        beforeOpenCallback(vue) {
          vue.printLoading = true;
          console.log("打开之前");
        },
        openCallback(vue) {
          vue.printLoading = false;
          console.log("执行了打印");
        },
        closeCallback(vue) {
          console.log("关闭了打印工具");
        },
      },
    };
  },
};
</script>
<script setup>
import { ref, reactive, onMounted, onBeforeMount, watch } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";
import { useDiscountData } from "stores/branch/discountStore";
import { useCashierData } from "stores/branch/cashierStore";
import { useCompanyData } from "src/stores/company/store";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute, useRouter } from "vue-router";

const companyStore = useCompanyData();
// import router from "src/router";
const route = useRoute();
const router = useRouter();
const props = defineProps(["receiptId"]);
const emit = defineEmits(["hidePrint"]);
const visible = ref(true);

const discountStore = useDiscountData();
const allTranctions = () => {
  router.go(-1);
};
const newTransaction = () => {
  cashierStore.clearPos();
  emit("hidePrint");
};
const newToken = ref(LocalStorage.getItem("jwt"));

const searchProduct = ref(null);
const seletedMember = ref(null);
const searchVisible = ref(false);
const status = ref(null);

const productStore = useProductDatas();
const cashierStore = useCashierData();

const $q = useQuasar();
const stringOptions = reactive([]);
const companyAddress = ref("");
const options = ref(null);

const discount = ref(null);

const branch = ref("");
const employee = ref("");
const client = ref("");
const totalDiscount = ref("");
const mops = reactive([]);
const total = ref("");
const cash = ref("");
const change = ref("");
const items = reactive([]);
const getItemForReceipt = async () => {
  const newToken = LocalStorage.getItem("jwt");
  await api
    .get(
      `/api/branch/receipt/${props.receiptId}`,
      {
        params: {
          branch_id: route.params.id,
        },
      },
      {
        headers: {
          Authorization: "Bearer " + newToken,
        },
      }
    )
    .then((response) => {
      // console.log(response);
      if (response.data.status === 200) {
        visible.value = false;
        employee.value = response.data.employee.name;
        client.value = response.data.payment.name
          ? response.data.payment.name
          : "Guest";
        branch.value = response.data.branch.name;
        totalDiscount.value = response.data.payment.discount;
        cash.value = response.data.payment.cash;
        total.value = response.data.payment.total;
        change.value = response.data.payment.change;
        Object.entries(response.data.mops).map(([key, val]) => {
          mops.push(val);
        });
        Object.entries(response.data.items).map(([key, val]) => {
          if (val.service_id === null || val.service_id === "") {
            console.log(val.service_id);
            items.push({
              name: val.title,
              product_id: val.product_id,
              description: val.description,
              srp: parseFloat(val.total_item),
              qty: 1,
              total: parseFloat(val.total_item),
              image: val.product_img,
              id: val.id,
            });
          } else {
            items.push({
              name: val.service_name,
              description: val.service_descr,
              srp: parseFloat(val.total_item),
              qty: 1,
              total: parseFloat(val.total_item),
              image: val.image,
              id: val.id,
            });
          }
        });
        // console.log(items);
      }
    })
    .catch((error) => {
      console.log(error);
    });
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
    name: "qty",
    label: "qty",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "name",
    label: "name",
    field: "name",
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
]);

onMounted(() => {
  getItemForReceipt();
});

const formData = reactive({
  name: null,
  description: null,
  price: 0,
  qty: 0,
  sale: false,
  sale_price: 0,
});
</script>
