import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useMainStoreData = defineStore("MainStoreStore", {
  state: () => ({
    rowDatas: [],
    loc: "Barbershop System",
  }),
  getters: {},
  actions: {},
});
