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
                v-model="formData.name"
                class="q-mb-md"
                label="Name*"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-person-outline" />
                </template>
              </q-input>
              <q-input
                outlined
                v-model="formData.email"
                label="Email"
                type="email"
                class="q-mb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-email-outline" />
                </template>
              </q-input>
              <q-input
                outlined
                v-model="formData.cp_number"
                label="Phone #(starts at 09)"
                type="number"
                class="q-mb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="eva-phone-outline" />
                </template>
              </q-input>

              <q-input
                outlined
                label="Password*"
                class="q-mb-md"
                v-model="formData.password"
                :type="isPwd ? 'password' : 'text'"
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
              <q-input
                outlined
                label="Password Confirmation*"
                class="q-mb-md"
                v-model="formData.password_confirmation"
                :type="isPwdCon ? 'password' : 'text'"
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
              <q-btn
                unelevated
                size="md"
                class="full-width text-white q-mt-sm"
                label="Register"
                color="blue"
                type="submit"
              />
            </q-form>
          </q-card-section>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">
              Already have an account?
              <q-btn
                flat
                to="/login"
                class="text-center text-primary"
                style="text-decoration: none"
                no-caps
                dense
                >Login
              </q-btn>
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
const isPwdCon = ref(true);
const formData = reactive({
  name: "",
  email: "",
  cp_number: "",
  password: "",
  password_confirmation: "",
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
