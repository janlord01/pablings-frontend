<template>
  <div class="row q-mt-lg" v-if="payrollStore.userName">
    <div :class="$q.screen.gt.sm ? 'col-3 q-mr-md' : 'col'">
      <q-input
        filled
        readonly
        v-model="payrollStore.userName"
        label="Employee"
        class="full-width"
      >
        <template v-slot:prepend>
          <q-icon name="man" />
        </template>
      </q-input>
    </div>
    <div :class="$q.screen.gt.sm ? 'col-3 q-mr-md' : 'col'">
      <q-input filled v-model="startDate" mask="date" label="start date">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="startDate">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div :class="$q.screen.gt.sm ? 'col-3 q-mr-md' : 'col'">
      <q-input filled v-model="endDate" mask="date" label="end date">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="endDate">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div :class="$q.screen.gt.sm ? 'col' : 'col'">
      <q-btn
        icon="check_circle"
        color="secondary"
        size="sm"
        style="padding-top: 15px; padding-bottom: 15px; margin-top: 5px"
        :style="$q.screen.gt.sm ? '' : 'margin-left:-10px; margin-top: 10px;'"
        :label="$q.screen.gt.xs ? 'Select Period' : 'Select Period'"
        @click="selectPeriodFunc"
      />
    </div>
  </div>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useLoanData } from "src/stores/branch/loanStore";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { usePayrollData } from "src/stores/branch/payrollStore";
const route = useRoute();

const loanStore = useLoanData();

const payrollStore = usePayrollData();
const startDate = ref("");
const endDate = ref("");
const $q = useQuasar();

const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const loan_id = ref(null);

const selectPeriodFunc = () => {
  if (startDate.value === "" || endDate.value === "") {
    $q.notify({
      position: "top",
      type: "negative",
      timeout: 3000,
      message: "Error! Please select start date & end date.",
    });
  } else {
    setTimeout(() => {
      payrollStore.getEmployeeCommission([startDate.value, endDate.value]);
    }, 300);
    setTimeout(() => {
      payrollStore.getEmployeeExpenses([startDate.value, endDate.value]);
    }, 2000);
  }
};

const isUserArrayEmpty = computed(() => {
  return Array.isArray(payrollStore.user) && payrollStore.user.length === 0;
});
const pagination = reactive({
  sortBy: "id",
  rowsPerPage: 10,
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
    name: "staff",
    label: "Staff",
    field: "staff",
    align: "left",
    sortable: true,
  },

  {
    name: "loan",
    label: "Loan",
    field: "loan",
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
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
]);
onMounted(() => {});
</script>

<style></style>
