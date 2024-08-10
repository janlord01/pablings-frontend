<template>
  <q-table
    flat
    :pagination="pagination"
    class="q-pa-sm"
    :class="$q.dark.isActive ? 'text-white bg-blue-grey-10' : 'text-dark'"
    :rows="userStore.rowDatas"
    :columns="columns"
    row-key="id"
    :loading="userStore.loading"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['name', 'email', 'number', 'action']
        : ['id', 'name', 'action']
    "
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>

        <q-td key="name" :props="props">
          <!-- <q-btn round>
            <q-avatar size="42px">
              <img
                :src="props.row.image_path"
                v-if="props.row.image_path != null"
              />
              <q-btn v-else-if="props.row.gender == 'Male'" icon="face"></q-btn>
              <q-btn v-else icon="face_3"></q-btn>
            </q-avatar>
          </q-btn> -->
          {{ props.row.name }}
        </q-td>
        <q-td key="email" :props="props">
          {{ props.row.email }}
        </q-td>
        <q-td key="number" :props="props">
          {{ props.row.cp_number }}
        </q-td>
        <q-td key="action" :props="props">
          <q-btn
            color="blue"
            icon="edit"
            size="sm"
            label="edit"
            @click="EditMemberDialog(props.row.id)"
          />
          <!-- <q-btn
            color="orange"
            icon="camera_alt"
            label="profile image"
            size="sm"
            @click="changeImageDialog(props.row.id)"
          />
          <q-btn
            color="grey"
            icon="password"
            label="change password"
            size="sm"
            @click="passwordDialog(props.row.id)"
          /> -->
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- Edit Member -->
  <q-dialog v-model="showEditDialog">
    <EditMember
      :member-id="member_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Capture Image -->
  <q-dialog v-model="showPasswordDialog" class="z-top">
    <changePassword
      :member-id="member_id"
      @hide-password-dialog="showPasswordDialog = !showPasswordDialog"
    />
  </q-dialog>

  <q-dialog v-model="showCaptureImg" persistent>
    <changeImage
      :user-id="member_id"
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
import EditMember from "./editMember.vue";
import changePassword from "components/users/ChangePassword.vue";

import changeImage from "components/users/changeImage.vue";
// import snapPicture from "./snapPicture.vue";

const $q = useQuasar();

const imgTest = ref(null);

const userStore = useUserData();
const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const member_id = ref(null);
const EditMemberDialog = (id) => {
  member_id.value = "";
  showEditDialog.value = true;
  member_id.value = id;
};

const changeImageDialog = (id) => {
  member_id.value = "";
  showCaptureImg.value = true;
  member_id.value = id;
};

const passwordDialog = (id) => {
  member_id.value = "";
  showPasswordDialog.value = true;
  member_id.value = id;
};
const capturedImg = (id) => {
  member_id.value = "";
  showCaptureImg.value = true;
  member_id.value = id;
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
  // userStore.getAllMembers();
});
</script>

<style></style>
