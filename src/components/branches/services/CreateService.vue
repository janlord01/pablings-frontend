<template>
  <q-card style="max-width: 500px; width: 500px; min-height: 230px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-blue text-white">
      <q-toolbar-title> Add Service </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'full-width' : 'full-width'">
            <q-select
              filled
              v-model="service"
              use-input
              input-debounce="0"
              label="Select Service"
              :options="options"
              @filter="filterFn"
              behavior="menu"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
        <!-- <div :class="$q.screen.gt.xs ? 'col-3 q-mr-sm' : 'full-width'">
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
        </div> -->

        <!-- <div
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
        </div> -->

        <div class="row align-center">
          <q-btn
            unelevated
            label="Select"
            class="text-center q-mt-sm"
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
const service = ref("");
const productStore = useProductDatas();

const $q = useQuasar();
const stringOptions = reactive([]);
const options = ref(stringOptions);
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
const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();

  // var fileData = new FormData();
  // fileData.append("image", formData.image != null ? formData.image[0] : null);
  // fileData.append("service_name", formData.name);
  // fileData.append("service_descr", formData.description);
  // fileData.append("service_price", formData.price);
  // fileData.append("time_duration", formData.timeDuration);
  // fileData.append("branch_id", route.params.id);
  // fileData.append("_method", "POST");

  api
    .post(
      "/api/services/assign/branch",
      // fileData,
      {
        service: service.value != "" ? service.value.value : "",
        slug: route.params.slug,
        branch: route.params.id,
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
          $q.loading.hide();
          $q.notify({
            type: "positive",
            icon: "save",
            timeout: 1000,
            position: "bottom",
            message: response.data.message,
          });
          servicesStore.getAllServicesBranch(route.params.id);
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
  Object.entries(servicesStore.rowServiceDatas).map(([key, val]) => {
    stringOptions.push({
      value: val.id,
      label: val.service_name,
    });
  });
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
