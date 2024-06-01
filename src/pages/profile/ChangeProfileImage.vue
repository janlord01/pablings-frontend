<template>
  <q-page class="">
    <div
      :class="
        $q.dark.isActive
          ? 'shadow-1 q-pa-md rounded-borders text-white bg-dark q-pa-lg'
          : 'shadow-1 q-pa-md rounded-borders text-dark bg-white q-pa-lg'
      "
      style="border-radius: 20px"
    >
      <q-toolbar class="q-mt-sm">
        <q-toolbar-title class="text-h6">Update Profile Image</q-toolbar-title>
      </q-toolbar>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <q-file
            filled
            bottom-slots
            v-model="img"
            label="Upload Image"
            counter
            max-files="12"
            class="full-width"
          >
            <template v-slot:before>
              <q-avatar>
                <img :src="imageSrc" />
              </q-avatar>
            </template>

            <template v-slot:append>
              <q-icon
                v-if="img !== null"
                name="close"
                @click.stop.prevent="img = null"
                class="cursor-pointer"
                color="blue"
              />
              <q-icon name="image" @click.stop.prevent />
            </template>

            <template v-slot:hint> Field hint </template>

            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                color="blue"
                type="submit"
                @click="onSubmit"
                icon="send"
              />
            </template>
          </q-file>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { ref, defineEmits, onMounted, reactive } from "vue";
// import snapPicture from "./viewImage.vue";
import { useUserData } from "src/stores/users/store";

import { LocalStorage, useQuasar } from "quasar";
import { api } from "src/boot/axios";

import { useRoute } from "vue-router";
import { useCompanyData } from "stores/company/store";
import { useMainStoreData } from "stores/store";

// import { saveAs } from "file-saver";

export default {
  emits: ["hideImageDialog", "captureImg"],
  props: ["userId"],
  setup(props, { emit }) {
    const companyStore = useCompanyData();
    const route = useRoute();

    const $q = useQuasar();
    const imageSrc = ref("");
    const showCaptureImg = ref(false);
    const img = ref(null);
    const userStore = useUserData();
    const mainStore = useMainStoreData();

    const formData = reactive({
      code: null,
    });
    const newToken = ref(LocalStorage.getItem("jwt"));
    const getMemberData = () => {
      api
        .get("/api/user/" + 0 + "/edit", {
          headers: {
            Authorization: "Bearer " + newToken.value,
          },
        })
        .then((response) => {
          // console.log(response);
          imageSrc.value = response.data.data.image_path;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const onSubmit = async () => {
      $q.loading.show();

      // this.file_path = file[0];

      var newToken = LocalStorage.getItem("jwt");

      var fileData = new FormData();

      fileData.append("file_path", img.value);

      await api
        .post("/api/user/" + 0 + "/upload-image", fileData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          // console.log(response);
          if (response.data.status == 200) {
            setTimeout(() => {
              $q.loading.hide();
              $q.notify({
                type: "positive",
                icon: "save",
                timeout: 3000,
                position: "bottom",
                message: response.data.message,
              });
              // emit("hideImageDialog");

              // userStore.getAllMembers();
              // companyStore.getAllOwners(route.params.slug);
              // userStore.getAllStaff([route.params.slug, route.params.id]);
              // emit("hideImageDialog");
              // userStore.getAllStaff();
              getMemberData();
              userStore.getUserDetails();
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
              // userStore.getAllMembers();
              // emit("hideCreateDialog");
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    onMounted(() => {
      getMemberData();

      mainStore.loc = "Update Profile Image";
      // console.log(codes);
    });

    return {
      img,
      onSubmit,
      imageSrc,
      getMemberData,
    };
  },
  data() {
    return {
      //   imageSrc: null,
    };
  },

  components() {
    snapPicture;
  },
};
</script>
