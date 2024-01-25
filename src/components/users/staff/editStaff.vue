<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Update Staff </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="col-5 q-mr-sm">
            <q-input
              filled
              label="First Name*"
              name="code"
              class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
              type="text"
              v-model="formData.firstname"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>
          </div>
          <div class="col-2 q-mr-sm">
            <q-input
              filled
              label="Middle Name"
              name="code"
              class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
              type="text"
              v-model="formData.middlename"
            >
              <!-- <template v-slot:prepend>
                <q-icon name="numbers" />
              </template> -->
            </q-input>
          </div>
          <div class="col-4">
            <q-input
              filled
              label="Last Name*"
              name="code"
              class="q-mr-sm col-3 q-mt-md q-mb-md full-width"
              type="text"
              v-model="formData.lastname"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <!-- <template v-slot:prepend>
                <q-icon name="numbers" />
              </template> -->
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div class="col-4 q-mr-sm">
            <q-input
              filled
              v-model="formData.dob"
              mask="date"
              label="Birthday*"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="formData.dob">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-4 q-mr-sm">
            <q-select
              filled
              :options="['Male', 'Female']"
              label="Gender*"
              v-model="formData.gender"
              :class="$q.screen.gt.sm ? 'q-mr-sm full-width' : 'full-width '"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="wc" />
              </template>
            </q-select>
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
                <q-icon name="location_on" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div class="col-5 q-mr-md">
            <q-select
              filled
              :options="['super-admin', 'manager', 'cashier']"
              label="Role*"
              v-model="formData.role"
              :class="$q.screen.gt.sm ? 'q-mr-sm full-width' : 'full-width '"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="handyman" />
              </template>
            </q-select>
          </div>
          <div class="col-5 q-mr-xl">
            <q-input
              filled
              label="Email Address*"
              name="email"
              class="q-mb-md full-width"
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
        <!-- <q-separator color="black" class="q-mb-md" />
        <div class="row q-col-gutter-none relative-position">
          <p class="text-h6">Account Login</p>
          <div class="full-width q-mr-xl">
            <q-input
              filled
              label="Email Address*"
              name="email"
              class="q-mb-md full-width"
              type="email"
              v-model="formData.email"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
          </div> -->
        <!-- <div class="full-width q-mr-xl">
            <q-input
              filled
              label="Password*"
              name="email"
              class="q-mb-md full-width"
              :type="isPwd ? 'password' : 'text'"
              v-model="formData.password"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
          <div class="full-width q-mr-xl">
            <q-input
              filled
              label="Password Confirmation"
              name="email"
              class="q-mb-md full-width"
              :type="isPwdCon ? 'password' : 'text'"
              v-model="formData.password_confirmation"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwdCon ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdCon = !isPwdCon"
                />
              </template>
            </q-input>
          </div> -->
        <!-- </div> -->
        <!-- <div class="row q-col-gutter-none relative-position">
          <div class="col-12 q-mr-sm q-pr-xl">
            <q-input
              filled
              label="From what source did you know about BeeFit?"
              name="code"
              class="q-mr-sm col-3 q-mb-md full-width"
              type="text"
              v-model="formData.from"
            >
              <template v-slot:prepend>
                <q-icon name="not_listed_location" />
              </template>
            </q-input>
          </div>
        </div> -->
        <div class="row align-center">
          <q-btn
            unelevated
            label="Update"
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
<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useCodeData } from "stores/membership/storeCodes";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
const emit = defineEmits(["hideEditDialog"]);
const props = defineProps(["staffId"]);

const codesStore = useCodeData();
const userStore = useUserData();

const codes = reactive([]);
const $q = useQuasar();
const isPwd = ref(true);
const isPwdCon = ref(true);
const newToken = ref(LocalStorage.getItem("jwt"));

const getCodesFunc = () => {
  Object.entries(codesStore.rowDatas).map(([key, val]) => {
    codes.push({
      label: val.code,
      value: val.id,
    });
  });
};

const getStaffData = () => {
  api
    .get("/api/staff/" + props.staffId + "/edit", {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      // console.log(response);
      formData.firstname = response.data.data.firstname;
      formData.middlename = response.data.data.middlename;
      formData.lastname = response.data.data.lastname;
      formData.dob = response.data.data.birthday;
      formData.gender = response.data.data.gender;
      formData.phone = response.data.data.cp_number;
      formData.address = response.data.data.address;
      formData.profession = response.data.data.profession;
      formData.email = response.data.data.email;
      formData.role = response.data.data.roles[0].name;
    })
    .catch((error) => {
      console.log(error);
    });
};

const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  api
    .patch(
      "/api/staff/" + props.staffId,
      {
        firstname: formData.firstname,
        middlename: formData.middlename,
        lastname: formData.lastname,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        contact: formData.phone,
        role: formData.role,
        email: formData.email,
        // password: formData.password,
        // password_confirmation: formData.password_confirmation,
      },
      {
        headers: {
          Authorization: "Bearer " + newToken,
        },
      }
    )
    .then((response) => {
      // console.log(response);
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
          userStore.getAllStaff();
          emit("hideEditDialog");
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
        }, 2000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
onMounted(() => {
  getCodesFunc();
  getStaffData();
  // console.log(codes);
});

const formData = reactive({
  firstname: null,
  middlename: null,
  lastname: null,
  dob: null,
  gender: null,
  phone: null,
  address: null,
  profession: null,
  email: null,
  code: null,
  from: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
