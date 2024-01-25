<template>
  <q-card style="max-width: 500px; width: 500; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Scan Qrcode </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="center stream">
          <qr-stream @decode="onDecode" class="mb">
            <div style="color: red" class="frame"></div>
          </qr-stream>
        </div>
        <!-- <div class="result">Result: {{ data }}</div> -->

        <div class="row full-width q-col-gutter-none relative-position q-mt-lg">
          <div class="col-9 align-center">
            <q-input
              filled
              v-model="state.data"
              label="Scan QrCode"
              class="full-width"
              type="text"
              readonly
            >
              <template v-slot:prepend>
                <q-icon name="qr_code" />
              </template>
            </q-input>
          </div>
          <div class="col-3 align-center" style="margin-top: 2px">
            <q-btn
              unelevated
              style="height: 50px"
              label="Scan"
              class="text-center"
              color="primary"
              size="md"
              type="submit"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { defineComponent, reactive, toRefs, ref } from "vue";
import { QrStream, QrCapture, QrDropzone } from "vue3-qr-reader";
import { useMonitorData } from "src/stores/branch/monitorStore";

import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";

import { useQuasar } from "quasar";

const monitorStore = useMonitorData();
const emit = defineEmits(["hideCheckinDialog"]);

const state = reactive({
  data: null,
});
const $q = useQuasar();

// const qrcode = ref(null);
const onDecode = (data) => {
  state.data = data;
  //   qrcode.data = data;
};

const onSubmit = () => {
  const newToken = LocalStorage.getItem("jwt");
  if (state.data == "") {
    $q.notify({
      type: "negative",
      color: "negative",
      timeout: 3000,
      position: "top",
      message: "Please Scan Qr code!",
    });
  } else {
    $q.loading.show();

    api
      .get("/api/monitor/" + state.data, {
        headers: {
          Authorization: "Bearer " + newToken,
        },
      })
      .then((response) => {
        // console.log(response);
        if (response.data.status == 200) {
          setTimeout(() => {
            monitorStore.getData(response.data.data.id);

            emit("hideCheckinDialog");
            $q.loading.hide();
            state.data = "";
          }, 2000);
        } else {
          setTimeout(() => {
            $q.notify({
              type: "negative",
              color: "negative",
              timeout: 3000,
              position: "top",
              message: response.data.message,
            });
            $q.loading.hide();
            state.data = "";
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
</script>

<style scoped>
.stream {
  max-height: 500px;
  max-width: 500px;
  margin: auto;
}
.frame {
  border-style: solid;
  border-width: 2px;
  border-color: red;
  height: 200px;
  width: 200px;
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  margin: auto;
}
</style>
