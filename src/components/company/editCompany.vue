<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10' : 'bg-blue text-white'
      "
    >
      <q-toolbar-title> Update Company </q-toolbar-title>
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
              label="Company Name*"
              name="code"
              class="q-mr-sm col-3 q-mt-md full-width"
              type="text"
              v-model="formData.name"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>
          </div>

          <div :class="$q.screen.gt.xs ? 'col-5 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Contact*"
              name="code"
              class="q-mr-sm q-mt-md full-width"
              type="text"
              v-model="formData.contact"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'col-10 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Address*"
              name="addresss"
              class="q-mr-sm col-3 full-width"
              type="text"
              v-model="formData.address_detailed"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="location_on" />
              </template>
            </q-input>
            <!-- <GMapMap
              :center="{ lat: 51.093048, lng: 6.84212 }"
              :zoom="7"
              map-type-id="terrain"
              style="width: 1000px; height: 900px"
            >
            </GMapMap> -->
          </div>
          <div :class="$q.screen.gt.xs ? 'col-5 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Slug*"
              name="Slug"
              class="q-mr-sm col-3 full-width"
              type="text"
              v-model="formData.slug"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="link" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row align-center">
          <q-btn
            unelevated
            label="Update"
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

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";
import { useCompanyData } from "stores/company/store";

const companyStore = useCompanyData();
const route = useRoute();
const props = defineProps(["companyId"]);
const emit = defineEmits(["hideEditDialog"]);

const productStore = useProductDatas();

const codes = reactive([]);
const $q = useQuasar();
const isPwd = ref(true);
const isPwdCon = ref(true);

const getCompanyDetails = async () => {
  var newToken = LocalStorage.getItem("jwt");

  await api
    .get(`/api/company/${props.companyId}/details`, {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      // console.log(response);
      formData.name = response.data.data.name;
      formData.address_detailed = response.data.data.address_detailed;
      formData.contact = response.data.data.contact;
      formData.slug = response.data.data.slug;
    })
    .catch((error) => {
      console.log(error);
    });
};

const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();

  api
    .patch(
      `/api/company/${props.companyId}`,
      {
        company_name: formData.name,
        company_address: formData.address_detailed,
        company_contact: formData.contact,
        company_slug: formData.slug.replace(/\s+/g, "-").toLowerCase(),
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
          companyStore.getAllCompanies();

          // productStore.getAllProducts();
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
};
onMounted(() => {
  getCompanyDetails();
  //   getCodesFunc();
  // console.log(codes);
});

const formData = reactive({
  name: null,
  address_detailed: null,
  contact: null,
  slug: null,
  sku: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
src/stores/branch/productStores
