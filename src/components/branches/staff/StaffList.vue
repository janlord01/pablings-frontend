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
            <q-chip dense size="md" color="blue" text-color="white">
              {{ props.row.role }}
            </q-chip>
          </q-td>
          <q-td key="action" :props="props">
            <q-btn
              color="blue"
              icon="edit"
              label="edit"
              size="sm"
              @click="EditMemberDialog(props.row.user_id)"
            />
            <q-btn
              color="orange"
              icon="camera_alt"
              label="Change Image"
              size="sm"
              @click="changeImageDialog(props.row.user_id)"
            />
            <q-btn
              color="grey"
              icon="password"
              label="Change Password"
              size="sm"
              @click="passwordDialog(props.row.user_id)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <!-- Edit Member -->
  <q-dialog v-model="showEditDialog" persistent>
    <EditStaff
      :staff-id="staff_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Capture Image -->
  <q-dialog v-model="showPasswordDialog" class="z-top" persistent>
    <changePassword
      :member-id="staff_id"
      @hide-password-dialog="showPasswordDialog = !showPasswordDialog"
    />
  </q-dialog>

  <q-dialog v-model="showCaptureImg" persistent>
    <changeImage
      :user-id="staff_id"
      @hide-image-dialog="showCaptureImg = !showCaptureImg"
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
import EditStaff from "components/branches/staff/EditStaff.vue";
import changePassword from "components/users/ChangePassword.vue";
import { useRoute } from "vue-router";

import changeImage from "components/users/changeImage.vue";
// import snapPicture from "./snapPicture.vue";
const route = useRoute();
const $q = useQuasar();

const staffStore = useUserData();
const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const staff_id = ref(null);

const changeImageDialog = (id) => {
  staff_id.value = "";
  showCaptureImg.value = true;
  staff_id.value = id;
};

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
  staffStore.getAllStaff([route.params.slug, route.params.id]);
});
</script>

<style></style>
