<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 500px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-blue text-white">
      <q-toolbar-title> Create Staff </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'col-5 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="First Name*"
              name="code"
              class="q-mb-sm"
              type="text"
              v-model="formData.firstname"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>
          </div>
          <div :class="$q.screen.gt.xs ? 'col-2 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Middle Name"
              name="code"
              class="q-mb-sm"
              type="text"
              v-model="formData.middlename"
            >
              <!-- <template v-slot:prepend>
                <q-icon name="numbers" />
              </template> -->
            </q-input>
          </div>
          <div :class="$q.screen.gt.xs ? 'col-4' : 'full-width'">
            <q-input
              filled
              label="Last Name*"
              name="code"
              class="q-mb-sm"
              type="text"
              v-model="formData.lastname"
            >
              <!-- <template v-slot:prepend>
                <q-icon name="numbers" />
              </template> -->
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'col-4 q-mr-sm' : 'full-width'">
            <q-input
              filled
              v-model="formData.dob"
              mask="date"
              label="Birthday*"
              class="q-mb-sm"
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
          <div :class="$q.screen.gt.xs ? 'col-4 q-mr-sm' : 'full-width'">
            <q-select
              filled
              :options="['Male', 'Female']"
              label="Gender*"
              class="q-mb-sm"
              v-model="formData.gender"
            >
              <template v-slot:prepend>
                <q-icon name="wc" />
              </template>
            </q-select>
          </div>
          <div :class="$q.screen.gt.xs ? 'col-3 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Phone #*"
              name="phone"
              class="q-mb-sm"
              type="text"
              v-model="formData.phone"
            >
              <template v-slot:prepend>
                <q-icon name="local_phone" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'full-width q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Address*"
              name="addresss"
              class="q-mb-sm"
              type="text"
              v-model="formData.address"
            >
              <template v-slot:prepend>
                <q-icon name="location_on" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position q-mb-md">
          <div :class="$q.screen.gt.xs ? 'col-5 q-mr-sm' : 'full-width'">
            <q-select
              filled
              :options="['manager', 'cashier', 'barber']"
              label="Role*"
              class="q-mb-sm"
              v-model="formData.role"
            >
              <template v-slot:prepend>
                <q-icon name="handyman" />
              </template>
            </q-select>
          </div>
        </div>
        <q-separator color="black" class="q-mb-md" />
        <div class="row q-col-gutter-none relative-position">
          <p class="text-h6">Account Login</p>
          <div class="full-width q-mr-xl">
            <q-input
              filled
              label="Email Address*"
              name="email"
              class="q-mb-sm"
              type="email"
              v-model="formData.email"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
          </div>
          <div class="full-width q-mr-xl">
            <q-input
              filled
              label="Password*"
              name="email"
              class="q-mb-sm"
              :type="isPwd ? 'password' : 'text'"
              v-model="formData.password"
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
              class="q-mb-md"
              :type="isPwdCon ? 'password' : 'text'"
              v-model="formData.password_confirmation"
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
          </div>
        </div>
        <div class="row align-center">
          <q-btn
            unelevated
            label="Create"
            class="text-center"
            color="blue"
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
import { useRoute } from "vue-router";
// import { route } from "quasar/wrappers";
const emit = defineEmits(["hideCreateDialog", "createStaff"]);

const codesStore = useCodeData();
const userStore = useUserData();

const route = useRoute();

const codes = reactive([]);
const $q = useQuasar();
const isPwd = ref(true);
const isPwdCon = ref(true);

const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  api
    .post(
      `/api/${route.params.slug}/${route.params.id}/staff`,
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
        password: formData.password,
        password_confirmation: formData.password_confirmation,
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
          userStore.getAllStaff([route.params.slug, route.params.id]);
          emit("hideCreateDialog");
          emit("createStaff");
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
  role: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
