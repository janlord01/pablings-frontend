import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { route } from "quasar/wrappers";
import { useQuasar } from "quasar";
import { Notify, Loading, LocalStorage } from "quasar";
import { useRoute, useRouter } from "vue-router";

export const useSettingData = defineStore("settingStore", {
  state: () => ({
    rowDatas: [],
    themeColors: {
      main: "",
      text_color: "",
      primary: "",
      secondary: "",
      accent: "",
      positive: "",
      negative: "",
      info: "",
      warning: "",
      dark: "",
      dark_page: "",
    },
  }),
  getters: {
    getMainColor: (state) => state.themeColors.main,
  },
  actions: {
    async getColor() {
      await api
        .get("/api/settings/theme")
        .then((response) => {
          // console.log(response);
          this.themeColors.main =
            response.data.data != null ? response.data.data.main : "#1976d2";
          this.themeColors.text_color =
            response.data.data != null ? response.data.data.text_color : "#fff";
          this.themeColors.primary =
            response.data.data != null ? response.data.data.primary : "#1976d2";
          this.themeColors.secondary =
            response.data.data != null
              ? response.data.data.secondary
              : "#26a69a";
          this.themeColors.accent =
            response.data.data != null ? response.data.data.accent : "#9c27b0";
          this.themeColors.positive =
            response.data.data != null
              ? response.data.data.positive
              : "#21ba45";
          this.themeColors.negative =
            response.data.data != null
              ? response.data.data.negative
              : "#c10015";
          this.themeColors.info =
            response.data.data != null ? response.data.data.info : "#31ccec";
          this.themeColors.warning =
            response.data.data != null ? response.data.data.warning : "#f2c037";
          this.themeColors.dark =
            response.data.data != null ? response.data.data.text_color : "#fff";

          // console.log(this.themeColors);
        })

        .catch((error) => {
          console.log(error);
        });
    },
  },
});
