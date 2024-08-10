<template>
  <q-page class="">
    <div class="bg-white text-black shadow-2">
      <q-toolbar>
        <q-toolbar-title class="text-h6">Change Image</q-toolbar-title>

        <q-btn
          icon="cloud_upload"
          color="secondary"
          size="sm"
          class="q-mr-sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: -10px"
          :label="$q.screen.gt.xs ? 'Upload Image' : ''"
          @click="UploadImage"
        />
        <q-btn
          icon="add_circle"
          color="primary"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: -10px"
          :label="$q.screen.gt.xs ? 'Capture Image' : ''"
          @click="CaptureImage"
        />
      </q-toolbar>
      <!-- <seeImg :img-file="imageChange" /> -->
      <div class="q-pl-lg">
        <img :src="imageSrc" width="600" />
      </div>

      <div class="q-mt-lg q-pb-lg q-pl-lg">
        <q-btn
          icon="save"
          color="primary"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: -10px"
          :label="$q.screen.gt.xs ? 'Save' : ''"
          @click="onUploadImage"
          v-if="showSaveBtn"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import seeImg from "src/components/users/member/viewImage.vue";
import { api } from "src/boot/axios";
import { useRoute } from "vue-router";
import { LocalStorage, useQuasar } from "quasar";

export default {
  emits: ["hideEditDialog", "captureImg"],
  props: ["memberId"],
  setup(props, { emit }) {
    const imageSrc = ref("");

    const $q = useQuasar();
    const showSaveBtn = ref(false);

    const route = useRoute();

    async function CaptureImage() {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        width: 100,
        height: 100,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      // The result will vary on the value of the resultType option.
      // CameraResultType.Uri - Get the result from image.webPath
      // CameraResultType.Base64 - Get the result from image.base64String
      // CameraResultType.DataUrl - Get the result from image.dataUrl
      imageSrc.value = image.webPath;
      viewImage(imageSrc.value);
    }
    async function UploadImage() {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      // The result will vary on the value of the resultType option.
      // CameraResultType.Uri - Get the result from image.webPath
      // CameraResultType.Base64 - Get the result from image.base64String
      // CameraResultType.DataUrl - Get the result from image.dataUrl
      imageSrc.value = image.webPath;
      viewImage(imageSrc.value);
    }

    const viewImage = (image) => {
      showSaveBtn.value = true;
      //   propmDisplay.value = true;
      //   emit("captureImg");
      console.log("prompt!");
      //   showCaptureImg.value = true;
      // console.log(image);
      // console.log(route.params.id);
    };

    const onUploadImage = async () => {
      $q.loading.show();

      // this.file_path = file[0];
      console.log(imageSrc.value);

      var newToken = LocalStorage.getItem("jwt");

      var fileData = new FormData();

      fileData.append("file_path", imageSrc.value);

      // fileData.append("_method", "PATCH");

      // console.log(fileData);
      // console.log([...fileData.entries()]);
      // console.log(fileData.entries());
      // fileData.forEach((value, key) => {
      //   console.log("key %s: value %s", key, value);
      // });

      await api
        .post("/api/member/" + route.params.id + "/upload-image", fileData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + newToken,
          },
        })
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
              // userStore.getAllMembers();
              // emit("hideCreateDialog");
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
              // userStore.getAllMembers();
              // emit("hideCreateDialog");
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return {
      imageSrc,
      CaptureImage,
      //   propmDisplay,
      onUploadImage,
      showSaveBtn,
      UploadImage,
    };
  },
  data() {
    return {
      //   imageSrc: null,
    };
  },
  computed: {
    imageChange() {
      console.log(this.imageSrc);
      return this.imageSrc;
    },
  },

  components() {
    seeImg;
  },
};
</script>

<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
