<template>
  <q-page class="">
    <div
      :class="
        $q.dark.isActive
          ? 'shadow-1 q-pa-md rounded-borders text-white bg-dark q-pa-lg'
          : 'shadow-1 q-pa-md rounded-borders text-dark bg-white q-pa-lg'
      "
      style="border-radius: 20px"
    >
      <q-toolbar class="q-mt-sm">
        <q-toolbar-title class="text-h6">Update Profile</q-toolbar-title>
      </q-toolbar>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.md ? 'col-5 q-mr-sm' : 'full-width'">
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
          <div :class="$q.screen.gt.md ? 'col-2 q-mr-sm' : 'full-width'">
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
          <div :class="$q.screen.gt.md ? 'col-4' : 'full-width'">
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
          <div :class="$q.screen.gt.md ? 'col-4 q-mr-sm' : 'full-width'">
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
          <div :class="$q.screen.gt.md ? 'col-4 q-mr-sm' : 'full-width'">
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
          <div :class="$q.screen.gt.md ? 'col-3 q-mr-sm' : 'full-width'">
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
          <div :class="$q.screen.gt.md ? 'full-width q-mr-sm' : 'full-width'">
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
        <div class="row q-col-gutter-none relative-position">
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
        </div>
        <div class="row align-center">
          <q-btn
            unelevated
            label="Update"
            class="text-center"
            color="blue"
            size="md"
            type="submit"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useBranchData } from "stores/branch/store";
import { LocalStorage, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import staffList from "src/components/staff/StaffList.vue";
import createStaff from "src/components/staff/CreateBarberStaff.vue";
import importMember from "src/components/users/member/importMember.vue";
import { useMainStoreData } from "stores/store";
import { useUserData } from "stores/users/store";
import { useRoute, useRouter } from "vue-router";

const mainStore = useMainStoreData();
const router = useRouter();
const userStore = useUserData();

const $q = useQuasar();

const route = useRoute();

const getStaffData = () => {
  var newToken = LocalStorage.getItem("jwt");
  api
    .get(`/api/${route.params.slug}/staff/` + 0 + `/edit`, {
      headers: {
        Authorization: "Bearer " + newToken,
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
      `/api/${route.params.slug}/staff/${0}`,
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
          userStore.getUserDetails();
        }, 1000);
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
        }, 3000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
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

onMounted(() => {
  mainStore.loc = "Update Profile";
  getStaffData();
});
</script>
