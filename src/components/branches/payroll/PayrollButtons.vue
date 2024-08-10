<template>
  <div class="row q-mt-lg" v-if="payrollStore.userName">
    <div class="full-width">
      <!-- <q-btn
        color="primary"
        label="Load Commission"
        icon="loop"
        :style="
          $q.screen.gt.sm
            ? 'font-size: 12px; margin: 0 3px 3px 0'
            : 'font-size: 8px; margin: 0 3px 3px 0'
        "
        @click="payrollStore.getEmployeeCommission"
      /> -->
      <q-btn
        color="primary"
        label="Add Salary"
        icon="add"
        :style="
          $q.screen.gt.sm
            ? 'font-size: 12px; margin: 0 3px 3px 0'
            : 'font-size: 8px; margin: 0 3px 3px 0'
        "
        @click="addSalaryFunc"
      />
      <q-btn
        color="primary"
        label="Add Bonus"
        icon="add"
        :style="
          $q.screen.gt.sm
            ? 'font-size: 12px; margin: 0 3px 3px 0'
            : 'font-size: 8px; margin: 0 3px 3px 0'
        "
        @click="addBonusFunc"
      />

      <!-- <q-btn
        color="negative"
        label="Load Deduction"
        icon="loop"
        :style="
          $q.screen.gt.sm
            ? 'font-size: 12px; margin: 0 3px 3px 0'
            : 'font-size: 8px; margin: 0 3px 3px 0'
        "
        @click="payrollStore.getEmployeeExpenses"
      /> -->
      <q-btn
        color="negative"
        label="Benifits Deduction"
        icon="health_and_safety"
        :style="
          $q.screen.gt.sm
            ? 'font-size: 12px; margin: 0 3px 3px 0'
            : 'font-size: 8px; margin: 0 3px 3px 0'
        "
        @click="benefitFunc"
      />
      <q-btn
        color="negative"
        label="Select Loan"
        icon="credit_score"
        :style="
          $q.screen.gt.sm
            ? 'font-size: 12px; margin: 0 3px 3px 0'
            : 'font-size: 8px; margin: 0 3px 3px 0'
        "
        @click="selectLoanFunc"
      />
      <q-btn
        color="negative"
        label="Add New Deduction"
        icon="add"
        :style="
          $q.screen.gt.sm
            ? 'font-size: 12px; margin: 0 3px 3px 0'
            : 'font-size: 8px; margin: 0 3px 3px 0'
        "
        @click="addDeductionFunc"
      />
    </div>
  </div>
  <!-- Salary Diaglog -->
  <q-dialog v-model="showSalaryDialog">
    <addsalary @hide-salary-dialog="showSalaryDialog = !showSalaryDialog" />
  </q-dialog>

  <!-- Bonus Diaglog -->
  <q-dialog v-model="showBonusDialog">
    <addBonus @hide-bonus-dialog="showBonusDialog = !showBonusDialog" />
  </q-dialog>

  <!-- New Deduction Diaglog -->
  <q-dialog v-model="showNewDeductionDialog">
    <newDeduction
      @hide-new-deduction-dialog="
        showNewDeductionDialog = !showNewDeductionDialog
      "
    />
  </q-dialog>

  <!-- New Loan Diaglog -->
  <q-dialog v-model="showLoanDialog" position="standard">
    <selectLoan @hide-loan-dialog="showLoanDialog = !showLoanDialog" />
  </q-dialog>

  <!-- New Benefit Dediction Diaglog -->
  <q-dialog v-model="showBenefitDialog" position="standard">
    <addBenefit @hide-benefit-dialog="showBenefitDialog = !showBenefitDialog" />
  </q-dialog>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useLoanData } from "src/stores/branch/loanStore";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { usePayrollData } from "src/stores/branch/payrollStore";
import addsalary from "./addSalary.vue";
import addBonus from "./AddBonusSalary.vue";
import newDeduction from "./AddDeduction.vue";
import selectLoan from "./SelectLoan.vue";
import addBenefit from "./SelectBenefit.vue";
const route = useRoute();

const loanStore = useLoanData();

const payrollStore = usePayrollData();

const $q = useQuasar();

const showSalaryDialog = ref(false);
const showBonusDialog = ref(false);
const showNewDeductionDialog = ref(false);
const showLoanDialog = ref(false);
const showBenefitDialog = ref(false);

const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const loan_id = ref(null);

const benefitFunc = () => {
  showBenefitDialog.value = true;
};

const selectLoanFunc = () => {
  showLoanDialog.value = true;
};
const addDeductionFunc = () => {
  showNewDeductionDialog.value = true;
};

const addSalaryFunc = () => {
  showSalaryDialog.value = true;
};

const addBonusFunc = () => {
  showBonusDialog.value = true;
};

const isUserArrayEmpty = computed(() => {
  return Array.isArray(payrollStore.user) && payrollStore.user.length === 0;
});

// const loadCommissionFunc = () => {

// }
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
onMounted(() => {
  payrollStore.getBenefits(route.params.id);
});
</script>

<style></style>
