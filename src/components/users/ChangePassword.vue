<template>
  <q-card style="max-width: 400px; width: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10' : 'bg-blue text-white'
      "
    >
      <q-toolbar-title> Change Password </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="full-width q-mr-sm">
            <q-input
              filled
              label="New Password"
              name="code"
              class="q-mr-sm full-width"
              v-model="formData.password"
              :type="isPwd ? 'password' : 'text'"
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
          <div class="full-width q-mr-sm">
            <q-input
              filled
              label="Confirm New Password"
              name="code"
              class="q-mr-sm q-mb-md full-width"
              :type="isPwdCon ? 'password' : 'text'"
              v-model="formData.confirmed_password"
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
            label="Update"
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
const emit = defineEmits(["hidePasswordDialog"]);
const props = defineProps(["memberId"]);

const codesStore = useCodeData();
const userStore = useUserData();
const newToken = ref(LocalStorage.getItem("jwt"));
const isPwd = ref(true);
const isPwdCon = ref(true);

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
      //   console.log(response);
      formData.firstname = response.data.data.firstname;
      formData.middlename = response.data.data.middlename;
      formData.lastname = response.data.data.lastname;
      formData.dob = response.data.data.birthday;
      formData.gender = response.data.data.gender;
      formData.phone = response.data.data.cp_number;
      formData.address = response.data.data.address;
      formData.profession = response.data.data.profession;
      formData.email = response.data.data.email;
      formData.code = response.data.data.code;
      formData.from = response.data.data.know_beefit;
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
      "/api/member/change-password/" + props.memberId,
      {
        password: formData.password,
        password_confirmation: formData.confirmed_password,
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
          $q.loading.hide();
          $q.notify({
            type: "positive",
            icon: "save",
            timeout: 1000,
            position: "bottom",
            message: response.data.message,
          });
          userStore.getAllMembers();
          emit("hidePasswordDialog");
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
  // getCodesFunc();
  // getMemberData();
  // console.log(codes);
});

const formData = reactive({
  password: null,
  confirmed_password: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
