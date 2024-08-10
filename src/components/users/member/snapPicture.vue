<template>
  <q-card style="max-width: 800px; width: 800px" class="z-top">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Create Member </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <q-btn color="primary" label="Get Picture" @click="captureImage" />
        </div>
        <div>
          <img :src="imageSrc" />
        </div>
        <div class="row align-center">
          <q-btn
            unelevated
            label="Create"
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

<script>
import { ref } from "vue";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import snapPicture from "./viewImage.vue";

export default {
  emits: ["hideEditDialog", "captureImg"],
  props: ["memberId"],
  setup(props, { emit }) {
    const imageSrc = ref("");

    const showCaptureImg = ref(false);
    // const propmDisplay = ref(true);
    // const emit = defineEmits(["imageTest"]);

    async function captureImage() {
      //   propmDisplay.value = false;

      //   emit("hideEditDialog");
      //   showCaptureImg.value = true;

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        // source: CameraSource.Prompt,
      });

      // The result will vary on the value of the resultType option.
      // CameraResultType.Uri - Get the result from image.webPath
      // CameraResultType.Base64 - Get the result from image.base64String
      // CameraResultType.DataUrl - Get the result from image.dataUrl
      imageSrc.value = image.webPath;
      viewImage(imageSrc.value);
    }

    const viewImage = (image) => {
      //   propmDisplay.value = true;
      //   emit("captureImg");
      console.log("prompt!");
      showCaptureImg.value = true;
      console.log(image);
    };

    return {
      imageSrc,
      captureImage,
      //   propmDisplay,
      viewImage,
      showCaptureImg,
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
