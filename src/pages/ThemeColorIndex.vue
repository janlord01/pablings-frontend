<template>
  <q-page class="">
    <div
      class="text-black shadow-2 q-pa-md rounded-borders bg-white"
      style="border-radius: 20px"
    >
      <q-toolbar class="">
        <q-toolbar-title class="text-h6"
          >Customize Theme Colors</q-toolbar-title
        >
      </q-toolbar>

      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <q-input
            filled
            v-model="settingStore.themeColors.main"
            label="Main Theme Color"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm col-3 q-mt-sm ' : 'full-width q-mb-md'
            "
          >
            <template v-slot:append>
              <q-avatar :style="'background:' + settingStore.themeColors.main">
                <q-icon name="colorize" color="white" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="settingStore.themeColors.main"
                      default-view="palette"
                      default-value="#1976d2"
                    />
                  </q-popup-proxy>
                </q-icon>
              </q-avatar>
            </template>
          </q-input>

          <q-input
            filled
            v-model="settingStore.themeColors.text_color"
            label="Text Color"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm col-3 q-mt-sm ' : 'full-width q-mb-md'
            "
          >
            <template v-slot:append>
              <q-avatar
                :style="'background:' + settingStore.themeColors.text_color"
              >
                <q-icon name="colorize" color="white" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="settingStore.themeColors.text_color"
                      default-view="palette"
                      default-value="#1976d2"
                    />
                  </q-popup-proxy>
                </q-icon>
              </q-avatar>
            </template>
          </q-input>

          <q-input
            filled
            v-model="settingStore.themeColors.primary"
            label="Primary Color"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm col-3 q-mt-sm ' : 'full-width q-mb-md'
            "
          >
            <template v-slot:append>
              <q-avatar
                :style="'background:' + settingStore.themeColors.primary"
              >
                <q-icon name="colorize" color="white" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="settingStore.themeColors.primary"
                      default-view="palette"
                      default-value="#1976d2"
                    />
                  </q-popup-proxy>
                </q-icon>
              </q-avatar>
            </template>
          </q-input>

          <q-input
            filled
            v-model="settingStore.themeColors.secondary"
            label="Secondary Color"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm col-3 q-mt-sm ' : 'full-width q-mb-md'
            "
          >
            <template v-slot:append>
              <q-avatar
                :style="'background:' + settingStore.themeColors.secondary"
              >
                <q-icon name="colorize" color="white" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="settingStore.themeColors.secondary"
                      default-view="palette"
                      default-value="#1976d2"
                    />
                  </q-popup-proxy>
                </q-icon>
              </q-avatar>
            </template>
          </q-input>

          <q-input
            filled
            v-model="settingStore.themeColors.accent"
            label="Accent Color"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm col-3 q-mt-sm ' : 'full-width q-mb-md'
            "
          >
            <template v-slot:append>
              <q-avatar
                :style="'background:' + settingStore.themeColors.accent"
              >
                <q-icon name="colorize" color="white" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="settingStore.themeColors.accent"
                      default-view="palette"
                      default-value="#1976d2"
                    />
                  </q-popup-proxy>
                </q-icon>
              </q-avatar>
            </template>
          </q-input>

          <q-input
            filled
            v-model="settingStore.themeColors.positive"
            label="Positive Color"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm col-3 q-mt-sm ' : 'full-width q-mb-md'
            "
          >
            <template v-slot:append>
              <q-avatar
                :style="'background:' + settingStore.themeColors.positive"
              >
                <q-icon name="colorize" color="white" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="settingStore.themeColors.positive"
                      default-view="palette"
                      default-value="#1976d2"
                    />
                  </q-popup-proxy>
                </q-icon>
              </q-avatar>
            </template>
          </q-input>

          <q-input
            filled
            v-model="settingStore.themeColors.negative"
            label="Negative Color"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm col-3 q-mt-sm ' : 'full-width q-mb-md'
            "
          >
            <template v-slot:append>
              <q-avatar
                :style="'background:' + settingStore.themeColors.negative"
              >
                <q-icon name="colorize" color="white" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="settingStore.themeColors.negative"
                      default-view="palette"
                      default-value="#1976d2"
                    />
                  </q-popup-proxy>
                </q-icon>
              </q-avatar>
            </template>
          </q-input>

          <q-input
            filled
            v-model="settingStore.themeColors.info"
            label="Info Color"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm col-3 q-mt-sm ' : 'full-width q-mb-md'
            "
          >
            <template v-slot:append>
              <q-avatar :style="'background:' + settingStore.themeColors.info">
                <q-icon name="colorize" color="white" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="settingStore.themeColors.info"
                      default-view="palette"
                      default-value="#1976d2"
                    />
                  </q-popup-proxy>
                </q-icon>
              </q-avatar>
            </template>
          </q-input>

          <q-input
            filled
            v-model="settingStore.themeColors.warning"
            label="Warning Color"
            :class="
              $q.screen.gt.sm ? 'q-mr-sm col-3 q-mt-sm ' : 'full-width q-mb-md'
            "
          >
            <template v-slot:append>
              <q-avatar
                :style="'background:' + settingStore.themeColors.warning"
              >
                <q-icon name="colorize" color="white" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="settingStore.themeColors.warning"
                      default-view="palette"
                      default-value="#1976d2"
                    />
                  </q-popup-proxy>
                </q-icon>
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="row align-center q-mt-md">
          <q-btn
            unelevated
            label="Save"
            class="text-center"
            color="primary"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </div>

    <q-dialog v-model="updateImageDialog">
      <settingImageUpdate
        @hide-update-dialog="updateImageDialog = !updateImageDialog"
        @on-load-data="onLoadAllData"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount, watch } from "vue";
import { useCodeData } from "stores/membership/storeCodes";
import { useUserData } from "stores/users/store";
import { useSettingData } from "stores/settings/SettingStore";
import { colors, setCssVar } from "quasar";

import { LocalStorage, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import settingImageUpdate from "src/components/settingImageUpdate.vue";
const codesStore = useCodeData();
const userStore = useUserData();
const settingStore = useSettingData();
const $q = useQuasar();
const searchUser = ref(null);
const updateImageDialog = ref(false);
const name = ref(null);
const logo = ref(null);
const newToken = ref(LocalStorage.getItem("jwt"));

const textColor = ref(null);
const mainColor = ref(null);

watch(settingStore.themeColors, (newValue) => {
  // Do something with the updated value.
  console.log(newValue);
  textColor.value = newValue.text_color;
  mainColor.value = newValue.main;
  setCssVar("primary", newValue.primary);
  setCssVar("secondary", newValue.secondary);
  setCssVar("accent", newValue.accent);
  setCssVar("positive", newValue.positive);
  setCssVar("negative", newValue.negative);
  setCssVar("info", newValue.info);
  setCssVar("warning", newValue.warning);
  setCssVar("dark", newValue.text_color);
});
// const theme = watch(
//   () => settingStore.themeColors,
//   (newValue, oldValue) => {
//     console.log(newValue);
//     textColor.value = newValue.text_color;
//     mainColor.value = newValue.main;
//     setCssVar("primary", newValue.primary);
//     setCssVar("secondary", newValue.secondary);
//     setCssVar("accent", newValue.accent);
//     setCssVar("positive", newValue.positive);
//     setCssVar("negative", newValue.negative);
//     setCssVar("info", newValue.info);
//     setCssVar("warning", newValue.warning);
//     setCssVar("dark", newValue.text_color);
//   }
// );
const onSubmit = async () => {
  // userStore.onSearchStaff(searchUser.value);
  $q.loading.show();

  await api
    .post("/api/settings/theme/store", {
      main: settingStore.themeColors.main,
      text_color: settingStore.themeColors.text_color,
      primary: settingStore.themeColors.primary,
      secondary: settingStore.themeColors.secondary,
      accent: settingStore.themeColors.accent,
      positive: settingStore.themeColors.positive,
      negative: settingStore.themeColors.negative,
      info: settingStore.themeColors.info,
      warning: settingStore.themeColors.warning,
    })
    .then((response) => {
      console.log(response);
      if (response.data.status == 200) {
        // hiding in 2s
        setTimeout(() => {
          $q.loading.hide();
          $q.notify({
            type: "positive",
            color: "positive",
            timeout: 1000,
            position: "bottom",
            message: response.data.message,
          });
          settingStore.getColor();
          // emit("hideCreateDialog");
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
        }, 2000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const themeColor = reactive({
  main: null,
  text_color: null,
  primary: null,
  secondary: null,
  accent: null,
  positive: null,
  negative: null,
  info: null,
  warning: null,
  dark: null,
  dark_page: null,
});

const viewUpdateLogo = () => {
  updateImageDialog.value = true;
};
const onLoadAllData = async () => {
  await api
    .get("/api/settings", {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      // console.log(response
      // name.value = response.data.data.name;
      // logo.value = response.data.logo;
    })
    .catch((error) => {
      console.log(error);
    });
};

const showCreateDialog = ref(false);
const showImportDialog = ref(false);

const createDialog = () => {
  showCreateDialog.value = true;
};
const ImportDialog = () => {
  showImportDialog.value = true;
};
const formData = reactive({
  name: null,
  logo: null,
});
onMounted(() => {
  codesStore.getAllCodes();
  onLoadAllData();
  settingStore.getColor();
  // getCodesFunc();
  // console.log(codes);
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
