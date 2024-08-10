import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useInventoryData = defineStore("inventoryStore", {
  state: () => ({
    rowDatas: [],
    tempRowDatas: [],
    rowDatasOwner: [],
    rowTempProducts: [],
    skeleton: true,
    loading: true,
  }),
  getters: {},
  actions: {
    async getAllInventories(payload) {
      this.loading = true;
      this.skeleton = true;
      this.tempRowDatas = [];
      this.rowDatas = [];
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get(
          `/api/${payload[0]}/inventory`,
          {
            params: { branch_id: payload[1] },
          },
          {
            headers: {
              Authorization: "Bearer " + newToken,
            },
          }
        )
        .then((response) => {
          console.log(response);

          // if (response.data.data) {
          if (response.status === 200) {
            // setTimeout(() => {
            this.tempRowDatas = response.data.data;

            this.rowDatas = this.tempRowDatas;
            this.skeleton = false;
            this.loading = false;
            // }, 3000);
          }

          // }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // Add product on the create Invetory
    addProductOnCreateInventory(payload) {
      // this.rowTempProducts = [];
      this.rowTempProducts.push(payload);

      // console.log(this.rowTempProducts);
    },
    clearTempProducts() {
      this.rowTempProducts = [];
    },
    //
    getAddedProductInventory(payload) {
      console.log(payload);
      this.rowTempProducts = [];
      // Object.entries(payload).map(([key, val]) => {
      this.rowTempProducts = payload;

      // console.log(this.rowTempProducts);
      //   })
      // })
      // this.rowTempProducts = payload;
    },
    onSearch(payload) {
      if (payload[0] == null || payload[0] == "" || payload[0].length == 0) {
        this.getAllInventories(payload[1]);
      } else {
        const needle = payload[0].toLowerCase();
        this.rowDatas = this.tempRowDatas.filter((v) => {
          return Object.values(v).some(
            (word) => String(word).toLowerCase().indexOf(needle) > -1
          );
        });
      }
    },
  },
});
