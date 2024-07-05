<template>
  <q-page class="row justify-center items-center" style="border: solid 1px">
    <div class="column full-width">
      <div class="row q-mb-lg text-center q-mt-lg">
        <img
          src="/images/pablings.png"
          width="200"
          :style="
            $q.screen.gt
              ? 'display: block; margin: 10px auto'
              : 'display: block; margin: 30px auto'
          "
        /><br />
      </div>
      <div class="full-width">
        <q-card class="q-pa-lg no-shadow full-width">
          <q-card-section class="relative full-width">
            <q-form class="relative full-width" @submit="onSubmit">
              <div class="row">
                <q-input
                  outlined
                  v-model="formData.name"
                  :class="
                    $q.screen.gt.sm
                      ? 'q-mb-md q-mr-md col'
                      : 'full-width q-mb-sm'
                  "
                  label=""
                  readonly
                  filled
                >
                  <template v-slot:prepend>
                    <q-icon name="store" />
                  </template>
                </q-input>
                <q-select
                  filled
                  v-model="branch"
                  use-input
                  input-debounce="0"
                  label="Select Branch"
                  :options="options"
                  @filter="filterFn"
                  :class="
                    $q.screen.gt.sm
                      ? 'q-mb-md q-mr-md col'
                      : 'full-width q-mb-sm'
                  "
                  @update:model-value="selectBranchFunc"
                >
                  <template v-slot:prepend>
                    <q-icon name="storefront" />
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-select
                  filled
                  v-model="service"
                  label="Select Services"
                  :options="serviceOption"
                  :class="
                    $q.screen.gt.sm ? 'q-mb-md col' : 'full-width q-mb-sm'
                  "
                  @update:model-value="selectedService"
                >
                  <template v-slot:prepend>
                    <q-icon name="construction" />
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="row">
                <q-select
                  filled
                  v-model="worker"
                  label="Your Barber(optional)"
                  :options="workerOption"
                  :class="
                    $q.screen.gt.sm
                      ? 'q-mb-md q-mr-md col'
                      : 'full-width q-mb-sm'
                  "
                >
                  <template v-slot:prepend>
                    <q-icon name="construction" />
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-input
                  outlined
                  v-model="formData.price"
                  label="Price"
                  :class="
                    $q.screen.gt.sm
                      ? 'q-mb-md q-mr-md col'
                      : 'full-width q-mb-sm'
                  "
                  readonly
                  filled
                >
                  <template v-slot:prepend>
                    <q-icon name="payment" />
                  </template>
                </q-input>

                <q-input
                  outlined
                  filled
                  label="Guest Name*"
                  :class="
                    $q.screen.gt.sm ? 'q-mb-md col' : 'full-width q-mb-sm'
                  "
                  v-model="formData.guest"
                  type="text"
                >
                  <template v-slot:prepend>
                    <q-icon name="man" />
                  </template>
                </q-input>
              </div>
              <div class="row">
                <q-input
                  filled
                  v-model="bookingDate"
                  :class="
                    $q.screen.gt.sm
                      ? 'q-mb-md q-mr-md col'
                      : 'full-width q-mb-sm'
                  "
                  label="Date of Booking"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="bookingDate" mask="YYYY-MM-DD">
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
                <q-input
                  filled
                  v-model="bookingTime"
                  mask="time"
                  label="Time of Booking"
                  :class="$q.screen.gt.sm ? 'col' : 'full-width q-mb-sm'"
                >
                  <template v-slot:prepend>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time v-model="bookingTime">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>

              <q-btn
                unelevated
                size="md"
                class="full-width text-white q-mt-md"
                label="Book"
                color="blue"
                type="submit"
              />
            </q-form>
          </q-card-section>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">
              Back to home
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
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { useUserData } from "stores/users/store";
import { useRoute } from "vue-router";
import { useBookingData } from "stores/branch/bookingStore";
import { LocalStorage, useQuasar } from "quasar";
import { api } from "src/boot/axios";
// const newToken = ref(LocalStorage.getI)
const bookingDate = ref("");
const bookingTime = ref("");

const $q = useQuasar();

const bookingStore = useBookingData();
const route = useRoute();
const userStore = useUserData();
const branch = ref("");
const service = ref("");
const worker = ref("");
const isPwd = ref(true);
const isPwdCon = ref(true);

const options = ref([]);
const serviceOption = ref([]);
const workerOption = ref([]);
const selectedOption = ref(null);
const selectedService = () => {
  // console.log(service.value)
  const data = serviceOption.value.find((item) => item.id === service.value.id);

  console.log(data.service_price);
  formData.price = data.service_price;
};

const selectBranchFunc = async () => {
  // console.log(branch.value);
  await api
    .get(`/api/branch/services/search/${branch.value.value}`)
    .then((response) => {
      console.log(response);
      if (response.status == 200) {
        serviceOption.value = response.data.data;
        workerOption.value = response.data.users;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const formData = reactive({
  price: "",
  guest: "",
});

const fetchData = async () => {
  try {
    await bookingStore.getBranch(route.params.slug);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

// Watch for changes in rowDatas and update options
watch(
  () => bookingStore.rowDatas,
  (newRowDatas) => {
    if (Array.isArray(newRowDatas)) {
      options.value = newRowDatas.map((data) => ({
        label: data.name, // Adjust according to your data structure
        value: data.id, // Adjust according to your data structure
      }));
    } else {
      options.value = [];
    }
  },
  { immediate: true }
);

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      options.value = bookingStore.rowDatas.map((data) => ({
        label: data.name,
        value: data.id,
      }));
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = bookingStore.rowDatas
      .filter((data) => data.name.toLowerCase().includes(needle))
      .map((data) => ({
        label: data.name,
        value: data.id,
      }));
  });
};

const onSubmit = () => {
  $q.loading.show();
  api
    .post("/api/booking", {
      slug: formData.name,
      branch: branch.value != "" ? branch.value.value : "",
      service: service.value != "" ? service.value.value : "",
      worker: worker.value != "" ? worker.value.value : "",
      price: formData.price,
      guest: formData.guest,
      bookingDate: bookingDate.value,
      bookingTime: bookingTime.value,
    })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        setTimeout(() => {
          $q.notify({
            position: "bottom",
            type: "positive",
            timeout: 3000,
            message: response.data.message,
          });
          service.value = [];
          worker.value = [];
          bookingDate.value = "";
          bookingTime.value = "";
          formData.price = "";
          formData.guest = "";
          $q.loading.hide();
        }, 1000);
      } else {
        setTimeout(() => {
          $q.notify({
            position: "bottom",
            type: "negative",
            timeout: 3000,
            message: response.data.message,
          });
          $q.loading.hide();
        }, 3000);
      }
    })
    .catch((error) => {
      console.log(error);
      setTimeout(() => {
        $q.notify({
          position: "bottom",
          type: "negative",
          timeout: 3000,
          message: "Something went wrong!",
        });
        $q.loading.hide();
      }, 3000);
    });
};

onMounted(() => {
  formData.name = route.params.slug;
  fetchData();
});
</script>

<style>
.q-card {
  width: 360px;
}
</style>
