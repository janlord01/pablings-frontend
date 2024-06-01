<template>
  <div class="row" v-if="payrollStore.userName">
    <div class="col-4">
      <q-input
        filled
        readonly
        v-model="payrollStore.userName"
        label="Employee"
        :class="$q.screen.gt.sm ? 'q-mr-sm full-width q-mt-sm ' : 'full-width'"
      >
        <template v-slot:prepend>
          <q-icon name="man" />
        </template>
      </q-input>
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

const $q = useQuasar();

const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const loan_id = ref(null);

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
