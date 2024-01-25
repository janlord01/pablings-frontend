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
      <q-toolbar class="">
        <q-toolbar-title
          :class="
            $q.screen.gt.xs ? 'text-h6 q-mb-lg q-mt-lg' : 'text-h6 invisible'
          "
          class="text-center"
          >Account Settings</q-toolbar-title
        >
      </q-toolbar>

      <q-list
        bordered
        padding
        class="rounded-borders"
        style="max-width: 500px; margin: auto"
      >
        <q-item-label header>Account</q-item-label>

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="account_circle" color="grey-5" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">Profile</q-item-label>
            <!-- <q-item-label caption>February 22nd, 2019</q-item-label> -->
          </q-item-section>

          <q-item-section side>
            <q-icon name="arrow_forward_ios" color="grey" />
          </q-item-section>
        </q-item>
        <q-separator spaced />

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="camera_alt" color="grey-5" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">Change Profile Image</q-item-label>
            <!-- <q-item-label caption>February 22nd, 2019</q-item-label> -->
          </q-item-section>

          <q-item-section side>
            <q-icon name="arrow_forward_ios" color="grey" />
          </q-item-section>
        </q-item>
        <q-separator spaced />

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="password" color="grey-5" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1">Change Password</q-item-label>
            <!-- <q-item-label caption>February 22nd, 2019</q-item-label> -->
          </q-item-section>

          <q-item-section side>
            <q-icon name="arrow_forward_ios" color="grey" />
          </q-item-section>
        </q-item>
        <q-separator spaced />

        <q-item-label header>Help</q-item-label>

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="assignment" color="grey-5" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">About</q-item-label>
            <!-- <q-item-label caption>March 2nd, 2019</q-item-label> -->
          </q-item-section>

          <q-item-section side>
            <q-icon name="info" />
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="help" color="grey-5" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">Help Center</q-item-label>
            <!-- <q-item-label caption>March 2nd, 2019</q-item-label> -->
          </q-item-section>

          <q-item-section side>
            <q-icon name="info" />
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="star" color="grey-5" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">Happy with us? Rate Us!</q-item-label>
            <!-- <q-item-label caption>March 2nd, 2019</q-item-label> -->
          </q-item-section>

          <q-item-section side>
            <q-icon name="info" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <q-dialog v-model="updateImageDialog">
      <settingImageUpdate
        @hide-update-dialog="updateImageDialog = !updateImageDialog"
        @on-load-data="onLoadAllData"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useCodeData } from "stores/membership/storeCodes";
import { useUserData } from "stores/users/store";
import { LocalStorage, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import settingImageUpdate from "src/components/settingImageUpdate.vue";
import { useMainStoreData } from "stores/store";
import { useRoute } from "vue-router";

const route = useRoute();
const mainStore = useMainStoreData();
const codesStore = useCodeData();
const userStore = useUserData();

const searchUser = ref(null);
const updateImageDialog = ref(false);
const name = ref(null);
const logo = ref(null);
const newToken = ref(LocalStorage.getItem("jwt"));
const onSubmit = () => {
  // userStore.onSearchStaff(searchUser.value);
};

const viewUpdateLogo = () => {
  updateImageDialog.value = true;
};
const onLoadAllData = async () => {
  await api
    .get("/api/settings/company/" + route.params.slug, {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      // console.log(response);
      formData.name = response.data.data.name;
      formData.logo = response.data.data.logo;
      formData.number = response.data.data.contact;
      formData.address = response.data.data.address_detailed;
      formData.slug = response.data.data.slug;
    })
    .catch((error) => {
      console.log(error);
    });
};

const showCreateDialog = ref(false);
const showImportDialog = ref(false);

const createDialog = () => {
  showCreateDialog.value = true;
};
const ImportDialog = () => {
  showImportDialog.value = true;
};
const formData = reactive({
  name: null,
  address: null,
  number: null,
  slug: null,
});
onMounted(() => {
  // codesStore.getAllCodes();
  // onLoadAllData();
  mainStore.loc = "Account Settings";
  // getCodesFunc();
  // console.log(codes);
});
</script>
<style>
.search_input {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
