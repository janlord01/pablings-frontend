<template>
  <q-card
    style="max-width: 500px; width: 500px"
    class="rfid_card"
    @click="rfidCard('f1')"
  >
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-secondary text-white">
      <q-toolbar-title> Scan Rfid </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none" style="margin-top: -20px">
          <q-input
            filled
            v-model="formData.code"
            label="RFID"
            name="name"
            class="q-mr-sm full-width"
            id="rfitInput"
            style="opacity: 0"
            ref="f1"
            autofocus
            type="text"
          >
            <template v-slot:prepend>
              <q-icon name="qr_code_scanner" />
            </template>
          </q-input>

          <div class="text-center items-center item-center full-width">
            <p class="text-h5">Tap To Scan</p>
            <q-icon
              name="qr_code_scanner"
              :size="$q.screen.gt.xs ? '200px' : '150px'"
            />
            <p>
              <!-- code:  -->
              {{ formData.code }}
            </p>

            <p class="text-h6 text-negative">
              Please dont type anything in the keyboard.
            </p>
          </div>
        </div>
        <!-- <div class="row q-mt-lg align-center">
          <q-btn
            unelevated
            label="Create"
            class="text-center"
            color="secondary"
            size="md"
            type="submit"
          />
        </div> -->
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { mapActions, mapState } from "vuex";

const $q = useQuasar();
const emit = defineEmits(["hideCreateDialog"]);
const loadingSpinner = ref(true);
const newToken = ref(LocalStorage.getItem("jwt"));
const activeInput = ref(null);
const formData = reactive({
  code: null,
});
// const scanRfid = () => {
//   if (this.formData.code !== null) {
//     setTimeout(() => {
//       if (this.formData.code.length <= 7) {
//         this.$q.notify({
//           type: "negative",
//           position: "top",
//           message: "Please dont type anything in the keyboard",
//           timeout: 5000,
//         });
//         this.formData.code = null;
//       } else {
//         this.onSubmit();
//       }
//     }, 300);
//   }
// };
const rfidCard = (ref) => {
  this.activeInput = ref;

  this.$nextTick(() => this.$refs[this.activeInput].focus());
};
const onSubmit = async () => {
  this.$q.loading.show();
  await api
    .post(
      "/api/rfid",
      {
        rfid: this.formData.code,
      },
      {
        headers: {
          Authorization: "Bearer " + this.newToken,
        },
      }
    )
    .then((response) => {
      // console.log(response);
      this.formData.code = null;

      if (response.data.status === 200) {
        setTimeout(() => {
          this.$q.notify({
            type: "positive",
            position: "top",
            timeout: 3000,
            message: response.data.message,
          });
          // this.formData.code = null;
          this.getAllRfids();
          this.$q.loading.hide();
        }, 1000);
      } else {
        setTimeout(() => {
          $q.notify({
            type: "negative",
            position: "top",
            timeout: 3000,
            message: response.data.message,
          });
          $q.loading.hide();
        }, 3000);
      }
    })
    .catch((error) => {});
};
</script>
