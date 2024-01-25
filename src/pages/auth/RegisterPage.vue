<template>
  <q-page class="row justify-center items-center q-mt-lg">
    <div class="">
      <div class="">
        <h5 class="text-h5 text-black q-my-md text-bold text-center">
          Register
        </h5>
      </div>
      <div class="q-mb-lg">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="" method="post" @submit.prevent="handleSubmit">
              <div class="row q-col-gutter-none">
                <div class="col-6">
                  <q-input
                    square
                    filled
                    v-model="formData.firstname"
                    type="text"
                    label="Firstname"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) ||
                        'Please Enter your firstname',
                    ]"
                    class="q-mr-sm"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    square
                    filled
                    v-model="formData.lastname"
                    type="text"
                    label="Lastname"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please Enter your lastname',
                    ]"
                  />
                </div>
              </div>
              <q-input
                square
                filled
                v-model="formData.email"
                type="email"
                label="Email"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please Enter your email',
                ]"
                class="q-mt-sm"
              />
              <q-input
                square
                filled
                v-model="formData.password"
                type="password"
                label="Password"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please Enter your password',
                ]"
                class="q-mt-sm"
              />
              <q-input
                square
                filled
                v-model="formData.password_confirmation"
                type="password"
                label="Confirm Password"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Please confirm your firstname',
                ]"
                class="q-mt-sm"
              />
              <q-btn
                unelevated
                size="lg"
                color="primary"
                class="full-width text-white q-mt-sm"
                label="Register"
                type="submit"
              />
            </q-form>
          </q-card-section>

          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">
              Already have an account? <a href="/login">Login</a>
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// import axios from "src/boot/axios";
import { ref, reactive } from "vue";
import { useUserData } from "stores/users/store";

const userStore = useUserData();

const formData = reactive({
  firstname: "Janlord",
  lastname: "Luga",
  email: "janlord.luga@gmail.com",
  password: "admin123",
  password_confirmation: "admin123",
});

const handleSubmit = () => {
  userStore.registerUser(formData);
};
</script>

<style>
.q-card {
  width: 600px;
}
</style>
