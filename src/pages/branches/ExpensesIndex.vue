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
      <q-toolbar class="q-mt-sm">
        <q-toolbar-title
          :class="$q.screen.gt.xs ? ' full-width  text-h6' : 'hidden'"
          >{{ mainStore.loc }}
        </q-toolbar-title>
        <!-- <q-input
          bottom-slots
          v-model="searchUser"
          @keyup="onSearchSubmit"
          label="Search Expenses"
          outlined
          class="search_input"
        >
          <template v-slot:append>
            <q-icon
              v-if="searchUser !== ''"
              name="close"
              @click="onLoadAllData"
              class="cursor-pointer"
            />
            <q-icon name="search" size="sm" />
          </template>
        </q-input> -->
        <q-btn
          icon="add_circle"
          color="primary"
          size="sm"
          style="padding-top: 15px; padding-bottom: 15px; margin-top: 0px"
          :label="$q.screen.gt.xs ? 'Create An Expense' : 'Expenses'"
          @click="createDialog"
        />
      </q-toolbar>
      <ExpensesList />

      <q-dialog v-model="showCreateDialog">
        <CreateExpense
          @hide-create-dialog="showCreateDialog = !showCreateDialog"
        />
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import { useProductDatas } from "src/stores/branch/productStores";
import { LocalStorage, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import productList from "src/components/branches/products/BranchProductList.vue";
import createBranch from "src/components/branches/CreateBranch.vue";
import importMember from "src/components/users/member/importMember.vue";
import CreateExpense from "src/components/branches/expenses/CreateExpense.vue";
import { useRoute } from "vue-router";
import { useUserData } from "stores/users/store";
import { useExpensesData } from "src/stores/branch/expensesStore";
import ExpensesList from "src/components/branches/expenses/ExpensesList.vue";
const mainStore = useUserData();

const expenseStore = useExpensesData();
const route = useRoute();

const productStore = useProductDatas();

const searchUser = ref("");
const onSearchSubmit = () => {};
const onLoadAllData = () => {
  searchUser.value = "";
};
// const getBranch = async () => {
//   api
//     .get(`api/branch/${route.params.id}`, {
//       headers: {
//         Authorization: "Bearer " + LocalStorage.getItem("jwt"),
//       },
//     })
//     .then((response) => {
//       mainStore.loc = response.data.branch.name + " Product";
//       console.log(response);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
const showCreateDialog = ref(false);
const showImportDialog = ref(false);

const createDialog = () => {
  showCreateDialog.value = true;
};
const ImportDialog = () => {
  showImportDialog.value = true;
};
onMounted(() => {
  mainStore.loc = "Expenses";
  mainStore.getAllStaff([route.params.slug]);
  expenseStore.getAllExpenses(route.params.id);
  // getBranch();
  // productStore.getAllBranchProducts(route.params.id);
  // getCodesFunc();
  // console.log(codes);
});
</script>
<style></style>
