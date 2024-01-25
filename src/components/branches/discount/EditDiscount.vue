<template>
  <q-card style="max-width: 500px; width: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Update Discount </q-toolbar-title>
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
            :options="['Percentage', 'Amount']"
            v-model="formData.type"
            label="Discount Type"
            :class="
              $q.screen.gt.sm
                ? 'q-mr-sm full-width q-mt-md '
                : 'full-width q-mb-md'
            "
          >
            <template v-slot:prepend>
              <q-icon name="emoji_symbols" />
            </template>
          </q-select>
          <q-input
            filled
            v-model="formData.description"
            label="Name"
            name="code"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>
          <q-input
            filled
            v-model="formData.number"
            :label="formData.type == 'Amount' ? 'Amount' : 'Number'"
            name="code"
            class="q-mr-sm col-3 q-mt-md full-width"
            type="number"
          >
            <template v-slot:prepend>
              <q-icon
                :name="formData.type == 'Amount' ? 'attach_money' : 'percent'"
              />
            </template>
          </q-input>
        </div>
        <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Update"
            class="text-center"
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
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useDiscountData } from "stores/branch/discountStore";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";
const route = useRoute();

const emit = defineEmits(["hideEditDialog"]);
const props = defineProps(["discountId"]);

const discountStore = useDiscountData();

const $q = useQuasar();
const getDiscount = async () => {
  var newToken = LocalStorage.getItem("jwt");

  api
    .get("/api/discount/" + props.discountId + "/edit", {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      //   console.log(response);
      formData.description = response.data.data.description;
      formData.type = response.data.data.type;
      formData.number = response.data.data.number;
    })
    .catch((error) => {
      console.log(error);
    });
};
const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  if (formData.type == null) {
    $q.notify({
      type: "negative",
      message: "Please Select Type",
      icon: "error",
    });
    $q.loading.hide();
  } else if (formData.description == null) {
    $q.notify({
      type: "negative",
      message: "Please Enter Description",
      icon: "error",
    });
    $q.loading.hide();
  } else if (formData.number == null) {
    $q.notify({
      type: "negative",
      message: "Please Enter Amount/Percentage",
      icon: "error",
    });
    $q.loading.hide();
  } else if (formData.number == 0) {
    $q.notify({
      type: "negative",
      message: "Invalid Number!",
      icon: "error",
    });
    $q.loading.hide();
  } else if (formData.type == "Percentage" && formData.number > 100) {
    $q.notify({
      type: "negative",
      message: "Percentage not more than 100%",
      icon: "error",
    });
    $q.loading.hide();
  } else {
    api
      .patch(
        "/api/discount/" + props.discountId,
        {
          description: formData.description,
          type: formData.type,
          number: formData.number,
          //   branch: route.params.id,
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
            discountStore.getAllDiscounts(route.params.id);
            emit("hideEditDialog");
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
  }
};
onMounted(() => {
  getDiscount();
});

const formData = reactive({
  description: null,
  type: "Percentage",
  number: 0,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
