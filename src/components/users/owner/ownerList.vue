<template>
  <div class="q-pa-md">
    <q-table
      flat
      :pagination="pagination"
      class="q-pa-sm"
      :rows="companyStore.rowDatasOwner"
      :columns="columns"
      row-key="id"
      separator="cell"
      :visible-columns="
        $q.screen.gt.xs
          ? ['name', 'email', 'number', 'action']
          : ['name', 'email', 'number', 'action']
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

          <q-td key="action" :props="props">
            <q-btn
              color="blue"
              icon="edit"
              label="edit"
              size="sm"
              @click="EditDialog(props.row.id)"
            />
            <q-btn
              color="orange"
              icon="camera_alt"
              label="change image"
              size="sm"
              @click="changeImageDialog(props.row.id)"
            />
            <q-btn
              color="grey"
              icon="password"
              label="change password"
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
    <EditOwner
      :owner-id="owner_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <!-- Change Image -->
  <q-dialog v-model="showCaptureImg">
    <changeImage
      :user-id="owner_id"
      @hide-image-dialog="showCaptureImg = !showCaptureImg"
    />
  </q-dialog>

  <!-- Change Password -->
  <q-dialog v-model="showPasswordDialog">
    <changePassword
      :member-id="owner_id"
      @hide-password-dialog="showPasswordDialog = !showPasswordDialog"
    />
  </q-dialog>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useUserData } from "src/stores/users/store";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import EditOwner from "components/users/owner/editOwner.vue";
import changeImage from "components/users/changeImage.vue";
import changePassword from "components/users/ChangePassword.vue";
import { useCompanyData } from "stores/company/store";

// import snapPicture from "./snapPicture.vue";
const companyStore = useCompanyData();

const $q = useQuasar();

const staffStore = useUserData();
const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const owner_id = ref(null);
const EditDialog = (id) => {
  owner_id.value = "";
  showEditDialog.value = true;
  owner_id.value = id;
};

const passwordDialog = (id) => {
  owner_id.value = "";
  showPasswordDialog.value = true;
  owner_id.value = id;
};
const changeImageDialog = (id) => {
  owner_id.value = "";
  showCaptureImg.value = true;
  owner_id.value = id;
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
  // staffStore.getAllStaff();
});
</script>

<style></style>
