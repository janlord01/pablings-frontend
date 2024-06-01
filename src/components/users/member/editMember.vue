<template>
  <q-card style="max-width: 800px; width: 800px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Update Member </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mb-md">
            <q-input
              filled
              label="First Name*"
              name="code"
              type="text"
              v-model="formData.firstname"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>
          </div>
          <div class="full-width q-mb-md">
            <q-input
              filled
              label="Middle Name"
              name="code"
              type="text"
              v-model="formData.middlename"
            >
            </q-input>
          </div>
          <div class="full-width q-mb-md">
            <q-input
              filled
              label="Last Name*"
              type="text"
              v-model="formData.lastname"
            >
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mb-md">
            <q-input filled v-model="formData.dob" mask="date" label="Birthday">
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
          <div class="full-width q-mb-md">
            <q-select
              filled
              :options="['Male', 'Female']"
              label="Gender*"
              v-model="formData.gender"
            >
              <template v-slot:prepend>
                <q-icon name="wc" />
              </template>
            </q-select>
          </div>
          <div class="full-width q-mb-md">
            <q-input
              filled
              label="Phone #"
              name="phone"
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
          <div class="full-width q-mb-md">
            <q-input
              filled
              label="Address"
              name="addresss"
              type="text"
              v-model="formData.address"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mb-md">
            <q-input
              filled
              label="Email Address "
              name="email"
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
            class="text-center full-width"
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
import { useRoute, useRouter } from "vue-router";

const emit = defineEmits(["hideEditDialog"]);
const props = defineProps(["memberId"]);

const route = useRoute();
const codesStore = useCodeData();
const userStore = useUserData();
const newToken = ref(LocalStorage.getItem("jwt"));

const codes = reactive([]);
const $q = useQuasar();
const getMemberData = () => {
  api
    .get("/api/members/" + props.memberId + "/edit", {
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
      // formData.profession = response.data.data.profession;
      formData.email = response.data.data.email;
      // formData.code = response.data.data.code;
      // formData.from = response.data.data.know_beefit;
    })
    .catch((error) => {
      console.log(error);
    });
};
const getCodesFunc = () => {
  Object.entries(codesStore.rowDatas).map(([key, val]) => {
    codes.push({
      label: val.code,
      value: val.id,
    });
  });
};

const onSubmit = () => {
  var newToken = LocalStorage.getItem("jwt");
  $q.loading.show();
  api
    .patch(
      "/api/members/" + props.memberId,
      {
        firstname: formData.firstname,
        middlename: formData.middlename,
        lastname: formData.lastname,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        contact: formData.phone,
        email: formData.email,
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
          userStore.getAllMembers(route.params.slug);
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
  getMemberData();
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
