<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Update Benefit </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none">
          <!-- <q-select
            filled
            :options="['Tip', 'CA', 'Others']"
            v-model="formData.type"
            label="Expense Type"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm full-width q-mt-sm ' : 'full-width'
            "
          >
            <template v-slot:prepend>
              <q-icon name="emoji_symbols" />
            </template>
          </q-select> -->
          <!-- <q-input
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
          </q-input> -->
          <!-- <q-select
            filled
            v-model="formData.user"
            use-input
            input-debounce="0"
            label="Search Staff"
            class="q-mr-sm col-3 q-mt-sm full-width"
            :options="options"
            @filter="filterFn"
            @update:model-value="getUser"
            style="width: 250px"
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select> -->

          <q-input
            filled
            v-model="formData.name"
            label="Benefit Name"
            class="q-mr-sm col-3 q-mt-sm full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>
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

import { useBenefitsData } from "src/stores/branch/benefitStore";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";
const route = useRoute();
const emit = defineEmits(["hideEditDialog"]);
const props = defineProps(["benefitId"]);

const benefitStore = useBenefitsData();
const staffStore = useUserData();

const stringOptions = reactive([]);
const options = ref(stringOptions);

const getBenefit = async () => {
  var newToken = LocalStorage.getItem("jwt");
  await api
    .get("api/benefits/" + props.benefitId + "/edit", {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      // console.log(response);
      formData.name = response.data.data.benefit_name;
      formData.amount = response.data.data.amount;

      console.log(formData.user_id);
    })
    .catch((error) => {
      console.log(error);
    });
};
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
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  if (formData.name == null) {
    $q.notify({
      type: "negative",
      message: "Benefit name is required!",
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
        "/api/benefits/" + props.benefitId,
        {
          amount: formData.amount,
          // branch: route.params.id,
          name: formData.name,
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
            benefitStore.getAllBenefits(route.params.id);
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
  getBenefit();
});

const formData = reactive({
  amount: 0,
  name: "",
});
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
