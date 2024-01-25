import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useQuasar, Notify, Loading, LocalStorage } from "quasar";

export const useMonitorData = defineStore("MonitorStore", {
  this: () => ({
    rowDatas: [],
    memberDatas: [],
    status: "",
  }),
  getters: {},
  actions: {
    async getAllLogs(payload) {
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("api/monitor/branch/all/" + payload, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          //   this.rowDatas = response.data.data;
          this.rowDatas = [];
          // console.log(payload);
          if (response) {
            Object.entries(response.data.data).map(([key, val]) => {
              this.rowDatas.push({
                id: val.id,
                branch_id: val.branch_id,
                user_id: val.user_id,
                name: val.name,
                staff_id: val.staff_id,
                time_in: val.time_in,
                time_out: val.time_out,
              });
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getData(payload) {
      var newToken = LocalStorage.getItem("jwt");
      await api
        .get("/api/userplan/" + payload, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          //   console.log(response);
          this.memberDatas = response.data.data;
          this.status = response.data.plan;

          //   console.log(this.memberDatas);

          //   status.value = response.data.plan;
          //   formData.name = response.data.data.name;
          //   formData.startDate = response.data.data.start_date;
          //   formData.endDate = response.data.data.end_date;
          //   formData.phone = response.data.data.cp_number;
          //   formData.gender = response.data.data.gender;
          //   formData.address = response.data.data.address;
          //   formData.profession = response.data.data.profession;
          //   formData.email = response.data.data.email;
          //   formData.dob = moment(response.data.data.birthday).format(
          //     "MMMM D, YYYY"
          //   );
          //   allMembers.value = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
