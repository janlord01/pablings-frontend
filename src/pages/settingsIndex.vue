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
        <q-toolbar-title class="text-h6">Company Profile</q-toolbar-title>
      </q-toolbar>

      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <!-- <q-btn> -->
        <!-- <q-avatar size="300px"> -->
        <div v-if="skeleton">
          <div class="row full-width q-col-gutter-none relative-position">
            <div
              :class="
                $q.screen.gt.sm
                  ? 'col-9 text-center '
                  : 'full-width text-center '
              "
              class=""
            >
              <div style="margin: auto; width: 300px">
                <q-skeleton
                  type="circle"
                  :size="$q.screen.gt.sm ? '300px' : '200px'"
                />
              </div>
            </div>
          </div>
          <div class="row q-mt-md q-col-gutter-none relative-position">
            <div
              :class="$q.screen.gt.sm ? 'col-3 q-mr-md' : 'full-width q-mb-md'"
            >
              <q-skeleton type="QInput" />
            </div>
            <div
              :class="$q.screen.gt.sm ? 'col-3 q-mr-md' : 'full-width q-mb-md'"
            >
              <q-skeleton type="QInput" />
            </div>
            <div
              :class="$q.screen.gt.sm ? 'col-3 q-mr-sm ' : 'full-width q-mb-md'"
            >
              <q-skeleton type="QInput" />
            </div>
            <div
              :class="
                $q.screen.gt.sm
                  ? 'col-9 q-mr-sm q-mt-md q-mb-md'
                  : 'full-width q-mb-md'
              "
            >
              <q-skeleton type="QInput" />
            </div>
          </div>
          <div class="row align-center">
            <q-skeleton type="QBtn" />
          </div>
        </div>
        <div v-else>
          <div class="row q-col-gutter-none relative-position">
            <div
              :class="
                $q.screen.gt.sm
                  ? 'col-9 text-center '
                  : 'full-width text-center '
              "
              class=""
            >
              <img
                :style="$q.screen.gt.sm ? 'width: 300px' : 'width: 200px'"
                :src="formData.logo"
                v-if="formData.logo != null"
              />
              <img
                v-else
                :style="$q.screen.gt.sm ? 'width: 300px' : 'width: 200px'"
                src="/images/gnb-logo.jpeg"
              />
            </div>
            <div
              :class="
                $q.screen.gt.sm
                  ? 'col-9 text-center q-mb-lg'
                  : 'full-width text-center q-mb-lg'
              "
              class=""
            >
              <q-btn
                flat
                label="Change Logo"
                color="secondary"
                size="md"
                type="button"
                @click="viewUpdateLogo"
              />
            </div>
            <!-- <div class="col-3 q-mr-sm">
            <q-uploader
              filled
              label="Change Logo"
              name="code"
              class="q-mr-sm col-3 q-mt-md"
              type="file"
              v-model="logo"
            >
            </q-uploader>
          </div> -->
          </div>

          <!-- </q-avatar> -->
          <!-- </q-btn> -->
          <div class="row q-col-gutter-none relative-position">
            <div
              :class="$q.screen.gt.sm ? 'col-3 q-mr-md' : 'full-width q-mb-md'"
            >
              <q-input
                filled
                label="Company Name*"
                name="code"
                class="full-width"
                type="text"
                v-model="formData.name"
              >
                <template v-slot:prepend>
                  <q-icon name="account_circle" />
                </template>
              </q-input>
            </div>
            <div
              :class="$q.screen.gt.sm ? 'col-3 q-mr-md' : 'full-width q-mb-md'"
            >
              <q-input
                filled
                label="Company Contact*"
                name="code"
                class="full-width"
                type="text"
                v-model="formData.number"
              >
                <template v-slot:prepend>
                  <q-icon name="numbers" />
                </template>
              </q-input>
            </div>
            <div
              :class="$q.screen.gt.sm ? 'col-3 q-mr-sm ' : 'full-width q-mb-md'"
            >
              <q-input
                filled
                label="Slug"
                class="full-width"
                v-if="
                  userStore.userDetails.roles.find(
                    (role) => role === 'super-admin'
                  )
                "
                type="text"
                v-model="formData.slug"
              >
                <template v-slot:prepend>
                  <q-icon name="link" />
                </template>
              </q-input>
              <q-input
                filled
                label="Slug"
                class="full-width"
                v-else
                readonly
                type="text"
                v-model="formData.slug"
              >
                <template v-slot:prepend>
                  <q-icon name="link" />
                </template>
              </q-input>
            </div>
            <div
              :class="
                $q.screen.gt.sm
                  ? 'col-9 q-mr-sm q-mt-md q-mb-md'
                  : 'full-width q-mb-md'
              "
            >
              <q-input
                filled
                label="Address"
                class="full-width"
                type="text"
                v-model="formData.address"
              >
                <template v-slot:prepend>
                  <q-icon name="link" />
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
            <!-- <q-btn
            unelevated
            label="Update Logo"
            class="text-center q-ml-sm"
            color="secondary"
            size="md"
            type="button"
            @click="viewUpdateLogo"
          /> -->
          </div>
        </div>
      </q-form>
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
const skeleton = ref(true);
const newToken = ref(LocalStorage.getItem("jwt"));
const onSubmit = () => {
  // userStore.onSearchStaff(searchUser.value);
};

const viewUpdateLogo = () => {
  updateImageDialog.value = true;
};
const onLoadAllData = async () => {
  skeleton.value = true;

  await api
    .get("/api/settings/company/" + route.params.slug, {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      // console.log(response);
      if (response.status === 200) {
        setTimeout(() => {
          formData.name = response.data.data.name;
          formData.logo = response.data.data.logo;
          formData.number = response.data.data.contact;
          formData.address = response.data.data.address_detailed;
          formData.slug = response.data.data.slug;
          skeleton.value = false;
        }, 500);
      }
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
  onLoadAllData();
  mainStore.loc = "Settings";
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
