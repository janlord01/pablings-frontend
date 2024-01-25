<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="step"
      ref="stepper"
      :header-class="
        $q.dark.isActive
          ? 'text-white bg-blue-grey-10'
          : 'text-dark bg-blue-grey-1'
      "
      animated
      flat
      active-color="blue"
    >
      <q-step
        :name="1"
        title="Owner's Details"
        icon="perm_identity"
        done-icon="check"
        active-icon="perm_identity"
        done-color="blue"
        :done="step > 1"
      >
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'col-5 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="First Name*"
              name="code"
              class="q-mr-sm col-3"
              type="text"
              v-model="formData.firstname"
              :rules="[(val) => !!val || 'Field is required']"
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
              class="q-mr-sm col-3"
              type="text"
              v-model="formData.middlename"
            >
              <!-- <template v-slot:prepend>
                <q-icon name="numbers" />
              </template> -->
            </q-input>
          </div>
          <div
            :class="$q.screen.gt.xs ? 'col-4 q-mr-sm' : 'full-width q-mt-md'"
          >
            <q-input
              filled
              label="Last Name*"
              name="code"
              class="q-mr-sm col-3"
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
          <div :class="$q.screen.gt.xs ? 'col-4 q-mr-sm' : 'full-width'">
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
          <div :class="$q.screen.gt.xs ? 'col-4 q-mr-sm' : 'full-width'">
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
          <div :class="$q.screen.gt.xs ? 'col-3 q-mr-sm' : 'full-width'">
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
        <!-- <div class="row q-col-gutter-none relative-position q-mb-sm q-mt-sm">
          <div :class="$q.screen.gt.xs ? 'col-12 q-pr-xl' : 'full-width'">
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
        </div> -->
        <!-- <div class="row q-col-gutter-none relative-position">
          <div class="col-5">
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
        </div> -->
        <q-separator color="black" class="q-mb-md" />
        <div class="row q-col-gutter-none relative-position">
          <p class="text-h6">Account Login</p>
          <div class="full-width q-mr-xl">
            <q-input
              filled
              label="Email Address*"
              name="email"
              class="full-width"
              type="email"
              v-model="formData.email"
              :rules="[(val) => !!val || 'Field is required']"
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
              class="full-width"
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
              class="full-width"
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
          </div>
        </div>
      </q-step>

      <q-step
        :name="2"
        title="Company Details"
        icon="create_new_folder"
        done-color="blue"
        done-icon="check"
        active-icon="create_new_folder"
        :done="step > 2"
      >
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'col-5 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Company Name*"
              name="code"
              class="q-mr-sm col-3 q-mt-md full-width"
              type="text"
              v-model="company.name"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>
          </div>

          <div :class="$q.screen.gt.xs ? 'col-5 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Contact*"
              name="code"
              class="q-mr-sm q-mt-md full-width"
              type="text"
              v-model="company.contact"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'col-10 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Address*"
              name="addresss"
              class="q-mr-sm col-3 full-width"
              type="text"
              v-model="company.address_detailed"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="location_on" />
              </template>
            </q-input>
            <!-- <GMapMap
              :center="{ lat: 51.093048, lng: 6.84212 }"
              :zoom="7"
              map-type-id="terrain"
              style="width: 1000px; height: 900px"
            >
            </GMapMap> -->
          </div>
          <div :class="$q.screen.gt.xs ? 'col-5 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Slug*"
              name="Slug"
              class="q-mr-sm col-3 full-width"
              type="text"
              v-model="company.slug"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="link" />
              </template>
            </q-input>
            <!-- <GMapMap
              :center="{ lat: 51.093048, lng: 6.84212 }"
              :zoom="7"
              map-type-id="terrain"
              style="width: 1000px; height: 900px"
            >
            </GMapMap> -->
          </div>
        </div>
      </q-step>

      <q-step
        :name="3"
        title="Main Branch Details"
        icon="store"
        done-color="blue"
        done-icon="check"
        active-icon="store"
      >
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'col-5 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Branch Name*"
              name="code"
              class="q-mr-sm col-3 q-mt-md full-width"
              type="text"
              v-model="branch.name"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>
          </div>

          <div :class="$q.screen.gt.xs ? 'col-5 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Branch Contact*"
              name="code"
              class="q-mr-sm q-mt-md full-width"
              type="text"
              v-model="branch.contact"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'col-10 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Branch Address*"
              name="addresss"
              class="q-mr-sm col-3 full-width"
              type="text"
              v-model="branch.address_detailed"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="location_on" />
              </template>
            </q-input>
            <!-- <GMapMap
              :center="{ lat: 51.093048, lng: 6.84212 }"
              :zoom="7"
              map-type-id="terrain"
              style="width: 1000px; height: 900px"
            >
            </GMapMap> -->
          </div>
          <div :class="$q.screen.gt.xs ? 'col-5 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Branch code"
              name="Slug"
              class="q-mr-sm col-3 full-width"
              type="text"
              v-model="branch.code"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="link" />
              </template>
            </q-input>
            <!-- <GMapMap
              :center="{ lat: 51.093048, lng: 6.84212 }"
              :zoom="7"
              map-type-id="terrain"
              style="width: 1000px; height: 900px"
            >
            </GMapMap> -->
          </div>
        </div>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="step === 3 ? onSubmit() : $refs.stepper.next()"
            color="blue"
            :label="step === 3 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="grey"
            @click="$refs.stepper.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";

import { useRoute, useRouter } from "vue-router";

const $q = useQuasar();

const router = useRouter();

const isPwd = ref(true);
const isPwdCon = ref(true);

const formData = reactive({
  firstname: null,
  middlename: null,
  lastname: null,
  dob: null,
  gender: null,
  phone: null,
  address_detailed: null,
  // profession: null,
  email: null,
  password: null,
  password_confirmation: null,
});

const company = reactive({
  name: null,
  contact: null,
  lat: null,
  lang: null,
  address_detailed: null,
  // address: null,
  slug: null,
});

const branch = reactive({
  name: null,
  contact: null,
  lat: null,
  lang: null,
  address_detailed: null,
  address: null,
  code: null,
});

const onSubmit = () => {
  // console.log("submit!");
  if (formData.firstname === "" || formData.firstname === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your owner's Firstname",
    });
  } else if (formData.lastname === "" || formData.lastname === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your owner's Lastname",
    });
  } else if (formData.dob === "" || formData.dob === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your owner's Birthday",
    });
  } else if (formData.gender === "" || formData.gender === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your owner's Gender",
    });
  } else if (formData.phone === "" || formData.phone === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your owner's Phone Number",
    });
  } else if (formData.email === "" || formData.email === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your owner's Email",
    });
  } else if (formData.password === "" || formData.password === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your owner's password",
    });
  } else if (
    formData.password_confirmation === "" ||
    formData.password_confirmation === null
  ) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your owner's Password Confirmation",
    });
  } else if (formData.dob === "" || formData.dob === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your owner's Birthday",
    });
  } else if (company.name === "" || company.name === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your company's name",
    });
  } else if (company.contact === "" || company.contact === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your company's contact",
    });
  } else if (
    company.address_detailed === "" ||
    company.address_detailed === null
  ) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your company's address",
    });
  } else if (company.slug === "" || company.slug === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your company's name",
    });
  } else if (branch.name === "" || branch.name === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your branch's name",
    });
  } else if (branch.contact === "" || branch.contact === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your branch's contact",
    });
  } else if (
    branch.address_detailed === "" ||
    branch.address_detailed === null
  ) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your company's address",
    });
  } else if (branch.code === "" || branch.code === null) {
    $q.notify({
      position: "top",
      timeout: 3000,
      type: "negative",
      message: "Please enter your company's name",
    });
  } else {
    $q.loading.show();
    const newToken = LocalStorage.getItem("jwt");
    api
      .post(
        "/api/company",
        {
          firstname: formData.firstname,
          middlename: formData.middlename,
          lastname: formData.lastname,
          dob: formData.dob,
          gender: formData.gender,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,

          company_name: company.name,
          company_contact: company.contact,
          company_address: company.address_detailed,
          company_slug: company.slug.replace(/\s+/g, "-").toLowerCase(),

          branch_name: branch.name,
          branch_contact: branch.contact,
          branch_address: branch.address_detailed,
          branch_code: branch.code,
        },
        {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        }
      )
      .then((respose) => {
        console.log(respose);
        if (respose.data.status === 200) {
          setTimeout(() => {
            $q.notify({
              type: "positive",
              position: "top",
              timeout: 3000,
              message: respose.data.message,
            });
            $q.loading.hide();
            router.go(-1);
          }, 1000);
        } else {
          setTimeout(() => {
            $q.notify({
              type: "negative",
              position: "top",
              timeout: 3000,
              message: respose.data.message,
            });
            $q.loading.hide();
          }, 3000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const step = ref(1);
</script>
