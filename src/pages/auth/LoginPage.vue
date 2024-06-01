<template>
  <q-page class="row justify-center items-center">
    <div class="column">
      <div class="row q-mb-lg text-center">
        <!-- <img
          src="/images/ink&shears-icon.png"
          width="200"
          style="display: block; margin: auto"
        /><br /> -->
        <img
          src="/images/pablings.png"
          width="200"
          style="display: block; margin: auto"
        /><br />
      </div>
      <div class="row">
        <q-card class="q-pa-lg no-shadow">
          <q-card-section class="relative">
            <q-form class="relative" @submit="loginSubmit">
              <q-input
                outlined
                v-model="formData.email"
                label="Email or Phone Number"
                lazy-rules
                :rules="[(val) => !!val || ' is required']"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-lock-outline" />
                </template>
              </q-input>

              <q-input
                outlined
                label="Password"
                name="code"
                lazy-rules
                v-model="formData.password"
                :type="isPwd ? 'password' : 'text'"
                :rules="[(val) => !!val || 'Password is required']"
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
              <q-btn
                flat
                to="/register"
                class="text-center text-primary"
                style="text-decoration: none"
                no-caps
                dense
                >Create Account</q-btn
              >
            </p>

            <p class="text-grey-6" style="font-size: 12px">
              All Right Reserved. Created exclusively for Pablings Barbershop.
              <!-- Gnb Inventory System. All Right Reserved. Created By: Janlord Luga -->
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useUserData } from "stores/users/store";

const userStore = useUserData();
const isPwd = ref(true);
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
