<template>
  <div>
    <q-layout view="lHh Lpr lFf" class="shadow-2 rounded-borders">
      <!-- <q-header elevated class="primary">
        <q-toolbar>
          <q-avatar size="56px" class="q-mb-sm q-mt-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <q-toolbar-title>Gym Membership System</q-toolbar-title>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        </q-toolbar>
      </q-header> -->

      <!-- <q-footer elevated class="primary">
        <q-toolbar>
          <q-toolbar-title class="text-subtitle2"
            >School Information Management System. All Right Reserved. Created
            By: Nehemiah Solutions</q-toolbar-title
          >
        </q-toolbar>
      </q-footer> -->
      <q-splitter
        v-if="$q.screen.gt.sm"
        v-model="splitterModel"
        before-class="overflow-hidden"
        after-class="overflow-hidden"
        class="window-height"
      >
        <template v-slot:before>
          <div class="q-pa-md">
            <q-page-container>
              <router-view />
            </q-page-container>
          </div>
        </template>

        <template v-slot:after>
          <!-- <img
            src="/images/login-side-image.jpeg"
            class="absolute-top-right img-login"
            width="1000"
          /> -->
          <img
            src="/images/Tabas-Pablings.jpeg"
            class="absolute-top-right img-login"
            width="1000"
          />
        </template>
      </q-splitter>
      <div v-else class="q-pa-md">
        <q-page-container>
          <router-view />
        </q-page-container>
      </div>

      <!-- <q-drawer v-model="drawer" :width="200" :breakpoint="767" class="q-mt-sm">
        <q-scroll-area
          style="
            height: calc(100% - 150px);
            margin-top: 150px;
            border-right: 1px solid #ddd;
            margin-bottom: 20px;
          "
        >
          <q-list v-for="(menuItem, index) in menuList" :key="index">
            <q-expansion-item
              expand-separator
              :icon="menuItem.icon"
              :label="menuItem.label"
              v-if="menuItem.subMenu"
            >
              <q-card>
                <q-list v-for="(sub, index) in menuItem.subMenu" :key="index">
                  <q-item
                    clickable
                    v-ripple
                    :to="sub.to"
                    exacat
                    class="q-ml-sm"
                  >
                    <q-item-section avatar>
                      <q-icon :name="sub.icon" />
                    </q-item-section>
                    <q-item-section>{{ sub.label }}</q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </q-expansion-item>
            <q-item v-else clickable v-ripple :to="menuItem.to" exact>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>

              <q-item-section> {{ menuItem.label }} </q-item-section>
            </q-item>

            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="https://cdn.quasar.dev/img/material.png"
          style="height: 150px"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="text-weight-bold">Janlord Luga</div>
            <div>Super-admin</div>
          </div>
        </q-img>
      </q-drawer> -->
    </q-layout>
  </div>
</template>

<script>
import { ref } from "vue";

import { LocalStorage, useQuasar } from "quasar";

const $q = useQuasar();
const menuList = [
  {
    icon: "key",
    label: "Login",
    to: "/login",
    separator: false,
  },
  {
    icon: "save_as",
    label: "Register",
    to: "/register",
    separator: false,
  },
];

export default {
  setup() {
    const $q = useQuasar();
    // const splitterModel = ref(50);
    return {
      drawer: ref(false),
      menuList,
      splitterModel: ref(50),
    };
  },
};
</script>
<style scoped></style>
