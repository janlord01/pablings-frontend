<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-negative text-white">
      <q-toolbar-title> Select Loan </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >


        <div class="row q-col-gutter-none">
          <q-select
            filled
            v-model="payrollStore.selectedLoan"
            :options="payrollStore.workerLoans"
            label="Select Loan"
            class="q-mr-sm col-3 q-mt-sm full-width"
            type="text"
            @update:model-value="payrollStore.getLoan"

          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-select>
          <q-input
            filled
            v-model="payrollStore.selectedLoanAmount"
            label="Amount"
            class="q-mr-sm col-3 q-mt-sm full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="payrollStore.selectedLoanDescription"
            label="Description"
            class="q-mr-sm col-3 q-mt-sm full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Select"
            :class="$q.screen.gt.sm ? 'text-center' : 'full-width'"
            color="negative"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
      <q-inner-loading :showing="payrollStore.workerLoanLoadiing" />
    </q-card-section>
  </q-card>

</template>
<script setup>
import { ref, reactive, onMounted, onBeforeMount, computed } from "vue";
import { useDiscountData } from "stores/branch/discountStore";
import { usePayrollData } from "src/stores/branch/payrollStore";
import { useLoanData } from "src/stores/branch/loanStore";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";

const payrollStore = usePayrollData();

const route = useRoute();
const emit = defineEmits(["hideLoanDialog"]);

const loanStore = useLoanData();
const staffStore = useUserData();

const stringOptions = reactive([]);
const options = ref(stringOptions);
const getUser = () => {
  console.log(formData.user);
};
const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      options.value = stringOptions;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = stringOptions.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const $q = useQuasar();

const onSubmit = () => {
  // console.log(payrollStore.selectedLoan)
  if (payrollStore.selectedLoan.length === 0 || payrollStore.selectedLoanAmount === 0 || payrollStore.selectedLoanDescription === '') {
    $q.notify({
      position: "bottom",
      type: "negative",
      timeout: 3000,
      message: "Please enter necessary data",
    });
  } else {
    // payrollStore.user = formData.user;
    // payrollStore.userName = formData.user.label;
    payrollStore.addDeductionLoanWorker();
    emit("hideLoanDialog");
  }
};
const extractStaff = () => {
  Object.entries(staffStore.rowStaffDatas).map(([key, val]) => {
    stringOptions.push({
      label: val.name,
      value: val.id,
    });
  });
};
onMounted(() => {
  extractStaff();
  payrollStore.getWorkerLoan(route.params.id);
});

const formData = reactive({
  description: "",
  name: "",
  number: 0,
  user: "",
  amount: 0,
});
</script>
<style scoped></style>
