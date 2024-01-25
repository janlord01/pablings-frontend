<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10' : 'bg-blue text-white'
      "
    >
      <q-toolbar-title> Create Supplier </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-6 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              label="Supplier Name*"
              name="code"
              class="full-width"
              type="text"
              v-model="formData.supplier_name"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="man" />
              </template>
            </q-input>
          </div>
          <div
            :class="
              $q.screen.gt.xs ? 'col-md-5 q-mr-sm' : 'col-sm-1 full-width'
            "
            :style="$q.screen.gt.xs ? '' : 'margin-bottom:0px;'"
          >
            <q-input
              filled
              label="Supplier Number*"
              name="code"
              class="col-3 full-width"
              type="text"
              v-model="formData.supplier_number"
              :rules="[(val) => !!val || 'Supplier number is required']"
            >
              <template v-slot:prepend>
                <q-icon name="phone" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-col-gutter-none relative-position">
          <div class="col-12">
            <q-input
              filled
              label="Address*"
              class="q-mr-sm col-3 full-width"
              type="textarea"
              v-model="formData.supplier_location"
              :rules="[(val) => !!val || 'Description is required']"
            >
              <template v-slot:prepend>
                <q-icon name="place" />
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
import { useSupplierData } from "stores/supplier/supplierStore";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";
const route = useRoute();

const emit = defineEmits(["hideCreateDialog"]);

const supplierStore = useSupplierData();

const codes = reactive([]);
const $q = useQuasar();
const isPwd = ref(true);
const isPwdCon = ref(true);

// const getCodesFunc = () => {
//   Object.entries(codesStore.rowDatas).map(([key, val]) => {
//     codes.push({
//       label: val.code,
//       value: val.id,
//     });
//   });
// };

const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();

  //   var fileData = new FormData();
  //   fileData.append("img", formData.img != null ? formData.img[0] : null);
  //   fileData.append("name", formData.name);
  //   fileData.append("description", formData.description);
  //   fileData.append("price", formData.price);
  //   fileData.append("msrp", formData.msrp);
  //   fileData.append("sku", formData.sku);
  //   fileData.append("type", "Supply");
  //   fileData.append("_method", "POST");

  api
    .post(
      `/api/${route.params.slug}/supplier`,
      {
        supplier_name: formData.supplier_name,
        supplier_location: formData.supplier_location,
        supplier_number: formData.supplier_number,
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
          supplierStore.getAllSupplier(route.params.slug);
          emit("hideCreateDialog");
        }, 2000);
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
        }, 2000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
onMounted(() => {
  //   getCodesFunc();
  // console.log(codes);
});

const formData = reactive({
  supplier_name: null,
  supplier_number: null,
  supplier_location: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
