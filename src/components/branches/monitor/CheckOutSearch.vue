<template>
  <q-card style="max-width: 960px; width: 960px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Time-Out Member </q-toolbar-title>
      <q-btn
        unelevated
        label="Scan Qr"
        class="text-center"
        color="secondary"
        size="md"
        type="button"
        @click="checkInDialogFunc"
      />
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="col-12 q-mr-sm">
            <q-input
              filled
              v-model="searchMember"
              label="Search Member"
              class="col-3 full-width"
              type="text"
              @click="searchVisible = true"
              @keyup="searchMemberFunc"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-list
              bordered
              separator
              class="full-width text-white z-max bg-grey-10"
              v-if="searchVisible && memberToggle"
            >
              <p
                clickable
                v-ripple
                v-for="item in filterMember"
                v-bind:key="item.id"
              >
                <q-item
                  clickable
                  v-ripple
                  v-for="member in item"
                  :key="member.id"
                  @click="selectStudent(member)"
                >
                  <q-item-section>
                    <q-item-label class="text-white">{{
                      member.name
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </p>
            </q-list>
          </div>
        </div>
        <div v-if="status">
          <div class="row q-col-gutter-none relative-position q-mt-lg q-mb-md">
            <div class="col-3">
              <div class="">
                <!-- <vue-qrcode :value="formData.code"></vue-qrcode> -->
                Name:
                <q-chip dense>
                  {{ formData.name }}
                </q-chip>
              </div>
            </div>
            <div class="col-3">
              <div class="">
                Status:
                <q-chip dense>
                  <q-avatar
                    :color="
                      status == 'No Plan'
                        ? 'orange'
                        : status == 'Expired' || status == 'Please Assign code'
                        ? 'red'
                        : 'green'
                    "
                    text-color="white"
                  ></q-avatar>
                  {{ status }}
                </q-chip>
              </div>
            </div>
            <div class="col-4">
              <div class="">
                {{ status !== "Please Assign code" ? "Subscription:" : "" }}
                <q-chip dense v-if="status == 'Active'">
                  {{ moment(formData.startDate).format("MMMM D, YYYY") }}
                  -
                  {{ moment(formData.endDate).format("MMMM D, YYYY") }}
                </q-chip>
                <q-btn
                  v-else-if="status == 'Please Assign code'"
                  unelevated
                  label="Assign Code"
                  class="text-center"
                  color="primary"
                  size="md"
                  :to="'/user/members'"
                  type="button"
                />
                <q-btn
                  v-else
                  unelevated
                  label="Enroll"
                  class="text-center"
                  color="primary"
                  size="md"
                  type="button"
                  :to="'/branches/' + route.params.id + '/cashier'"
                />
              </div>
            </div>
            <!-- <div class="col-3">
              <div class="">
                <q-btn
                  unelevated
                  label="Enroll"
                  class="text-center"
                  color="primary"
                  size="md"
                  type="button"
                />
              </div>
            </div> -->
          </div>
          <div class="row q-col-gutter-none relative-position">
            <div class="col-4 q-mr-sm">
              <q-input
                filled
                label="Birthday"
                class="q-mr-sm col-3 q-mb-md full-width"
                type="text"
                v-model="formData.dob"
              >
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
              </q-input>
            </div>
            <div class="col-4 q-mr-sm">
              <q-input
                filled
                label="Gender"
                name="phone"
                class="q-mr-sm col-3 q-mb-md full-width"
                type="text"
                v-model="formData.gender"
              >
                <template v-slot:prepend>
                  <q-icon name="wc" />
                </template>
              </q-input>
            </div>
            <div class="col-3 q-mr-sm">
              <q-input
                filled
                label="Phone #*"
                name="phone"
                class="q-mr-sm col-3 q-mb-md full-width"
                type="text"
                v-model="formData.phone"
              >
                <template v-slot:prepend>
                  <q-icon name="local_phone" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-none relative-position q-mb-sm q-mt-sm">
            <div class="col-12 q-pr-xl">
              <q-input
                filled
                label="Address*"
                name="addresss"
                class="q-mr-sm col-3 full-width"
                type="text"
                v-model="formData.address"
                :rules="[(val) => !!val || 'Field is required']"
              >
                <template v-slot:prepend>
                  <q-icon name="account_circle" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-none relative-position">
            <div class="col-3 q-mr-sm">
              <q-input
                filled
                label="Profession"
                class="q-mr-sm col-3 q-mb-md full-width"
                v-model="formData.profession"
              >
                <template v-slot:prepend>
                  <q-icon name="handyman" />
                </template>
              </q-input>
            </div>

            <div class="col-4 q-mr-sm">
              <q-input
                filled
                label="Email Address*"
                name="email"
                class="q-mr-sm col-3 q-mb-md full-width"
                type="email"
                v-model="formData.email"
                :rules="[(val) => !!val || 'Field is required']"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <div class="row align-center q-mt-md">
          <q-btn
            unelevated
            label="Check-Out"
            class="text-center"
            color="primary"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
  <!-- Qrcode -->
  <q-dialog v-model="showCheckInDialog">
    <CheckOut @hide-checkin-dialog="showCheckInDialog = !showCheckInDialog" />
  </q-dialog>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeMount, computed, watch } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";

import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useMonitorData } from "src/stores/branch/monitorStore";
import { useRoute } from "vue-router";
import monito from "components/branches/cashier/SearchProduct.vue";
import searchPlan from "components/branches/cashier/SearchPlan.vue";
import CheckIn from "src/components/branches/monitor/CheckIn.vue";
import moment from "moment";

import VueQrcode from "@chenfengyuan/vue-qrcode";
import CheckOut from "./CheckOut.vue";
// import VueQRCodeComponent from "vue-qrcode-component";

const route = useRoute();

const emit = defineEmits(["hideCheckoutDialog"]);

const newToken = ref(LocalStorage.getItem("jwt"));
const allMembers = reactive([]);
const filterMember = reactive({});

const searchMember = ref(null);
const seletedMember = ref(null);
const searchVisible = ref(false);
const showCheckInDialog = ref(false);
const status = ref(null);

const monitorStore = useMonitorData();

const checkInDialogFunc = () => {
  showCheckInDialog.value = true;
  searchMember.value = "";
  //   status.value == "";
};

const $q = useQuasar();

const selectStudent = async (member) => {
  //   console.log(member);
  // this.searchSubject = null;
  seletedMember.value = null;
  searchMember.value = member.name;
  seletedMember.value = member.id;
  formData.member_id = member.id;
  searchVisible.value = false;
  monitorStore.getData(member.id);
};
const getMembers = async () => {
  await api
    .get("/api/members/", {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      //   console.log(response);
      allMembers.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });

  //   console.log(allMembers.value);
};

const searchMemberFunc = () => {
  // console.log("work!!");
  searchVisible.value = true;
  const query =
    searchMember.value != null ? searchMember.value.toLowerCase() : "";
  if (searchMember.value == "" || searchMember.value == null) {
    filterMember.value = allMembers.value;
  } else {
    filterMember.value = allMembers.value.filter((student) => {
      return Object.values(student).some((word) =>
        String(word).toLowerCase().includes(query)
      );
    });
    // console.log(filterMember.value);
  }
};

const onLoad = () => {
  //   console.log(monitorStore.memberDatas);
  //   formData.name = monitorStore.memberDatas["name"];
};

const onSubmit = () => {
  if (formData.member_id == "" || formData.member_id == null) {
    $q.notify({
      type: "negative",
      color: "negative",
      timeout: 3000,
      position: "top",
      message: "Please Search of Scan Member!",
    });
  } else if (
    status.value == "Please Assign code" ||
    status.value == "No Plan"
  ) {
    $q.notify({
      type: "negative",
      color: "negative",
      timeout: 3000,
      position: "top",
      message: "Please Register First! Before proceeding!",
    });
  } else {
    // console.log(formData.member_id);
    $q.loading.show();
    const newToken = LocalStorage.getItem("jwt");
    api
      .patch(
        "/api/monitor/" + formData.member_id,
        {
          //   user: formData.member_id,
          branch: route.params.id,
        },
        {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.status == 200) {
          setTimeout(() => {
            $q.notify({
              type: "positive",
              color: "positive",
              timeout: 2000,
              position: "top",
              message: response.data.message,
            });
            $q.loading.hide();
            // state.data = "";
            emit("hideCheckoutDialog");
            $q.loading.hide();
            monitorStore.getAllLogs(route.params.id);
          }, 2000);
        } else {
          setTimeout(() => {
            $q.notify({
              type: "negative",
              color: "negative",
              timeout: 10000,
              position: "top",
              message: response.data.message,
            });
            $q.loading.hide();
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const memberDatas = watch(
  () => monitorStore.memberDatas,
  (newValue, oldValue) => {
    // console.log("new value" + newValue);
    formData.name = newValue.name;
    formData.member_id = newValue.user_id;
    formData.dob = moment(newValue.birthday).format("MMMM D, YYYY");
    formData.gender = newValue.gender;
    formData.phone = newValue.cp_number;
    formData.address = newValue.address;
    formData.profession = newValue.profession;
    formData.email = newValue.email;
    formData.startDate = moment(newValue.start_date).format("MMMM D, YYYY");
    formData.endDate = moment(newValue.end_date).format("MMMM D, YYYY");
    formData.code = newValue.code;
  }
);

const memberPlan = watch(
  () => monitorStore.status,

  (newValue, oldValue) => {
    // console.log("new value" + newValue);
    status.value = newValue;
  }
);

computed(
  () => monitorStore.memberDatas,
  (value) => {
    // return console.log(value);
  }
);
onMounted(() => {
  getMembers();
  onLoad();
  //   monitorStore.getData(0);
});

const memberToggle = ref(true);
const guestName = ref(null);
const formData = reactive({
  name: null,
  dob: null,
  gender: null,
  phone: null,
  address: null,
  profession: null,
  email: null,
  startDate: null,
  endDate: null,
  code: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
src/stores/branch/productStores
