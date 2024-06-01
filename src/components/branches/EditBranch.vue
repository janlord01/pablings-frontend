<template>
  <q-card style="max-width: 800px; width: 800px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10' : 'bg-blue text-white'
      "
    >
      <q-toolbar-title> Update Branch </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'col-md-5 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Branch Name"
              name="code"
              class="q-mr-sm col-3 full-width"
              type="text"
              v-model="formData.name"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>
          </div>
          <div :class="$q.screen.gt.xs ? 'col-md-3 q-mr-sm' : 'full-width'">
            <q-input
              filled
              label="Contact No."
              name="code"
              class="q-mr-sm col-3 full-width"
              type="text"
              v-model="formData.cp"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" />
              </template>
            </q-input>
          </div>
          <div :class="$q.screen.gt.xs ? 'col-md-3' : 'full-width q-mt-md'">
            <q-input
              filled
              label="Branch Code"
              name="code"
              class="q-mr-sm col-3 full-width"
              type="text"
              v-model="formData.code"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'full-width q-pr-xl' : 'full-width'">
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
        </div>
        <div class="row q-col-gutter-none q-mb-md relative-position">
          <div :class="$q.screen.gt.xs ? 'col-3' : 'full-width'">
            <q-input
              filled
              label="Commission"
              class="full-width"
              type="number"
              v-model="formData.commission"
            >
              <template v-slot:prepend>
                <q-icon name="percent" />
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
import { useBranchData } from "stores/branch/store";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useUserData } from "src/stores/users/store";
import { useRoute } from "vue-router";
const props = defineProps(["branchId"]);
const emit = defineEmits(["hideEditDialog"]);
const route = useRoute();
const branchStore = useBranchData();
const userStore = useUserData();

const codes = reactive([]);
const $q = useQuasar();
const isPwd = ref(true);
const isPwdCon = ref(true);
const newToken = ref(LocalStorage.getItem("jwt"));

const editBranch = () => {
  api
    .get(`/api/${route.params.slug}/branch/${props.branchId}/edit`, {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      console.log(response);
      formData.name = response.data.data.name;
      formData.cp = response.data.data.contact_number;
      formData.address = response.data.data.location;
      formData.code = response.data.data.branch_code;
      formData.commission = response.data.data.commission;
    })
    .catch((error) => {
      console.log(error);
    });
};

const onSubmit = () => {
  $q.loading.show();
  api
    .patch(
      `/api/${route.params.slug}/branch/${props.branchId}`,
      {
        name: formData.name,
        code: formData.code,
        cp: formData.cp,
        address: formData.address,
        commission: formData.commission,
      },
      {
        headers: {
          Authorization: "Bearer " + newToken.value,
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
          branchStore.getAllBranches(route.params.slug);
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
  //   getCodesFunc();
  // console.log(codes);
  editBranch();
});

const formData = reactive({
  name: null,
  code: null,
  cp: null,
  address: null,
  commission: "",
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
