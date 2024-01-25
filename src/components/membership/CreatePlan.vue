<template>
  <q-card style="max-width: 800px; width: 800px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10' : 'bg-blue text-white'
      "
    >
      <q-toolbar-title> Create Plan </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="col-4 q-mr-sm">
            <q-input
              filled
              label="Plan Name*"
              name="code"
              class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
              type="text"
              v-model="formData.name"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="title" />
              </template>
            </q-input>
          </div>
          <div class="col-3 q-mr-sm">
            <q-input
              filled
              label="Price"
              name="code"
              class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
              type="text"
              v-model="formData.price"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>
          <div class="col-4">
            <q-select
              filled
              :options="[
                'Free',
                'Daily',
                'Weekly',
                'Monthly',
                'Yearly',
                'Lifetime',
              ]"
              label="Type*"
              v-model="formData.type"
              class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="interests" />
              </template>
            </q-select>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div class="col-11 q-mr-sm">
            <q-input
              filled
              label="Description"
              name="phone"
              class="q-mr-sm col-3 q-mb-md full-width"
              type="textarea"
              v-model="formData.description"
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row align-center">
          <q-btn
            unelevated
            label="Create"
            class="text-center"
            color="blue"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useCodeData } from "stores/membership/storeCodes";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { usePlanData } from "src/stores/membership/storePlans";

const planStore = usePlanData();

const emit = defineEmits(["hideCreateDialog"]);

const codesStore = useCodeData();
const userStore = useUserData();

const codes = reactive([]);
const $q = useQuasar();

const getCodesFunc = () => {
  Object.entries(codesStore.rowDatas).map(([key, val]) => {
    codes.push({
      label: val.code,
      value: val.id,
    });
  });
};

const onSubmit = () => {
  //   if (isNaN(formData.price)) {
  //     $q.notify({
  //       type: "negative",
  //       icon: "error",
  //       timeout: 2000,
  //       position: "top",
  //       message: "Invalid Input, please enter number only!",
  //     });
  //   } else {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  api
    .post(
      "/api/plans",
      {
        name: formData.name,
        price: formData.price,
        type: formData.type,
        description: formData.description,
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
          planStore.getAllPlans();
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
  //   }
};
onMounted(() => {
  getCodesFunc();
  // console.log(codes);
});

const formData = reactive({
  name: null,
  price: null,
  type: null,
  description: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
