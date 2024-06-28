<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Update An Expense </q-toolbar-title>
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
            :options="['TF', 'CA', 'Others']"
            v-model="formData.type"
            label="Expense Type"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm full-width q-mt-sm ' : 'full-width'
            "
          >
            <template v-slot:prepend>
              <q-icon name="emoji_symbols" />
            </template>
          </q-select>
          <q-input
            filled
            v-if="formData.type === 'Others'"
            v-model="formData.description"
            label="Others"
            class="q-mr-sm col-3 q-mt-sm full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>
          <q-select
            filled
            v-model="formData.user"
            use-input
            input-debounce="0"
            label="Search Staff"
            @update:model-value="getUser"
            class="q-mr-sm col-3 q-mt-sm full-width"
            :options="options"
            @filter="filterFn"
            style="width: 250px"
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input
            filled
            v-model="formData.amount"
            label="Amount"
            class="q-mr-sm col-3 q-mt-sm full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Update"
            :class="$q.screen.gt.sm ? 'text-center' : 'full-width'"
            color="primary"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeMount, computed } from "vue";
import { useDiscountData } from "stores/branch/discountStore";

import { useExpensesData } from "stores/branch/expensesStore";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";
const route = useRoute();
const emit = defineEmits(["hideEditDialog"]);
const props = defineProps(["expensesId"]);

const expenseStore = useExpensesData();
const staffStore = useUserData();

const getUser = () => {
  // if (formData.user_id == formData.user.value) {
  let newUser =
    formData.user_id == formData.user.value
      ? formData.user_id
      : formData.user.value;
  console.log("new " + newUser);
  // }
  console.log("old " + formData.user_id);
};
const stringOptions = reactive([]);
const options = ref(stringOptions);
const getExpense = async () => {
  var newToken = LocalStorage.getItem("jwt");
  await api
    .get("api/expenses/" + props.expensesId, {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      console.log(response);
      formData.type = response.data.data.name;
      formData.user = response.data.data.userName;
      formData.user_id = response.data.data.user_id;
      formData.amount = response.data.data.amount;

      console.log(formData.user_id);
    })
    .catch((error) => {
      console.log(error);
    });
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
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

const $q = useQuasar();

const onSubmit = () => {
  let newUser =
    formData.user_id == formData.user.value
      ? formData.user_id
      : formData.user.value;
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  if (formData.type == null) {
    $q.notify({
      type: "negative",
      message: "Please Expenses Type",
      icon: "error",
    });
    $q.loading.hide();
  } else if (formData.amount == null) {
    $q.notify({
      type: "negative",
      message: "Please Enter Amount",
      icon: "error",
    });
    $q.loading.hide();
  } else {
    api
      .patch(
        "/api/expenses/" + props.expensesId,
        {
          description: formData.description,
          type: formData.type,
          amount: formData.amount,
          branch: route.params.id,
          user: newUser,
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
              type: "positive",
              icon: "save",
              timeout: 1000,
              position: "bottom",
              message: response.data.message,
            });
            expenseStore.getAllExpenses(route.params.id);
            emit("hideEditDialog");
            $q.loading.hide();
          }, 1000);
        } else {
          setTimeout(() => {
            $q.notify({
              type: "negative",
              icon: "error",
              timeout: 1000,
              position: "bottom",
              message: response.data.message,
            });
            $q.loading.hide();
          }, 3000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
  getExpense();
});

const formData = reactive({
  description: "",
  type: "CA",
  number: 0,
  user: "",
  user_id: "",
  amount: 0,
});
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
