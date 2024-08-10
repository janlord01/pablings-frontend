<template>
  <q-markup-table v-if="branchData.skeleton">
    <thead>
      <tr>
        <th class="text-left" style="width: 150px">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
        <th class="text-right">
          <q-skeleton animation="blink" type="text" />
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="n in 5" :key="n">
        <td class="text-left">
          <q-skeleton animation="blink" type="text" width="85px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="50px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="35px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="65px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="25px" />
        </td>
        <td class="text-right">
          <q-skeleton animation="blink" type="text" width="85px" />
        </td>
      </tr>
    </tbody>
  </q-markup-table>
  <q-table
    v-else
    flat
    grid
    :pagination="pagination"
    :class="$q.dark.isActive ? 'text-white bg-primary-10' : 'text-dark'"
    :rows="branchData.rowDatas"
    :columns="columns"
    row-key="id"
    separator="horizontal"
    :visible-columns="
      $q.screen.gt.xs
        ? ['name', 'code', 'number', 'address', 'action']
        : ['name', 'code', 'number', 'address', 'action']
    "
  >
    <template v-slot:item="props">
      <q-card
        class="my-card row q-mb-md q-mr-sm"
        :style="$q.screen.gt.sm ? 'width: 47%' : 'width: 100%'"
      >
        <q-card-section>
          <div
            :style="$q.screen.gt.sm ? 'font-size: 14px;' : 'font-size: 10px'"
          >
            <span class="text-bold">Branch Name: </span><br />{{
              props.row.name
            }}
          </div>
          <div
            :style="$q.screen.gt.sm ? 'font-size: 14px;' : 'font-size: 10px'"
          >
            <span class="text-bold">Branch Code:</span> <br />
            {{ props.row.code }}
          </div>
          <div
            :style="$q.screen.gt.sm ? 'font-size: 14px;' : 'font-size: 10px'"
          >
            <span class="text-bold">Branch Address:</span> <br />
            {{ props.row.address }}
          </div>
        </q-card-section>
        <q-card-actions class="q-pt-none full-width">
          <q-btn
            :disable="props.row.status != 1"
            label="edit"
            color="primary"
            icon="edit"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 0 3px 3px 0'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            @click="EditBranchDialog(props.row.id)"
          />

          <q-btn
            :disable="props.row.status != 1"
            label="report"
            color="primary"
            icon="equalizer"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 0 3px 3px 0'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            :to="
              '/' + route.params.slug + '/branches/' + props.row.id + '/report'
            "
          />
          <q-btn
            :disable="props.row.status != 1"
            color="primary"
            label="Staff"
            icon="people"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 0 3px 3px 0'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            @click="assignBranchFunc(props.row.id)"
          />

          <q-btn
            :disable="props.row.status != 1"
            color="primary"
            label="product"
            icon="fastfood"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 0 3px 3px 0'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            :to="
              '/' +
              route.params.slug +
              '/branches/' +
              props.row.id +
              '/products'
            "
          />
          <q-btn
            :disable="props.row.status != 1"
            color="primary"
            label="inventory"
            icon="o_inventory"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 0 3px 3px 0'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            :to="
              '/' +
              route.params.slug +
              '/branches/' +
              props.row.id +
              '/inventory'
            "
          />
          <q-btn
            :disable="props.row.status != 1"
            color="primary"
            label="voucher"
            icon="discount"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 0 3px 3px 0'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            :to="
              '/' +
              route.params.slug +
              '/branches/' +
              props.row.id +
              '/discount'
            "
          />
          <q-btn
            :disable="props.row.status != 1"
            color="primary"
            label="Services"
            icon="handyman"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 0 3px 3px 0'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            :to="
              '/' +
              route.params.slug +
              '/branches/' +
              props.row.id +
              '/services'
            "
          />
          <q-btn
            :disable="props.row.status != 1"
            color="primary"
            icon="calendar_month"
            label="booking"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 0 3px 3px 0'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            :to="
              '/' + route.params.slug + '/branches/' + props.row.id + '/booking'
            "
          />
          <q-btn
            :disable="props.row.status != 1"
            color="primary"
            label="Expenses"
            icon="attach_money"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 0 3px 3px 0'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            :to="
              '/' +
              route.params.slug +
              '/branches/' +
              props.row.id +
              '/expenses'
            "
          />
          <q-btn
            :disable="props.row.status != 1"
            color="primary"
            label="Benefits"
            icon="workspaces"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 0 3px 3px 0'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            :to="
              '/' +
              route.params.slug +
              '/branches/' +
              props.row.id +
              '/benefits'
            "
          />
          <q-btn
            :disable="props.row.status != 1"
            color="primary"
            label="Loans"
            icon="credit_card"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 0 3px 3px 0'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            :to="
              '/' + route.params.slug + '/branches/' + props.row.id + '/loans'
            "
          />
          <q-btn
            :disable="props.row.status != 1"
            color="primary"
            label="Payroll"
            icon="account_balance"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 0 3px 3px 0'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            :to="
              '/' + route.params.slug + '/branches/' + props.row.id + '/payroll'
            "
          />
          <q-btn
            :disable="props.row.status != 1"
            color="primary"
            icon="shopping_cart"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 0 3px 3px 0'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            label="POS"
            :to="
              '/' + route.params.slug + '/branches/' + props.row.id + '/cashier'
            "
          />
          <q-btn
            v-if="
              userStore.userDetails.roles.find(
                (role) => role === 'super-admin'
              ) && props.row.status == 1
            "
            color="negative"
            label="Deactivate"
            icon="do_not_disturb"
            :style="
              $q.screen.gt.md
                ? 'font-size: 12px; margin: 3px 3px 0;'
                : 'font-size: 8px; margin: 0 3px 3px 0'
            "
            @click="changeStatus(props.row.id, props.row.status)"
          />
          <q-btn
            v-if="
              userStore.userDetails.roles.find(
                (role) => role === 'super-admin'
              ) && props.row.status == 0
            "
            color="green"
            label="Activate"
            icon="check_circle"
            size="sm"
            @click="changeStatus(props.row.id, props.row.status)"
          />
        </q-card-actions>
      </q-card>
    </template>
    <!-- :grid="!$q.screen.gt.xs" -->
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.id }}
        </q-td>

        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="code" :props="props">
          {{ props.row.code }}
        </q-td>
        <q-td key="number" :props="props">
          {{ props.row.number }}
        </q-td>
        <q-td key="address" :props="props">
          {{ props.row.address }}
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            v-if="props.row.status == 1"
            label="edit"
            color="blue"
            icon="edit"
            size="sm"
            @click="EditBranchDialog(props.row.id)"
          />
          <q-btn
            v-else
            disable
            label="edit"
            color="blue"
            icon="edit"
            size="sm"
            @click="EditBranchDialog(props.row.id)"
          />
          <q-btn
            v-if="props.row.status == 1"
            label="report"
            color="green"
            icon="bar_chart"
            size="sm"
            :to="
              '/' + route.params.slug + '/branches/' + props.row.id + '/report'
            "
          />
          <q-btn
            v-else
            disable
            label="report"
            color="green"
            icon="bar_chart"
            size="sm"
          />
          <q-btn
            v-if="props.row.status == 1"
            color="purple"
            label="staff"
            icon="group"
            size="sm"
            @click="assignBranchFunc(props.row.id)"
          />
          <!-- :to="
              '/' + route.params.slug + '/branches/' + props.row.id + '/staff'
            " -->
          <q-btn
            v-else
            disable
            color="purple"
            label="staff"
            icon="group"
            size="sm"
            @click="assignBranchFunc(props.row.id)"
          />
          <!-- :to="
              '/' + route.params.slug + '/branches/' + props.row.id + '/staff'
            " -->
          <!-- <q-btn
            v-if="props.row.status == 1"
            color="green"
            label="reports"
            icon="bar_chart"
            size="sm"
            :to="'/user/members/' + props.row.id + '/update-photo'"
          />
          <q-btn
            v-else
            disable
            color="green"
            label="reports"
            icon="bar_chart"
            size="sm"
            :to="'/user/members/' + props.row.id + '/update-photo'"
          /> -->

          <q-btn
            v-if="props.row.status == 1"
            color="orange"
            label="product"
            icon="fastfood"
            size="sm"
            :to="
              '/' +
              route.params.slug +
              '/branches/' +
              props.row.id +
              '/products'
            "
          />
          <q-btn
            v-else
            disable
            color="orange"
            label="product"
            icon="fastfood"
            size="sm"
            :to="'/branches/' + props.row.id + '/products'"
          />
          <q-btn
            v-if="props.row.status == 1"
            color="red-4"
            icon="discount"
            label="voucher"
            size="sm"
            :to="
              '/' +
              route.params.slug +
              '/branches/' +
              props.row.id +
              '/discount'
            "
          />
          <q-btn
            v-else
            disable
            color="red-4"
            icon="discount"
            label="voucher"
            size="sm"
            :to="route.params.slug + '/branches/' + props.row.id + '/discount'"
          />
          <q-btn
            v-if="props.row.status == 1"
            color="primary"
            icon="content_cut"
            label="services"
            size="sm"
            :to="
              '/' +
              route.params.slug +
              '/branches/' +
              props.row.id +
              '/services'
            "
          />
          <q-btn
            v-else
            disable
            color="primary"
            icon="content_cut"
            label="services"
            size="sm"
            :to="
              '/' +
              route.params.slug +
              '/branches/' +
              props.row.id +
              '/services'
            "
          />
          <q-btn
            v-if="props.row.status == 1"
            color="secondary"
            label="POS"
            icon="shopping_cart"
            size="sm"
            :to="
              '/' + route.params.slug + '/branches/' + props.row.id + '/cashier'
            "
          />
          <q-btn
            v-else
            disable
            color="secondary"
            label="POS"
            icon="shopping_cart"
            size="sm"
            :to="
              '/' + route.params.slug + '/branches/' + props.row.id + '/cashier'
            "
          />
          <q-btn
            v-if="
              userStore.userDetails.roles.find(
                (role) => role === 'super-admin'
              ) && props.row.status == 1
            "
            color="negative"
            label="Deactivate"
            icon="do_not_disturb"
            size="sm"
            @click="changeStatus(props.row.id, props.row.status)"
          />
          <q-btn
            v-if="
              userStore.userDetails.roles.find(
                (role) => role === 'super-admin'
              ) && props.row.status == 0
            "
            color="green"
            label="Activate"
            icon="check_circle"
            size="sm"
            @click="changeStatus(props.row.id, props.row.status)"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- Edit Branch -->
  <q-dialog v-model="showEditDialog">
    <EditBranch
      :branch-id="branch_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>

  <q-dialog v-model="showAssignDialog">
    <assignBranch
      :branch-id="branch_id"
      @hide-assign-dialog="showAssignDialog = !showAssignDialog"
    />
  </q-dialog>

  <!-- Capture Image -->

  <!-- Edit Member -->
</template>

<script setup>
import { api } from "src/boot/axios";
import { useBranchData } from "stores/branch/store";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import EditStaff from "components/users/staff/editStaff.vue";
import changePassword from "components/users/ChangePassword.vue";
import EditBranch from "./EditBranch.vue";
import assignBranch from "./AssignBranch.vue";
import { useUserData } from "stores/users/store";
import { useRoute } from "vue-router";
// import { route } from "quasar/wrappers";

// import snapPicture from "./snapPicture.vue";

const userStore = useUserData();

const route = useRoute();

const $q = useQuasar();

const branchData = useBranchData();
const showEditDialog = ref(false);
const showStaffDialog = ref(false);
const showAssignDialog = ref(false);
const branch_id = ref(null);
const showStaffDialogFunc = (id) => {
  showStaffDialog.value = true;
  branch_id.value = id;
};
const EditBranchDialog = (id) => {
  branch_id.value = "";
  showEditDialog.value = true;
  branch_id.value = id;
};

const assignBranchFunc = (id) => {
  branch_id.value = "";
  showAssignDialog.value = true;
  branch_id.value = id;
};

const changeStatus = (id, status) => {
  // console.log(id);
  const newToken = LocalStorage.getItem("jwt");

  $q.dialog({
    title: "Confirm",
    message: `Are you sure you want to ${
      status == 1 ? "deactivate" : "activate"
    } this branch?`,
    cancel: {
      color: "grey",
    },
    ok: {
      color: status == 1 ? "red" : "green",
      label: status == 1 ? "Yes, Deactivate" : "Yes, Activate",
    },
    persistent: true,
  })
    .onOk(() => {
      $q.loading.show();
      // console.log('>>>> OK')
      api
        .patch(`/api/branch/status/change/${id}`, {
          headers: {
            Authorization: "Bearer " + newToken,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.status === 200) {
            setTimeout(() => {
              $q.notify({
                type: "positive",
                position: "top",
                timeout: 3000,
                message: response.data.message,
              });
              $q.loading.hide();

              branchData.getAllBranches(route.params.slug);
            }, 1000);
          } else {
            setTimeout(() => {
              $q.notify({
                type: "negative",
                position: "top",
                timeout: 3000,
                message: response.data.message,
              });

              $q.loading.hide();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    });
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
    classes: "bg-grey-10",
  },
  {
    name: "name",
    label: "Branch Name",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "code",
    label: "Branch Code",
    field: "code",
    align: "left",
  },
  {
    name: "number",
    label: "Contact Number",
    field: "number",
    align: "left",
  },
  {
    name: "address",
    label: "Address",
    field: "address",
    align: "left",
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
]);
onMounted(() => {
  //   branchData.getAllStaff();
});
</script>

<style></style>
