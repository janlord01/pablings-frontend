<template>
  <q-page class="row justify-center items-center">
    <div class="column">
      <div class="row q-mb-lg text-center">
        <!-- <h5 class="text-h5 text-black q-my-md text-bold justify-center">
          Login
        </h5> -->
        <img
          src="/images/ink&shears-icon.png"
          width="200"
          style="display: block; margin: auto"
        /><br />
      </div>
      <div class="row q-mb-lg" style="text-align: center">
        <p class="text-h5 text-bold" style="display: block; margin: auto">
          Ink&Shears
        </p>
      </div>
      <!-- <q-spinner-gears
        class="absolute-center z-top"
        color="secondary"
        size="100px"
        v-if="loginLoading"
        :class="loginLoading ? 'z-top' : ''"
      /> -->
      <div class="row">
        <q-card class="q-pa-lg no-shadow">
          <q-card-section class="relative">
            <q-form class="relative" @submit="loginSubmit">
              <q-input
                outlined
                v-model="formData.email"
                type="email"
                label="Email"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please Enter your firstname',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-email-outline" />
                </template>
              </q-input>

              <q-input
                outlined
                v-model="formData.password"
                type="password"
                label="Password"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please Enter your firstname',
                ]"
                class="q-mt-sm"
              >
                <template v-slot:prepend>
                  <q-icon name="password" />
                </template>
              </q-input>
              <p class="text-right">
                <a href="#" class="text-center" style="text-decoration: none"
                  >Forgot Password</a
                >
              </p>
              <q-btn
                unelevated
                size="md"
                class="full-width text-white q-mt-sm"
                label="Login"
                color="blue"
                type="submit"
              />
            </q-form>
          </q-card-section>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">
              Not reigistered?
              <a href="#" class="text-center" style="text-decoration: none"
                >Create Account</a
              >
            </p>

            <p class="text-grey-6" style="font-size: 12px">
              All Right Reserved. Created By: Janlord Luga
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { reactive } from "vue";
import { useUserData } from "stores/users/store";

const userStore = useUserData();

const formData = reactive({
  email: "",
  password: "",
});
const loginSubmit = () => {
  userStore.loginUser(formData);
};
</script>
<style>
.q-card {
  width: 360px;
}
</style>
