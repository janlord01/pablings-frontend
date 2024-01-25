<template>
  <q-card style="max-width: 600px; width: 600px; min-height: 300px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-blue text-white">
      <q-toolbar-title> Update Logo </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="q-pa-md row q-col-gutter-none full-width"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="full-width row q-mb-lg">
          <q-input
            type="file"
            flat
            class="col-5"
            accept=".jpg, .png, image/*"
            v-model="logo"
          />

          <q-btn
            unelevated
            label="Change Logo"
            class="text-center col-4"
            color="blue"
            size="md"
            type="submit"
            icon="save"
          />
        </div>
        <q-img :src="image" spinner-color="white" class="col-5" />

        <div class="row q-mt-lg align-center full-width">
          <!-- <q-btn
            unelevated
            label="Change Logo"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
            icon="save"
          /> -->
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { useCompanyData } from "src/stores/company/store";
import { defineStore, mapStores } from "pinia";

const props = defineProps(["transactionsId"]);
const emit = defineEmits(["onLoadData", "hideUpdateDialog"]);
const ccompanyStore = useCompanyData();
const $q = useQuasar();
const route = useRoute();

const newToken = ref(LocalStorage.getItem("jwt"));
const searchUser = ref(null);
const image = ref(null);
const logo = ref(null);

const onSubmit = () => {
  $q.loading.show();
  var fileData = new FormData();
  fileData.append("file_path", logo.value[0]);

  fileData.append("_method", "PATCH");
  api
    .post("/api/settings/upload/logo/" + route.params.slug, fileData, {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      if (response.data.status === 200) {
        setTimeout(() => {
          $q.loading.hide();
          $q.notify({
            type: "positive",
            color: "positive",
            timeout: 1000,
            position: "bottom",
            message: response.data.message,
          });

          emit("hideUpdateDialog");
          emit("onLoadData");
          ccompanyStore.getCompany(route.params.slug);
        }, 2000);
      } else {
        setTimeout(() => {
          $q.loading.hide();
          $q.notify({
            type: "negative",
            color: "negative",
            timeout: 1000,
            position: "bottom",
            message: response.data.message,
          });
          logo.value = null;
        }, 2000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>
<!-- <script>
import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { useCompanyData } from "src/stores/company/store";
import { route } from "quasar/wrappers";
import { defineStore, mapStores } from "pinia";

export default defineComponent({
  props: ["transactionsId"],
  emits: ["onLoadData", "hideUpdateDialog"],
  setup() {
    const $q = useQuasar();
    const route = useRoute();

    return {
    };
  },
  data() {
    return {
      newToken: LocalStorage.getItem("jwt"),
      searchUser: "",
      image: null,
      logo: null,
    };
  },
  methods: {
    ...mapStores("useCompanyData"),
    onSubmit() {
      this.$q.loading.show();
      var fileData = new FormData();
      fileData.append("file_path", this.logo[0]);

      fileData.append("_method", "PATCH");
      api
        .post(
          "/api/settings/upload/logo/" + this.$route.params.slug,
          fileData,
          {
            headers: {
              Authorization: "Bearer " + this.newToken,
            },
          }
        )
        .then((response) => {
          if (response.data.status === 200) {
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "positive",
                color: "positive",
                timeout: 1000,
                position: "bottom",
                message: response.data.message,
              });

              this.$emit("hideUpdateDialog");
              this.$emit("onLoadData");
              this.useCompanyData.getCompany(route.params.slug);
            }, 2000);
          } else {
            setTimeout(() => {
              this.$q.loading.hide();
              this.$q.notify({
                type: "negative",
                color: "negative",
                timeout: 1000,
                position: "bottom",
                message: response.data.message,
              });
              this.logo = null;
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
  },
});
</script> -->
