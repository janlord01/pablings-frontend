<template>
  <div class="q-pa-md">
    <q-table
      flat
      :pagination="pagination"
      class="q-pa-sm"
      :rows="staffStore.rowStaffDatas"
      :columns="columns"
      row-key="id"
      separator="cell"
      :visible-columns="
        $q.screen.gt.xs
          ? ['id', 'name', 'email', 'number', 'role', 'action']
          : ['id', 'name', 'action']
      "
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>

          <q-td key="name" :props="props">
            <q-btn round>
              <q-avatar size="42px">
                <img
                  :src="props.row.image_path"
                  v-if="props.row.image_path != null"
                />
                <q-btn
                  v-else-if="props.row.gender == 'Male'"
                  icon="face"
                ></q-btn>
                <q-btn v-else icon="face_3"></q-btn>
              </q-avatar>
            </q-btn>
            {{ props.row.name }}
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
          </q-td>
          <q-td key="number" :props="props">
            {{ props.row.cp_number }}
          </q-td>

          <q-td key="role" :props="props">
            <!-- {{ props.row.roles.name }} -->
            <q-chip dense size="md" color="primary" text-color="white">
              {{ props.row.roles[0].name }}
            </q-chip>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              color="blue"
              icon="edit"
              size="sm"
              @click="EditMemberDialog(props.row.id)"
            />
            <q-btn
              color="orange"
              icon="camera_alt"
              size="sm"
              :to="'/user/members/' + props.row.id + '/update-photo'"
            />
            <q-btn
              color="grey"
              icon="password"
              size="sm"
              @click="passwordDialog(props.row.id)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <!-- Edit Member -->
  <q-dialog v-model="showEditDialog">
    <EditStaff
      :staff-id="staff_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Capture Image -->
  <q-dialog v-model="showPasswordDialog" class="z-top">
    <changePassword
      :member-id="staff_id"
      @hide-password-dialog="showPasswordDialog = !showPasswordDialog"
    />
  </q-dialog>

  <!-- Edit Member -->
</template>

<script setup>
import { api } from "src/boot/axios";
import { useUserData } from "src/stores/users/store";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import EditStaff from "components/users/staff/editStaff.vue";
import changePassword from "components/users/ChangePassword.vue";
// import snapPicture from "./snapPicture.vue";

const $q = useQuasar();

const staffStore = useUserData();
const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const staff_id = ref(null);
const EditMemberDialog = (id) => {
  staff_id.value = "";
  showEditDialog.value = true;
  staff_id.value = id;
};

const passwordDialog = (id) => {
  staff_id.value = "";
  showPasswordDialog.value = true;
  staff_id.value = id;
};
const capturedImg = (id) => {
  staff_id.value = "";
  showCaptureImg.value = true;
  staff_id.value = id;
};

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
    name: "email",
    label: "Email",
    field: "email",
    align: "left",
    sortable: true,
  },
  {
    name: "number",
    label: "Number",
    field: "number",
    align: "left",
    sortable: true,
  },
  {
    name: "role",
    label: "Role(s)",
    field: "role",
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
const copyText = (code) => {
  navigator.clipboard.writeText(code);
  $q.notify({
    type: "positive",
    color: "positive",
    timeout: 1000,
    position: "top",
    message: "Copy Code: " + code,
  });
};
onMounted(() => {
  staffStore.getAllStaff();
});
</script>

<style></style>
