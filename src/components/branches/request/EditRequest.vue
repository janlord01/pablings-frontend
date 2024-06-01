<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 400px">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Update Request </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mr-sm">
            <q-editor v-model="description" min-height="10rem" />
          </div>
        </div>

        <div class="row align-center q-mt-md">
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
import { useProductDatas } from "src/stores/branch/productStores";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";
const route = useRoute();

const description = ref("");
const emit = defineEmits(["hideEditDialog"]);
const props = defineProps(["requestId"]);

const productStore = useProductDatas();

const $q = useQuasar();

const getRequestData = async () => {
  const newToken = LocalStorage.getItem("jwt");
  await api
    .get(`api/${route.params.slug}/order/${props.requestId}/edit`, {
      headers: {
        Authorization: "Bearer " + newToken,
      },
    })
    .then((response) => {
      console.log(response);
      description.value = response.data.data.description;
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
      "/api/products/branch/request/update/" + props.requestId,
      {
        // params: {
        description: description.value,
        // },
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
          productStore.getAllRequestBranch(route.params.id);
          emit("hideEditDialog");
        }, 1000);
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
        }, 3000);
      }
    })
    .catch((error) => {
      console.log(error);

      $q.loading.hide();
    });
};
onMounted(() => {
  getRequestData();
});

const formData = reactive({
  name: null,
  description: null,
  price: 0,
  qty: 0,
  sale: false,
  sale_price: 0,
  img: null,
});
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
