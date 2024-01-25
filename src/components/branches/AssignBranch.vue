<template>
  <q-card style="max-width: 500px; width: 500px; min-height: 400px">
    <!-- <q-linear-progress :value="onProgressBar" color="green" size="md" /> -->
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title> Assign Staff </q-toolbar-title>
      <q-btn flat icon="close" round v-close-popup></q-btn>
    </q-toolbar>
    <q-card-section>
      <q-table
        :pagination="pagination"
        class="q-pa-sm"
        :rows="assignStore.rowDatas"
        :columns="columns"
        row-key="id"
        separator="cell"
        :visible-columns="
          $q.screen.gt.xs ? ['name', 'action'] : ['name', 'action']
        "
      >
        <template #body="props">
          <q-tr :props="props">
            <!-- <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td> -->

            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="action" :props="props">
              <q-btn
                color="red"
                icon="delete"
                size="sm"
                @click="removeAssign(props.row.id)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-form
        class="column q-pa-md shawdow full-width block"
        ref="formName"
        @submit="onSubmit"
      >
        <div class="row q-col-gutter-none relative-position">
          <div class="col-12 q-mr-sm">
            <q-input
              filled
              v-model="searchMember"
              label="Search Staff"
              class="col-3 full-width"
              type="text"
              @click="searchVisible = true"
              @keyup="searchMemberFunc"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-list
              bordered
              separator
              class="full-width text-white z-max bg-grey-10"
              v-if="searchVisible && memberToggle"
            >
              <p
                clickable
                v-ripple
                v-for="item in filterMember"
                v-bind:key="item.id"
              >
                <q-item
                  clickable
                  v-ripple
                  v-for="member in item"
                  :key="member.id"
                  @click="selectStudent(member)"
                >
                  <q-item-section>
                    <q-item-label class="text-white">{{
                      member.name + " (" + member.roles[0].name + ")"
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </p>
            </q-list>
          </div>
        </div>

        <div class="row align-center q-mt-md">
          <q-btn
            unelevated
            label="Assign"
            class="text-center"
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
import { ref, reactive, onMounted, watch } from "vue";
import { useAssignData } from "stores/branch/assignStore";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";
import { useRoute } from "vue-router";

const route = useRoute();
const assignStore = useAssignData();

const emit = defineEmits(["hideAssignDialog"]);
const props = defineProps(["branchId"]);

const newToken = ref(LocalStorage.getItem("jwt"));
const allMembers = reactive([]);
const filterMember = reactive({});

const searchMember = ref(null);
const seletedMember = ref(null);
const searchVisible = ref(false);
const showCheckInDialog = ref(false);

const $q = useQuasar();

const pagination = reactive({
  sortBy: "id",
  rowsPerPage: 10,
});
const columns = reactive([
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-4",
  },
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
]);

const removeAssign = async (id) => {
  $q.loading.show();
  await api
    .delete(
      "/api/branch/members/delete",
      {
        params: {
          branch: id,
          // branch: props.branchId,
        },
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
          $q.notify({
            type: "positive",
            color: "positive",
            timeout: 2000,
            position: "top",
            message: response.data.message,
          });
          // assignMember = [];
          getAssignedMembers();
          $q.loading.hide();
        }, 2000);
      } else {
        setTimeout(() => {
          $q.notify({
            type: "negative",
            color: "negative",
            timeout: 3000,
            position: "top",
            message: response.data.message,
          });
          $q.loading.hide();
        }, 2000);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const selectStudent = async (member) => {
  //   console.log(route.params.id);
  seletedMember.value = null;
  searchMember.value = member.name + " (" + member.roles[0].name + ")";
  seletedMember.value = member.id;
  formData.member_id = member.id;
  searchVisible.value = false;
};

let assignMember = reactive([]);

const getAssignedMembers = async () => {
  assignStore.getAllAssign(props.branchId);
  // await api
  //   .get("/api/branch/" + props.branchId + "/members/", {
  //     headers: {
  //       Authorization: "Bearer " + newToken.value,
  //     },
  //   })
  //   .then((response) => {
  //     // console.log(response);
  //     Object.entries(response.data.data).map(([key, item]) => {
  //       assignMember.push({
  //         id: item.id,
  //         name: item.name,
  //       });
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};
const getMembers = async () => {
  await api
    .get("/api/staff/", {
      headers: {
        Authorization: "Bearer " + newToken.value,
      },
    })
    .then((response) => {
      // console.log(response);
      allMembers.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const searchMemberFunc = () => {
  // console.log("work!!");
  searchVisible.value = true;
  const query =
    searchMember.value != null ? searchMember.value.toLowerCase() : "";
  if (searchMember.value == "" || searchMember.value == null) {
    filterMember.value = allMembers.value;
  } else {
    filterMember.value = allMembers.value.filter((student) => {
      return Object.values(student).some((word) =>
        String(word).toLowerCase().includes(query)
      );
    });
    // console.log(filterMember.value);
  }
};

const onSubmit = () => {
  //   console.log(route.params.id);
  if (formData.member_id == null || formData.member_id == "") {
    $q.notify({
      type: "negative",
      color: "negative",
      timeout: 3000,
      position: "top",
      message: "Please Search of Staff!",
    });
  } else {
    $q.loading.show();
    const newToken = LocalStorage.getItem("jwt");
    api
      .post(
        "/api/branch/assign",
        {
          branch: props.branchId,
          user: formData.member_id,
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
            $q.notify({
              type: "positive",
              color: "positive",
              timeout: 2000,
              position: "top",
              message: response.data.message,
            });
            // state.data = "";
            // emit("hideAssignDialog");
            // assignMember = [];
            searchMember.value = "";
            getAssignedMembers();
            $q.loading.hide();
          }, 2000);
        } else {
          setTimeout(() => {
            $q.notify({
              type: "negative",
              color: "negative",
              timeout: 3000,
              position: "top",
              message: response.data.message,
            });
            $q.loading.hide();
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

onMounted(() => {
  getMembers();
  getAssignedMembers();
  //   monitorStore.getData(0);
});

const memberToggle = ref(true);
const guestName = ref(null);
const formData = reactive({
  name: null,
  dob: null,
  gender: null,
  phone: null,
  address: null,
  profession: null,
  email: null,
  startDate: null,
  endDate: null,
  code: null,
});

const getActiveCodes = () => {};
</script>
<style scoped>
.unit {
  margin-bottom: -10px;
}
</style>
