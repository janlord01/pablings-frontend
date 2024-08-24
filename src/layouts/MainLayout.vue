<script setup>
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  onBeforeMount,
  watch,
  computed,
} from "vue";
import { useUserData } from "stores/users/store";
import { storeToRefs } from "pinia";
import { colors, setCssVar, useQuasar, LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { useMainStoreData } from "stores/store";
import { useSettingData } from "stores/settings/SettingStore";
import { useRoute, useRouter } from "vue-router";
import { useCompanyData } from "src/stores/company/store";
// import { route } from "quasar/wrappers";
const fab1 = ref(true);
const tab = ref("home");
const companyStore = useCompanyData();

const route = useRoute();
const router = useRouter();

const $q = useQuasar();
const userStore = useUserData();

const changeTheme = () => {
  // $q.dark.set(LocalStore.setItem('dark', true))
  if (LocalStorage.getItem("dark") == false) {
    LocalStorage.set("dark", true);
    $q.dark.set(LocalStorage.getItem("dark"));
  } else {
    LocalStorage.set("dark", false);
    $q.dark.set(LocalStorage.getItem("dark"));
  }

  // console.log(LocalStorage.getItem("dark"));
};

// const userImg = ref(userStore.userDetails.user.image_path);

const mainStore = useMainStoreData();

const loc = ref("Gnb POS System");

const { themeColors } = storeToRefs(useSettingData());

const settingStore = useSettingData();

const { lighten } = colors;

// $q.dark.set(true);

// setCssVar("grey-2", "#e6ebf1");

const leftDrawerOpen = ref(false);
const miniState = ref(false);

const logo = ref(null);

const link = ref(0);

const memberBranch = computed(() => {
  return userStore.userDetails.branch;
});
const companyLogo = watch(
  () => companyStore.rowDatasCompany,
  (newValue, oldValue) => {
    // console.log(newValue);
    logo.value = typeof newValue !== "undefined" ? newValue.logo : null;
  }
);
const memberDatas = watch(
  () => userStore.branch,
  (newValue, oldValue) => {
    // console.log("new value" + newValue.branch);
    // if (newValue.branch != 0) {
    //   memberBranch.value = newValue.branch;
    //   console.log(memberBranch.value);
    // }
    link.value = newValue;

    // console.log(link.value);
    // return newValue.branch;
  }
);

const slug = ref(null);
const computedSlug = computed(() => {
  return userStore.userDetails.slug;
});

const slugWatch = watch(
  () => userStore.userDetails.slug,
  (newValue, oldValue) => {
    // console.log("new value" + newValue);
    // slug.value = newValue;
    // if (route.params.slug) {
    //   if (newValue !== route.params.slug) {
    //     setTimeout(() => {
    //       $q.notify({
    //         type: "negative",
    //         position: "top",
    //         timeout: 5000,
    //         message:
    //           "Access Denied! You don't have permission to access this section!",
    //       });
    //       router.go(-1);
    //     }, 1000);
    //   }
    // }
    // console.log(slug.value);
    // return newValue;
  }
);
const essentialLinks = reactive([
  {
    icon: "eva-home-outline",
    label: "Dashboard",
    to: "/dashboard",
    separator: false,
    role: ["super-admin", "member", "cashier", "manager", "owner"],
  },

  {
    icon: "eva-people-outline",
    label: "Users",
    to: "/dashboard",
    separator: false,
    role: ["super-admin"],
    subMenu: [
      // {
      //   // icon: "boy",
      //   label: "Clients",
      //   to: "/user/members",
      //   role: ["super-admin"],
      // },
      {
        // icon: "hail",
        label: "Staff",
        to: "/user/staff",
        role: ["super-admin"],
      },
    ],
  },
  {
    icon: "o_store",
    label: "Company",
    to: "/company",
    separator: false,
    role: ["super-admin"],
  },
  {
    icon: "eva-sync-outline",
    label: "Plan",
    to: "/plans",
    separator: false,
    role: ["super-admin"],
  },

  {
    icon: "o_shopping_cart",
    label: "Admin Cashier",
    to: "/cashier",
    // to: userStore,
    separator: false,
    role: ["super-admin"],
    // permission: ["view-profile"],
  },
  {
    icon: "o_groups",
    label: "Staff",
    separator: false,
    role: ["owner"],
  },

  // {
  //   icon: "o_fastfood",
  //   label: "Product",
  //   separator: false,
  //   role: ["owner"],
  // },

  {
    icon: "o_construction",
    label: "Services",
    separator: false,
    role: ["owner"],
  },

  // {
  //   icon: "o_inventory",
  //   label: "Inventory",
  //   to: "/inventory",
  //   separator: false,
  //   role: ["owner"],
  // },

  {
    icon: "o_co_present",
    label: "Supplier",
    to: "/supplier/",
    separator: false,
    role: ["owner"],
  },

  {
    icon: "o_store",
    label: "Branches",
    to: slug.value + "/branches",
    separator: false,
    role: ["owner"],
  },

  // {
  //   icon: "o_receipt",
  //   label: "Orders",
  //   to: slug.value + "/order",
  //   separator: false,
  //   role: ["owner"],
  // },
  {
    icon: "eva-settings-outline",
    label: "Settings",
    to: slug.value + "/settings",
    separator: false,
    role: ["owner"],
  },

  // Manager / Cashier
  {
    icon: "o_groups",
    label: "Clients",
    separator: false,
    role: ["cashier", "manager", "franchisee"],
  },
  {
    icon: "o_fastfood",
    label: "Products",
    to: "/branches/" + link.value + "/products",
    separator: false,
    role: ["cashier", "manager", "franchisee"],
  },
  {
    icon: "o_fastfood",
    label: "Inventory",
    to: "/branches/" + link.value + "/inventory",
    separator: false,
    role: ["cashier", "manager", "franchisee"],
  },

  {
    icon: "o_local_offer",
    label: "Voucher",
    to: "/voucher/",
    separator: false,
    role: ["cashier", "manager", "franchisee"],
  },
  // {
  //   icon: "attach_money",
  //   label: "Finance",
  //   to: "/branches/" + userStore.userDetails.branch + "/cashier",
  //   separator: false,
  //   role: ["cashier", "manager", "franchisee"],
  //   subMenu: [
  //     {
  //       icon: "o_shopping_cart",
  //       label: "Cashier",
  //       to: `/${userStore.userDetails.slug}/branches/${link.value}/cashier`,
  //       separator: false,
  //       role: ["cashier", "manager", "franchisee"],
  //     },
  //     {
  //       icon: "attach_money",
  //       label: "Expenses",
  //       to: `/${userStore.userDetails.slug}/branches/${link.value}/expenses`,
  //       separator: false,
  //       role: ["manager", "cashier", "franchisee"],
  //     },
  //     {
  //       icon: "o_workspaces",
  //       label: "Benefits",
  //       to: `/${userStore.userDetails.slug}/branches/${link.value}/benefits`,
  //       separator: false,
  //       role: ["manager", "cashier", "franchisee"],
  //     },
  //     {
  //       icon: "o_credit_card",
  //       label: "Loans",
  //       to: `/${userStore.userDetails.slug}/branches/${link.value}/loans`,
  //       separator: false,
  //       role: ["manager", "cashier", "franchisee"],
  //     },
  //     {
  //       icon: "o_account_balance",
  //       label: "Payroll",
  //       to: `/${userStore.userDetails.slug}/branches/${link.value}/payroll`,
  //       separator: false,
  //       role: ["manager", "cashier", "franchisee"],
  //     },
  //   ],
  // },
  {
    icon: "o_shopping_cart",
    label: "Cashier",
    to: "/branches/" + userStore.userDetails.branch + "/cashier",
    separator: false,
    role: ["cashier", "manager", "franchisee"],
  },
  {
    icon: "attach_money",
    label: "Expenses",
    to: "/branches/" + userStore.userDetails.branch + "/expenses",
    // to: userStore,
    separator: false,
    role: ["manager", "cashier", "franchisee"],
    // permission: ["view-profile"],
  },
  {
    icon: "o_workspaces",
    label: "Benefits",
    to: "/branches/" + userStore.userDetails.branch + "/benefits",
    // to: userStore,
    separator: false,
    role: ["manager", "cashier", "franchisee"],
    // permission: ["view-profile"],
  },
  {
    icon: "o_credit_card",
    label: "Loans",
    to: "/branches/" + userStore.userDetails.branch + "/loans",
    // to: userStore,
    separator: false,
    role: ["manager", "cashier", "franchisee"],
    // permission: ["view-profile"],
  },
  {
    icon: "o_account_balance",
    label: "Payroll",
    to: `/${userStore.userDetails.slug}/branches/${link.value}/payroll`,
    separator: false,
    role: ["manager", "cashier", "franchisee"],
  },

  {
    icon: "o_account_balance",
    label: "Coop",
    to: `/${userStore.userDetails.slug}/branches/${link.value}/coop`,
    separator: false,
    role: ["manager", "cashier", "franchisee"],
  },

  // {
  //   icon: "eva-settings-outline",
  //   label: "Settings",
  //   to: "/colleges",
  //   separator: false,
  //   role: ["owner"],
  //   subMenu: [
  //     {
  //       icon: "ballot",
  //       label: "Business Information",
  //       to: "/settings/",
  //       role: ["owner"],
  //     },
  //     {
  //       icon: "tune",
  //       label: "Customize Themes",
  //       to: "/settings/themes",
  //       role: ["super-admin"],
  //     },
  //     {
  //       icon: "psychology",
  //       label: "Health History Form",
  //       to: "/courses",

  //       role: ["super-admin"],
  //     },
  //   ],
  // },

  {
    icon: "power_settings_new",
    label: "Logout",
    to: "/logout",
    separator: false,
    role: ["logout"],
  },
]);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const loginSubmit = () => {
  userStore.logoutUser();
};
onBeforeMount(() => {
  // userStore.getUserDetails();
});

// const userSlug = computed(() => userStore.$state.userDetails.slug);

// const onLoad = () => {
//   if (route.params.slug) {
//     if (userSlug.value !== route.params.slug) {
//       setTimeout(() => {
//         $q.notify({
//           type: "negative",
//           position: "top",
//           timeout: 5000,
//           message:
//             "Access Denied! You don't have permission to access this section!",
//         });
//         router.go(-1);
//       }, 500);
//     }
//   }
// };

const textColor = ref(null);
const mainColor = ref(null);

// const themeComputed = computed(
//   () => settingStore.themeColors,
//   (val) => {
//     console.log(val);
//   }
// );

const updateLoc = watch(
  () => mainStore.loc,
  (newValue, oldValue) => {
    // console.log(newValue);
  }
);

const theme = watch(
  () => settingStore.themeColors,
  (newValue, oldValue) => {
    // console.log(newValue);
    // textColor.value = newValue.text_color;
    // mainColor.value = newValue.main;
    // setCssVar("grey-2", newValue.grey-2);
    // setCssVar("secondary", newValue.secondary);
    // setCssVar("accent", newValue.accent);
    // setCssVar("positive", newValue.positive);
    // setCssVar("negative", newValue.negative);
    // setCssVar("info", newValue.info);
    // setCssVar("warning", newValue.warning);
    // setCssVar("dark", newValue.text_color);
  }
);
const getBranchName = ref("");
onMounted(() => {
  companyStore.getCompany(route.params.slug ? route.params.slug : "admin");
  userStore.getUserDetails();
  // settingStore.getColor();
  if (LocalStorage.getItem("dark")) {
    $q.dark.set(LocalStorage.getItem("dark"));
  } else {
    LocalStorage.set("dark", false);
    $q.dark.set(LocalStorage.getItem("dark"));
  }
  miniState.value = true;
  // if ($q.screen.gt.sm) {
  miniState.value = false;
  // }
  // slug.value = computedSlug.value;

  link.value = LocalStorage.getItem("bb");
  setTimeout(() => {
    setColor();
    getBranchName.value = LocalStorage.getItem("branchName");
  }, 300);
  // getColor();
});

const setColor = () => {
  // console.log(themeColors.value);
  // setCssVar("grey-2", settingStore.themeColors.grey-2);
  // setCssVar("secondary", settingStore.themeColors.secondary);
  // setCssVar("accent", settingStore.themeColors.accent);
  // setCssVar("positive", settingStore.themeColors.positive);
  // setCssVar("negative", settingStore.themeColors.negative);
  // setCssVar("info", settingStore.themeColors.info);
  // setCssVar("warning", settingStore.themeColors.warning);
  // setCssVar("dark", settingStore.themeColors.text_color);
  // textColor.value = settingStore.themeColors.text_color;
  // mainColor.value = settingStore.themeColors.main;
};
</script>
<template>
  <q-layout view="lhh Lpr lFf">
    <!-- $q.dark.isActive -->
    <!-- :style="
        'text-color:' +
        settingStore.themeColors.text_color +
        '!important;' +
        'background:' +
        settingStore.themeColors.main
      " -->
    <q-header
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10 ' : 'text-dark bg-grey-2'
      "
    >
      <q-toolbar>
        <q-btn
          v-if="mainStore.loc != 'Dashboard'"
          flat
          dense
          round
          icon="arrow_back"
          @click="router.go(-1)"
        />

        <q-toolbar-title
          :class="
            $q.screen.gt.xs ? 'invisible' : 'full-width text-center text-body2'
          "
        >
          {{ mainStore.loc }}
        </q-toolbar-title>

        <div>
          <!-- <q-page-sticky position="bottom-right" :offset="[18, 6]">
            <q-fab
              v-model="fab1"
              :label="
                LocalStorage.getItem('branchName')
                  ? LocalStorage.getItem('branchName')
                  : userStore.userDetails.roles.toString()
              "
              label-position="top"
              label-class="bg-black text-white"
              external-label
              color="grey"
              icon="keyboard_arrow_up"
              direction="right"
            >
            </q-fab>
          </q-page-sticky> -->
          <span
            :style="$q.screen.gt.xs ? 'font-size: 15px;' : 'font-size:10px;'"
          >
            Welcome,
            {{
              userStore.userDetails.user
                ? userStore.userDetails.user.firstname
                : ""
            }}
          </span>

          <span class="text-body2 text-capitalize">
            <!-- <q-btn class="no-hover" unelevated dense ripple :to="'/account'">
              <q-avatar v-if="userStore.userDetails.user" size="32px">
                <img :src="userStore.userDetails.user.image_path" />
              </q-avatar>
              <q-icon v-else left name="account_circle" />
            </q-btn> -->
            <q-btn class="no-hover" unelevated dense ripple>
              <q-avatar v-if="userStore.userDetails.user" size="32px">
                <img :src="userStore.userDetails.user.image_path" />
              </q-avatar>
              <q-icon v-else left name="account_circle" />
              <q-menu>
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <div class="q-mb-md" style="font-size: 22px">
                      Account Settings
                    </div>
                    <q-list>
                      <q-item
                        clickable
                        v-if="$q.dark.isActive"
                        v-ripple
                        @click="changeTheme"
                      >
                        <q-item-section avatar>
                          <q-icon
                            dense
                            size="20px"
                            flat
                            name="eva-sun-outline"
                          />
                        </q-item-section>

                        <q-item-section>
                          <span
                            style="
                              font-size: 10px;
                              font-weight: bold;
                              margin-left: -20px;
                            "
                            >LIGHT THEME</span
                          >
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-if="!$q.dark.isActive"
                        v-ripple
                        @click="changeTheme"
                      >
                        <q-item-section avatar>
                          <q-icon
                            dense
                            size="20px"
                            flat
                            name="eva-moon-outline"
                          />
                        </q-item-section>

                        <q-item-section>
                          <span
                            style="
                              font-size: 10px;
                              font-weight: bold;
                              margin-left: -20px;
                            "
                            >DARK THEME</span
                          >
                        </q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        v-ripple
                        :to="`/${computedSlug}/accounts`"
                      >
                        <q-item-section avatar>
                          <q-icon
                            dense
                            size="20px"
                            flat
                            name="eva-person-outline"
                          />
                          <!-- <q-btn
                            dense
                            size="sm"
                            class="q-ml-sm"
                            flat
                            label="Account"
                            icon="eva-person-outline"
                          /> -->
                        </q-item-section>

                        <q-item-section
                          ><span
                            style="
                              font-size: 10px;
                              font-weight: bold;
                              margin-left: -20px;
                            "
                            >ACCOUNT</span
                          ></q-item-section
                        >
                      </q-item>
                    </q-list>
                  </div>

                  <q-separator vertical inset class="q-mx-lg" />

                  <div class="column items-center">
                    <q-avatar size="72px">
                      <img :src="userStore.userDetails.user.image_path" />
                    </q-avatar>
                    <q-btn dense label="Change" size="10px" flat color="blue" />
                    <q-chip
                      :label="userStore.userDetails.roles.toString()"
                      size="sm"
                      icon="badge"
                    />

                    <!-- icon="power_settings_new" -->
                    <q-btn
                      color="negative"
                      label="Logout"
                      class="q-mt-sm"
                      @click="userStore.logoutUser"
                      size="sm"
                      v-close-popup
                    />
                  </div>
                </div>
              </q-menu>
            </q-btn>
            <q-btn
              v-if="$q.screen.gt.xs"
              flat
              dense
              round
              icon="menu"
              aria-label="Menu"
              @click="toggleLeftDrawer"
            />
          </span>

          <!-- <q-btn
            dense
            size="sm"
            @click="$q.dark.set(true)"
            v-if="!$q.dark.isActive"
            class="q-ml-sm"
            flat
            icon="eva-moon-outline"
          />
          <q-btn
            dense
            size="sm"
            @click="$q.dark.set(false)"
            v-if="$q.dark.isActive"
            class="q-ml-sm"
            flat
            icon="eva-sun-outline"
          /> -->

          <!-- <span>Version: v1.0.0</span> -->
        </div>
      </q-toolbar>
    </q-header>
    <q-footer
      class="text-dark"
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10 ' : 'text-dark bg-grey-2'
      "
    >
      <q-toolbar v-if="$q.screen.width > 1008">
        <q-toolbar-title style="font-size: 14px"
          >Comprehensive Business Management &copy; Copyright 2024. All Right
          Reserved.
        </q-toolbar-title>
      </q-toolbar>
      <q-tabs
        dense
        v-else-if="
          $q.screen.width <= 1008 &&
          userStore.userDetails.roles.some(
            (permis) => ['super-admin'].indexOf(permis) !== -1
          )
        "
        no-caps
        active-color="white"
        indicator-color="white"
        class="bg-blue text-white q-pt-sm text-caption text-weight-thin"
        active-class="active_link_mobile"
        v-model="tab"
      >
        <q-route-tab
          name="home"
          ripple
          :to="'/dashboard'"
          icon="eva-home-outline"
          label="Home"
        />
        <q-route-tab
          name="company"
          :to="'/company'"
          ripple
          icon="o_store"
          label="Company"
        />

        <q-route-tab
          name="plan"
          ripple
          :to="'/plans'"
          icon="eva-sync-outline"
          label="Plan"
        />
        <q-route-tab
          name="admin_cashier"
          ripple
          :to="'/cashier'"
          icon="o_shopping_cart"
          label="Cashier"
        />
      </q-tabs>

      <!-- Owner Mobile Tab -->
      <q-tabs
        dense
        v-else-if="
          $q.screen.width <= 1008 &&
          userStore.userDetails.roles.some(
            (permis) => ['owner'].indexOf(permis) !== -1
          )
        "
        no-caps
        active-color="white"
        indicator-color="white"
        class="bg-blue text-white text-sm q-pt-sm text-caption text-weight-thin menu_size"
        active-class="active_link_mobile"
        v-model="tab"
      >
        <q-route-tab
          name="home"
          ripple
          :to="`/${computedSlug}/dashboard`"
          icon="eva-home-outline"
          label="Home"
        />
        <!-- <q-route-tab
          name="products"
          :to="`/${computedSlug}/products`"
          ripple
          icon="o_fastfood"
          label="Products"
        /> -->

        <q-route-tab
          name="inventory"
          ripple
          :to="`/${computedSlug}/inventory`"
          icon="o_inventory"
          label="Inventory"
        />
        <q-route-tab
          name="branches"
          ripple
          :to="`/${computedSlug}/branches`"
          icon="o_store"
          label="Branches"
        />
        <q-route-tab
          name="Menu"
          ripple
          icon="menu"
          label="Menu"
          @click="toggleLeftDrawer"
        />

        <!-- <q-route-tab
          name="order"
          ripple
          :to="`/${computedSlug}/order`"
          icon="o_store"
          label="Orders"
        /> -->
      </q-tabs>

      <!-- Owner Mobile Tab -->
      <q-tabs
        dense
        v-else-if="
          $q.screen.width <= 1008 &&
          userStore.userDetails.roles.some(
            (permis) => ['cashier'].indexOf(permis) !== -1
          )
        "
        no-caps
        active-color="white"
        indicator-color="white"
        class="bg-blue text-white q-pt-sm text-caption text-weight-thin"
        active-class="active_link_mobile"
        v-model="tab"
      >
        <q-route-tab
          name="home"
          ripple
          :to="`/${computedSlug}/dashboard`"
          icon="eva-home-outline"
          label="Home"
        />
        <q-route-tab
          name="products"
          :to="`/${computedSlug}/branches/${link}/products`"
          ripple
          icon="o_fastfood"
          label="Products"
        />

        <q-route-tab
          name="cashier"
          ripple
          :to="`/${computedSlug}/branches/${link}/cashier`"
          icon="o_shopping_cart"
          label="cashier"
        />

        <q-route-tab
          name="Menu"
          ripple
          icon="menu"
          label="Menu"
          @click="toggleLeftDrawer"
        />
        <!-- <q-route-tab
          name="account"
          ripple
          :to="`/${computedSlug}/accounts`"
          icon="o_account_circle"
          label="Account"
        /> -->
      </q-tabs>

      <!-- Owner Mobile Tab -->
      <q-tabs
        dense
        v-else-if="
          $q.screen.width <= 1008 &&
          userStore.userDetails.roles.some(
            (permis) => ['manager', 'franchisee'].indexOf(permis) !== -1
          )
        "
        no-caps
        active-color="white"
        indicator-color="white"
        class="bg-blue text-white q-pt-sm text-caption text-weight-thin"
        active-class="active_link_mobile"
        v-model="tab"
      >
        <q-route-tab
          name="home"
          ripple
          :to="`/${computedSlug}/dashboard`"
          icon="eva-home-outline"
          label="Home"
        />
        <q-route-tab
          name="products"
          :to="`/${computedSlug}/branches/${link}/products`"
          ripple
          icon="o_fastfood"
          label="Products"
        />

        <!-- <q-route-tab
          name="voucher"
          ripple
          :to="`/${computedSlug}/branches/${link}/discount`"
          icon="o_local_offer"
          label="Voucher"
        /> -->
        <q-route-tab
          name="cashier"
          ripple
          :to="`/${computedSlug}/branches/${link}/cashier`"
          icon="o_shopping_cart"
          label="cashier"
        />

        <q-route-tab
          name="Menu"
          ripple
          icon="menu"
          label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-tabs>
    </q-footer>

    <q-drawer
      class="sidebar"
      :width="250"
      :mini="miniState"
      @mouseover="$q.screen.gt.sm ? (miniState = false) : ''"
      @mouseout="$q.screen.gt.sm ? (miniState = true) : ''"
      bordered
      v-model="leftDrawerOpen"
      :breakpoint="960"
      show-if-above
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10 ' : 'text-dark bg-grey-2'
      "
    >
      <!-- <q-item-label class="text-dark" header> Menus </q-item-label> -->
      <div class="q-mt-md q-mb-xl border full-width">
        <q-img
          :src="logo"
          loading="lazy"
          :width="!miniState ? '80px' : '20px'"
          class="block q-mx-auto"
          v-if="logo"
        />
        <q-img
          v-else
          src="/images/gnb-logo.jpeg"
          loading="lazy"
          :width="!miniState ? '180px' : '20px'"
          class="block q-mx-auto"
        />
      </div>
      <q-list
        :class="!miniState ? 'text-dark ' : ''"
        v-for="(menuItem, index) in essentialLinks"
        :key="index"
      >
        <q-expansion-item
          :expand-icon-class="$q.dark.isActive ? 'text-white ' : 'text-dark '"
          class=""
          :class="
            $q.dark.isActive
              ? 'text-white bg-blue-grey-10 '
              : 'text-dark bg-grey-2'
          "
          expand-separator
          :icon="menuItem.icon"
          :label="menuItem.label"
          v-if="menuItem.subMenu && userStore.checkRole(menuItem.role)"
        >
          <q-card
            :class="
              $q.dark.isActive
                ? 'text-white bg-blue-grey-10 '
                : 'text-dark bg-grey-2'
            "
          >
            <q-list
              :class="
                $q.dark.isActive
                  ? 'text-white bg-blue-grey-10 '
                  : 'text-dark bg-grey-2'
              "
              v-for="(sub, index) in menuItem.subMenu"
              :key="index"
            >
              <q-item
                clickable
                v-ripple
                class="q-ml-sm"
                :class="
                  $q.dark.isActive
                    ? 'text-white bg-blue-grey-10 '
                    : 'text-dark bg-grey-2'
                "
                v-if="
                  userStore.checkRole(sub.role) &&
                  (sub.label === 'Products' || sub.label === 'Inventory')
                "
                :to="`/${computedSlug}` + sub.to"
                exact
              >
                <q-item-section avatar>
                  <q-icon :name="sub.icon" />
                </q-item-section>
                <q-item-section>{{ sub.label }}</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                class="q-ml-sm"
                :class="
                  $q.dark.isActive
                    ? 'text-white bg-blue-grey-10 '
                    : 'text-dark bg-grey-2'
                "
                v-else-if="userStore.checkRole(sub.role)"
                :to="sub.to"
                exact
              >
                <q-item-section avatar>
                  <q-icon :name="sub.icon" />
                </q-item-section>
                <q-item-section>{{ sub.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-expansion-item>

        <!-- <q-item
          v-else-if="menuItem.label == 'Logout'"
          :class="!miniState ? 'q-ml-lg' : ''"
          class="q-mb-sm q-pr-sm logout absolute-bottom"
          clickable
          @click="userStore.logoutUser"
          v-ripple
          exact
        >
          <q-item-section avatar>
            <q-icon :name="menuItem.icon" />
          </q-item-section>
          <q-item-section>
            {{ menuItem.label }}
          </q-item-section>
        </q-item> -->

        <q-item
          class=""
          v-else-if="
            menuItem.label !== 'Logout' && userStore.checkRole(menuItem.role)
          "
          clickable
          v-ripple
          :to="
            menuItem.label == 'Cashier'
              ? `/${computedSlug}/branches/${link}/cashier`
              : menuItem.label == 'Expenses'
              ? `/${computedSlug}/branches/${link}/expenses`
              : menuItem.label == 'Loans'
              ? `/${computedSlug}/branches/${link}/loans`
              : menuItem.label == 'Payroll'
              ? `/${computedSlug}/branches/${link}/payroll`
              : menuItem.label == 'Benefits'
              ? `/${computedSlug}/branches/${link}/benefits`
              : menuItem.label == 'Products'
              ? `/${computedSlug}/branches/${link}/products`
              : menuItem.label == 'Inventory'
              ? `/${computedSlug}/branches/${link}/inventory`
              : menuItem.label == 'Voucher'
              ? `/${computedSlug}/branches/${link}/discount`
              : menuItem.label == 'Clients'
              ? `/${computedSlug}/branches/${link}/client`
              : menuItem.label == 'Coop'
              ? `/${computedSlug}/branches/${link}/coop`
              : menuItem.label == 'Branches' &&
                menuItem.role.find((element) => element == 'owner')
              ? `/${computedSlug}/branches`
              : menuItem.label == 'Orders' &&
                menuItem.role.find((element) => element == 'owner')
              ? `/${computedSlug}/order`
              : menuItem.label == 'Settings' &&
                menuItem.role.find((element) => element == 'owner')
              ? `/${computedSlug}/settings`
              : menuItem.label == 'Product' &&
                menuItem.role.find((element) => element == 'owner')
              ? `/${computedSlug}/products`
              : menuItem.label == 'Services' &&
                menuItem.role.find((element) => element == 'owner')
              ? `/${computedSlug}/services`
              : menuItem.label == 'Staff' &&
                menuItem.role.find((element) => element == 'owner')
              ? `/${computedSlug}/staff`
              : menuItem.label == 'Supplies' &&
                menuItem.role.find((element) => element == 'owner')
              ? `/${computedSlug}/supplies`
              : menuItem.label == 'Inventory' &&
                menuItem.role.find((element) => element == 'owner')
              ? `/${computedSlug}/inventory`
              : menuItem.label == 'Supplier' &&
                menuItem.role.find((element) => element == 'owner')
              ? `/${computedSlug}/supplier`
              : menuItem.label == 'Dashboard'
              ? `/${computedSlug}/dashboard`
              : menuItem.to
          "
          exact
        >
          <!-- -->
          <q-item-section avatar>
            <q-icon :name="menuItem.icon" />
          </q-item-section>
          <q-item-section>
            {{ menuItem.label
            }}<q-badge
              color="red"
              v-if="menuItem.label == 'Orders' && userStore.orderCount > 0"
              floating
            >
              {{ userStore.orderCount }}</q-badge
            >
          </q-item-section>
        </q-item>
      </q-list>
      <!-- <span
        class="text-center block full-width"
        style="position: absolute; bottom: 10px; font-size: 12px"
      >
        <span class="block text-center" v-if="getBranchName !== ''">
          {{ LocalStorage.getItem("branchName") }}
        </span>
        <q-chip
          v-else
          :label="userStore.userDetails.roles.toString()"
          size="sm"
          icon="badge"
        />
      </span> -->
    </q-drawer>

    <q-page-container>
      <div
        :class="
          $q.dark.isActive
            ? 'text-white bg-blue-grey-10 '
            : 'text-dark bg-grey-2'
        "
      >
        <div :class="$q.screen.gt.xs ? 'q-pa-lg' : 'q-pa-sm'">
          <router-view />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>
<style>
.q-router-link--active {
  /* background: #d6e7f4; */
  border-right: solid 10px #2096f3;
  color: #2096f3;
}
.menu_size {
  font-size: 10px !important;
}
</style>
