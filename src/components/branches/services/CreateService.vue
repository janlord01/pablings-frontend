<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-blue text-white">
      <q-toolbar-title> Create Service </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'col-5 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Service Name*"
              name="code"
              class="q-mr-sm col-3 full-width"
              type="text"
              v-model="formData.name"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="fastfood" />
              </template>
            </q-input>
          </div>
          <div :class="$q.screen.gt.xs ? 'col-3 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Price*"
              name="code"
              class="q-mr-sm col-3 full-width"
              type="text"
              v-model="formData.price"
              :rules="[(val) => !!val || 'Price is required']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </div>
          <div :class="$q.screen.gt.xs ? 'col-3 q-mr-sm' : 'full-width'">
            <!-- <q-input
              filled
              label="Time Duration*"
              class="q-mr-sm col-3 full-width"
              v-model="formData.timeDuration"
              :rules="[(val) => !!val || 'Price is required']"
            >
              <template v-slot:prepend>
                <q-icon name="access_time" />
              </template>
            </q-input> -->

            <q-select
              filled
              v-model="formData.timeDuration"
              :options="timeDuration"
              label="Time Duration"
            >
              <template v-slot:prepend>
                <q-icon name="access_time" />
              </template>
            </q-select>
          </div>
        </div>

        <div class="row q-col-gutter-none relative-position q-mt-md">
          <div :class="$q.screen.gt.xs ? 'full-width q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Description*"
              class="q-mr-sm col-3 full-width"
              type="textarea"
              v-model="formData.description"
              :rules="[(val) => !!val || 'Description is required']"
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none q-mb-xl relative-position">
          <div :class="$q.screen.gt.xs ? 'col-3 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label=""
              class="q-mr-sm col-3 full-width"
              type="file"
              v-model="formData.image"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
            </q-input>
          </div>
        </div>
        <!-- <q-separator color="orange" inset />
        <div class="row q-col-gutter-none relative-position">
          <q-toggle v-model="formData.sale" label="On Sale?" />
        </div> -->

        <div
          class="row q-col-gutter-none relative-position q-mb-lg"
          v-if="formData.sale"
        >
          <q-input
            filled
            label="Sale Price"
            class="q-mr-sm col-3"
            type="text"
            v-model="formData.sale_price"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
          </q-input>
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
import { useProductDatas } from "src/stores/branch/productStores";

import { useServicesData } from "stores/branch/servicesStore";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";
const route = useRoute();

const servicesStore = useServicesData();
const emit = defineEmits(["hideCreateDialog"]);

const productStore = useProductDatas();

const codes = reactive([]);
const $q = useQuasar();
const isPwd = ref(true);
const isPwdCon = ref(true);

const timeDuration = reactive([
  "30mins",
  "1hr",
  "1hr & 30mins",
  "2hrs",
  "2hrs $ 30mins",
  "3hrs",
  "3hrs & 30mins",
  "4hrs",
  "4hrs & 30mins",
  "5hrs",
  "5hrs & 30mins",
  "6hrs",
  "6hrs & 30mins",
  "7hrs",
  "7hrs & 30mins",
  "8hrs",
  // {
  //   label: "30mins",
  //   value: 0,
  // },
  // {
  //   label: "1hr",
  //   value: 1,
  // },
  // {
  //   label: "1hr & 30mins",
  //   value: 2,
  // },
  // {
  //   label: "2hrs",
  //   value: 3,
  // },

  // {
  //   label: "2hrs $ 30mins",
  //   value: 4,
  // },
  // {
  //   label: "3hrs",
  //   value: 5,
  // },

  // {
  //   label: "3hrs & 30mins",
  //   value: 6,
  // },
  // {
  //   label: "4hrs",
  //   value: 7,
  // },
  // {
  //   label: "4hrs & 30mins",
  //   value: 8,
  // },
  // {
  //   label: "5hrs",
  //   value: 9,
  // },
  // {
  //   label: "5hrs & 30mins",
  //   value: 10,
  // },
  // {
  //   label: "6hrs",
  //   value: 11,
  // },
  // {
  //   label: "6hrs & 30mins",
  //   value: 12,
  // },
  // {
  //   label: "7hrs",
  //   value: 13,
  // },
  // {
  //   label: "7hrs & 30mins",
  //   value: 14,
  // },
  // {
  //   label: "8hrs",
  //   value: 15,
  // },
]);

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

  var fileData = new FormData();
  fileData.append("image", formData.image != null ? formData.image[0] : null);
  fileData.append("service_name", formData.name);
  fileData.append("service_descr", formData.description);
  fileData.append("service_price", formData.price);
  fileData.append("time_duration", formData.timeDuration);
  fileData.append("branch_id", route.params.id);
  fileData.append("_method", "POST");

  api
    .post(
      "/api/services",
      fileData,
      // {
      //   name: formData.name,
      //   description: formData.description,
      //   price: formData.price,
      //   qty: formData.qty,
      //   sale: formData.sale,
      //   sale_price: formData.sale_price,
      //   img: formData.img,
      //   branch_id: route.params.id,
      // },
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
          $q.loading.hide();
          $q.notify({
            type: "positive",
            icon: "save",
            timeout: 1000,
            position: "bottom",
            message: response.data.message,
          });
          servicesStore.getAllServices(route.params.id);
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
};
onMounted(() => {
  //   getCodesFunc();
  // console.log(codes);
});

const formData = reactive({
  name: null,
  description: null,
  price: 0,
  timeDuration: null,
  image: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
src/stores/branch/productStores
