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
// import EssentialLink from 'components/EssentialLink.vue'
import { useUserData } from "stores/users/store";
import { storeToRefs } from "pinia";
import { colors, setCssVar, useQuasar, LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { useMainStoreData } from "stores/store";
import { useSettingData } from "stores/settings/SettingStore";
import { useProductDatas } from "stores/branch/productStores";
import cashierOwnerSelection from "components/cashier/cashierOwnerSelection.vue";
import { useCashierData } from "stores/branch/cashierStore";
import { useRoute, useRouter } from "vue-router";
import addDiscount from "components/branches/cashier/AddDiscount.vue";
import payBill from "components/branches/cashier/payBills.vue";
import addClient from "components/users/member/createMember.vue";
import { useCompanyData } from "src/stores/company/store";
const tab = ref("home");

const companyStore = useCompanyData();
const router = useRouter();
const showOwnerDialog = ref(false);

const productStores = useProductDatas();
const cashierStore = useCashierData();

const showDiscountDialog = ref(false);
const showPayBillDialog = ref(false);

const showAddClientDialog = ref(false);

// const itemUid = ref("");
const addNewClientFunc = () => {
  showAddClientDialog.value = true;
};
const discountDialogFunc = (id) => {
  // itemUid.value = id;
  cashierStore.selectedUid = id;
  showDiscountDialog.value = true;
};

const payBillFunc = () => {
  // console.log(formData.mop);
  cashierStore.balanceDue = cashierStore.total;
  showPayBillDialog.value = true;
};

const $q = useQuasar();

const route = useRoute();

const mainStore = useMainStoreData();

const loc = ref("Barbershop System");

const { themeColors } = storeToRefs(useSettingData());

const settingStore = useSettingData();
const removeFunc = (uid) => {
  cashierStore.removeProduct(uid);
};

let stringOptions = reactive([]);
const options = ref(stringOptions);
const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      options.value = stringOptions;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = stringOptions.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};
const selectedClientFunc = () => {
  // console.log(cashierStore.selectedClient);
};
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

const addQty = (uid) => {
  cashierStore.addQuantity(uid);
};

const minusQty = (uid) => {
  cashierStore.minusQuantity(uid);
};
const { lighten } = colors;

// $q.dark.set(true);

// setCssVar("primary", "#e6ebf1");

const userStore = useUserData();

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const miniState = ref(false);

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

const guestClientFunc = () => {
  if (cashierStore.client == "Client") {
    stringOptions = userStore.rowDatas;
    options.value = stringOptions;
  } else {
    cashierStore.selectedClient = null;
  }
};

const formData = reactive({
  branchs: null,
  users: null,
  subTotal: null,
  discount: null,
  total: null,
  cashEntered: null,
  change: null,
  mop: "cash",
});

const memberDatas = watch(
  () => userStore.branch,
  (newValue, oldValue) => {
    // link.value = newValue;
    // console.log(link.value);
  }
);

/**
 *
 * Discount Function
 *
 * */
const discountFunc = () => {
  productStores.addToCartPlan.change = 0;
  productStores.addToCartPlan.cash = "";
  productStores.addToCartPlan.total =
    productStores.selectedPlan[1].price - productStores.addToCartPlan.discount;
};

/**
 *
 * Cash Entered Function
 *
 * */
const cashEnteredFunc = () => {
  productStores.addToCartPlan.change =
    productStores.addToCartPlan.cash - productStores.addToCartPlan.total;
};

const checkoutDialog = () => {
  // console.log(productStores.addToCartPlan.cash);
  // console.log(productStores.addToCartPlan.total);
  if (
    parseFloat(productStores.addToCartPlan.cash) <
    parseFloat(productStores.addToCartPlan.total)
  ) {
    $q.notify({
      type: "negative",
      position: "top",
      timeout: 5000,
      message: "Insuficient Amount!",
    });
  } else {
    showOwnerDialog.value = true;
  }
};

const slug = ref(null);
const computedSlug = computed(() => {
  return userStore.userDetails.slug;
});

const slugWatch = watch(
  () => userStore.userDetails.slug,
  (newValue, oldValue) => {
    // console.log("new value" + newValue);
    // slug.value = newValue;
    if (route.params.slug) {
      if (newValue !== route.params.slug) {
        setTimeout(() => {
          $q.notify({
            type: "negative",
            position: "top",
            timeout: 5000,
            message:
              "Access Denied! You don't have permission to access this section!",
          });
          router.go(-1);
        }, 1000);
      }
    }
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
      {
        // icon: "boy",
        label: "Clients",
        to: "/user/members",
        role: ["super-admin"],
      },
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
  {
    icon: "o_fastfood",
    label: "Product",
    separator: false,
    role: ["owner"],
  },

  {
    icon: "o_construction",
    label: "Services",
    separator: false,
    role: ["owner"],
  },

  {
    icon: "o_inventory",
    label: "Inventory",
    to: "/inventory",
    separator: false,
    role: ["owner"],
  },

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

  {
    icon: "o_receipt",
    label: "Orders",
    to: slug.value + "/order",
    separator: false,
    role: ["owner"],
  },
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
    label: "Client",
    separator: false,
    role: ["cashier", "manager", "franchisee"],
  },
  {
    icon: "o_fastfood",
    label: "Products",
    to: "/branches/" + link.value + "/products",
    separator: false,
    role: ["manager", "cashier", "franchisee"],
    // permission: ["view-profile"],
  },

  {
    icon: "o_local_offer",
    label: "Voucher",
    to: "/voucher/",
    separator: false,
    role: ["manager"],
  },
  {
    icon: "o_shopping_cart",
    label: "Cashier",
    to: "/branches/" + userStore.userDetails.branch + "/cashier",
    // to: userStore,
    separator: false,
    role: ["manager", "cashier", "franchisee"],
    // permission: ["view-profile"],
  },
  {
    icon: "o_shopping_cart",
    label: "Expenses",
    to: "/branches/" + userStore.userDetails.branch + "/expenses",
    // to: userStore,
    separator: false,
    role: ["manager", "cashier", "franchisee"],
    // permission: ["view-profile"],
  },
  {
    icon: "o_shopping_cart",
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

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

const loginSubmit = () => {
  userStore.logoutUser();
};
onBeforeMount(() => {
  // userStore.getUserDetails();
});

const textColor = ref(null);
const mainColor = ref(null);

// const themeComputed = computed(
//   () => settingStore.themeColors,
//   (val) => {
//     console.log(val);
//   }
// );

/**
 *
 *  Watch header name for mobile view
 *
 * */
const updateLoc = watch(
  () => mainStore.loc,
  (newValue, oldValue) => {
    // console.log(newValue);
  }
);

const rowDatas = reactive([
  {
    name: "Classic Hair Cut",
    description: "Classic Hair Cut description",
    qty: 1,
    srp: 250,
    total: 250,
  },
  {
    name: "Premium Hair and beard Cut",
    description: "Premium Hair and beard Cut description",
    qty: 1,
    srp: 250,
    total: 250,
  },
]);

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
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "qty",
    label: "Qty",
    field: "qty",
    align: "left",
    sortable: true,
  },
  {
    name: "srp",
    label: "Price",
    field: "srp",
    align: "left",
    sortable: true,
  },
  {
    name: "total",
    label: "Total",
    field: "total",
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

// const theme = watch(
//   () => settingStore.themeColors,
//   (newValue, oldValue) => {
//   }
// );
const logo = ref(null);
const getBranchName = ref("");
onMounted(() => {
  companyStore.getCompany(route.params.slug ? route.params.slug : "admin");
  userStore.getUserDetails();
  userStore.getAllMembers(route.params.slug);
  // onLoad();
  if (LocalStorage.getItem("dark")) {
    $q.dark.set(LocalStorage.getItem("dark"));
  } else {
    LocalStorage.set("dark", false);
    $q.dark.set(LocalStorage.getItem("dark"));
  }
  // settingStore.getColor();
  link.value = LocalStorage.getItem("bb");

  setTimeout(() => {
    setColor();

    getBranchName.value = LocalStorage.getItem("branchName");
    stringOptions = userStore.rowDatas;
    options.value = stringOptions;
  }, 300);
  // getColor();
});

const setColor = () => {
  // console.log(themeColors.value);
  // setCssVar("primary", settingStore.themeColors.primary);
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
  <q-layout view="lHr lpR fFr">
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
        <!-- <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        /> -->
        <q-btn
          v-if="mainStore.loc != 'Dashboard'"
          flat
          dense
          round
          icon="arrow_back"
          @click="router.go(-1)"
        />

        <q-toolbar-title
          :class="$q.screen.gt.xs ? 'invisible' : 'text-center text-body2'"
        >
          {{ mainStore.loc }}
        </q-toolbar-title>

        <div>
          <!-- <span v-if="$q.screen.gt.xs">
            Welcome,
            {{
              userStore.userDetails.user ? userStore.userDetails.user.name : ""
            }}</span
          > -->
          <span class="text-body2 text-capitalize">
            <!-- <q-btn class="no-hover" unelevated dense ripple :to="'/account'">
              <q-avatar v-if="userStore.userDetails.user" size="32px">
                <img :src="userStore.userDetails.user.image_path" />
              </q-avatar>
              <q-icon v-else left name="account_circle" />
            </q-btn> -->
            <q-btn
              dense
              round
              flat
              icon="o_shopping_cart"
              @click="toggleRightDrawer"
            >
              <q-badge
                color="red"
                v-if="cashierStore.rowDatas.length > 0"
                floating
                transparent
              >
              </q-badge>
            </q-btn>
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

                      <q-item clickable v-ripple>
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
                    <div class="text-subtitle1 q-mt-md q-mb-xs">
                      {{
                        userStore.userDetails.user
                          ? userStore.userDetails.user.name
                          : ""
                      }}
                    </div>

                    <!-- icon="power_settings_new" -->
                    <q-btn
                      color="negative"
                      label="Logout"
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
          >Comprehensive Business Management &copy; Copyright 2024. All Right Reserved.
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
      :breakpoint="1500"
      show-if-above
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10 ' : 'text-dark bg-grey-2'
      "
    >
      <!-- <q-item-label class="text-dark" header> Menus </q-item-label> -->
      <div class="q-mt-md q-mb-lg border full-width">
        <q-img
          :src="logo"
          loading="lazy"
          :width="!miniState ? '100px' : '20px'"
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
        :class="!miniState ? 'text-dark q-pl-lg q-pr-lg' : ''"
        v-for="(menuItem, index) in essentialLinks"
        :key="index"
      >
        <q-expansion-item
          :expand-icon-class="$q.dark.isActive ? 'text-white ' : 'text-dark '"
          class="q-mb-sm"
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
                class="q-ml-sm q-mb-sm q-mt-sm"
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
                class="q-ml-sm q-mb-sm q-mt-sm"
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
          class="q-mb-sm"
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
              : menuItem.label == 'Benefits'
              ? `/${computedSlug}/branches/${link}/benefits`
              : menuItem.label == 'Products'
              ? `/${computedSlug}/branches/${link}/products`
              : menuItem.label == 'Voucher'
              ? `/${computedSlug}/branches/${link}/discount`
              : menuItem.label == 'Client'
              ? `/${computedSlug}/branches/${link}/client`
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
      <span
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
      </span>
    </q-drawer>

    <!-- right drawer for Billing ofr Payment Sidebar -->
    <q-drawer
      class="sidebar"
      :width="$q.platform.is.mobile ? 300 : 320"
      v-model="rightDrawerOpen"
      side="right"
      :breakpoint="767"
      show-if-above
      :class="
        $q.dark.isActive ? 'text-white bg-blue-grey-10' : 'text-dark bg-white'
      "
    >
      <!-- <q-item-label class="text-dark" header> Menus </q-item-label> -->
      <div class="q-mt-md q-mb-lg border full-width">
        <!-- <q-img
          src="/public/images/barracks_pngwhite.png"
          loading="lazy"
          width="100px"
          class="block q-mx-auto"
        /> -->
        <p class="q-pl-lg text-h6">
          <q-icon dense round flat name="o_shopping_cart" />Cart
        </p>
      </div>
      <div
        class="q-pa-md row items-start q-gutter-md full-width"
        v-if="productStores.selectedPlan.length > 0"
      >
        <q-card class="my-card full-width" flat bordered>
          <q-card-section horizontal>
            <q-card-section class="col-5 flex flex-center">
              <!-- <q-img
                class="rounded-borders"
                src="https://cdn.quasar.dev/img/parallax2.jpg"
              /> -->
              <q-img class="rounded-borders" src="/images/images.jpeg" />
            </q-card-section>
            <q-card-section
              class="q-pt-xs"
              :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
            >
              <div class="text-overline">
                {{ productStores.selectedPlan[1].name }}
              </div>
              <div class="text-caption text-grey">
                <span>1 x </span
                ><span class="float-right">{{
                  productStores.selectedPlan[1].price
                }}</span>
              </div>
            </q-card-section>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-input
              v-model="productStores.addToCartPlan.branches"
              dense
              filled
              label="Branch"
              class="q-mr-sm col-5 input_box"
              type="number"
            >
            </q-input>
            <q-input
              v-model="productStores.addToCartPlan.users"
              dense
              filled
              label="Users"
              class="q-mr-sm col-5 input_box"
              type="number"
            >
            </q-input>
          </q-card-actions>
        </q-card>
        <div class="row q-col-gutter-none relative-position">
          <div :class="$q.screen.gt.xs ? 'full-width' : 'full-width'">
            <span class="text-bold">Subtotal</span>
            <span class="float-right text-right"
              >P{{ productStores.addToCartPlan.subTotal }}</span
            >
          </div>
          <div
            :class="
              $q.screen.gt.xs ? 'full-width q-mt-md' : 'full-width q-mt-md'
            "
          >
            <q-input
              v-model="productStores.addToCartPlan.discount"
              dense
              filled
              label="Enter Discount"
              name="code"
              @update:model-value="discountFunc"
              type="text"
            >
              <template v-slot:prepend>
                <q-icon name="discount" />
              </template>
            </q-input>
            <q-separator class="q-mt-md" color="black" />
            <div :class="$q.screen.gt.xs ? 'full-width' : 'full-width'">
              <span class="text-bold">Total</span>
              <span class="float-right text-right"
                >P{{ productStores.addToCartPlan.total }}</span
              >
              <q-input
                v-model="productStores.addToCartPlan.cash"
                dense
                filled
                label="Enter Cash"
                name="code"
                class="q-mt-md"
                @update:model-value="cashEnteredFunc"
                type="text"
              >
                <template v-slot:prepend>
                  <q-icon name="o_attach_money" />
                </template>
              </q-input>
              <div
                :class="$q.screen.gt.xs ? 'full-width q-mt-md' : 'full-width'"
              >
                <span class="text-bold">Change</span>
                <span class="float-right text-right"
                  >P{{ productStores.addToCartPlan.change }}</span
                >
              </div>
            </div>
            <q-btn
              v-show="Object.keys(cashierStore.rowDatas).length !== 0"
              label="Checkout"
              color="blue"
              class="q-mt-md full-width"
              @click="checkoutDialog"
            />
          </div>
        </div>
      </div>
      <div
        v-if="cashierStore.rowDatas.length > 0"
        class="q-pa-md row items-start q-gutter-md full-width"
      >
        <q-card class="my-card full-width" flat bordered>
          <!-- <q-separator /> -->
          <q-card-section horizontal>
            <q-select
              class="my-card"
              filled
              :class="cashierStore.client != 'Client' ? 'full-width' : ''"
              v-model="cashierStore.client"
              :options="['Guest', 'Client']"
              label="Select Guest or Client"
              @update:model-value="guestClientFunc"
              style="width: 100px"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    no results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              filled
              v-if="cashierStore.client == 'Client'"
              v-model="cashierStore.selectedClient"
              use-input
              input-debounce="0"
              label="Search Client"
              :options="options"
              @filter="filterFn"
              style="width: 190px"
              behavior="menu"
              @update:model-value="selectedClientFunc"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-section
            class="q-pa-none"
            v-if="cashierStore.client == 'Client'"
          >
            <q-btn
              label="add new client"
              class="q-mt-sm q-ml-sm"
              color="primary"
              size="sm"
              @click="addNewClientFunc"
            />
          </q-card-section>
          <q-card-actions>
            <q-card
              class="my-card full-width"
              v-for="item in cashierStore.rowDatas"
              :key="item.id"
              flat
            >
              <q-card-section horizontal class="full-width">
                <q-card-section class="col-3 flex flex-center">
                  <q-img class="rounded-borders" :src="item.image" />
                </q-card-section>
                <q-card-section
                  class="full-width"
                  :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
                >
                  <div class="text-body1">{{ item.name }}</div>
                  <!-- <div class="text-overline text-grey">
                    <span>{{
                      item.description.length > 15
                        ? item.description.substring(0, 15) + "..."
                        : item.description
                    }}</span>
                  </div> -->
                  <div class="text-overline text-black full-width">
                    <div
                      class="full-width"
                      :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
                    >
                      <span class="">
                        <span class="q-mr-md">P{{ item.srp }}</span>
                        <span>
                          <q-btn
                            icon="remove"
                            size="7px"
                            @click="minusQty(item.uid)"
                            round
                            color="blue"
                          ></q-btn>
                          {{ item.qty }}

                          <q-btn
                            icon="add"
                            size="7px"
                            @click="addQty(item.uid)"
                            round
                            color="blue"
                          ></q-btn>
                        </span>
                        <span
                          style="font-weight: bold; float: right"
                          :style="
                            item.discount ? 'text-decoration:line-through' : ''
                          "
                          >P{{ parseFloat(item.srp) * parseFloat(item.qty) }}
                        </span>
                        <span
                          style="font-weight: bold; float: right"
                          v-if="item.discount"
                          >P{{ item.total }}
                        </span>
                      </span>
                    </div>
                  </div>
                </q-card-section>
              </q-card-section>
              <q-card-section
                align="right"
                style="margin-top: -20px; margin-bottom: -5px"
              >
                <q-btn
                  @click="discountDialogFunc(item.uid)"
                  icon="local_offer"
                  flat
                  label="Voucher"
                  color="orange"
                  size="sm"
                />
                <q-btn
                  label="remove"
                  icon="delete"
                  dense
                  flat
                  @click="removeFunc(item.uid)"
                  color="red"
                  size="sm"
                />
              </q-card-section>
              <!-- <q-separator />

              <q-card-section align="right">
                <q-btn
                  @click="discountDialogFunc(item.uid)"
                  icon="percent"
                  flat
                  label="Commission"
                  color="primary"
                  size="sm"
                />
              </q-card-section> -->
              <q-separator />
            </q-card>
            <!-- <q-table
              flat
              :pagination="pagination"
              class="q-pa-sm"
              :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
              dense
              table-style="width:320px;"
              :rows="rowDatas"
              :columns="columns"
              row-key="id"
              separator="none"
              :visible-columns="
                $q.screen.gt.xs
                  ? ['name', 'qty', 'srp', 'total']
                  : ['name', 'qty', 'srp', 'total']
              "
            >
              <template #body="props">
                <q-tr :props="props">
                  <q-td key="id" :props="props">
                    {{ props.row.id }}
                  </q-td>

                  <q-td key="name" :props="props">
                    <q-avatar rounded size="20px">
                      <q-img
                        class="rounded-borders"
                        src="/images/images.jpeg"
                      />
                    </q-avatar>
                    {{
                      props.row.name.length > 10
                        ? props.row.name.substring(0, 10) + "..."
                        : props.row.name
                    }}
                  </q-td>
                  <q-td key="qty" :props="props">
                    <q-btn
                      icon="remove"
                      size="7px"
                      @click="props.row.qty--"
                      round
                      color="blue"
                    ></q-btn>
                    {{ props.row.qty }}

                    <q-btn
                      icon="add"
                      size="7px"
                      @click="props.row.qty++"
                      round
                      color="blue"
                    ></q-btn>
                  </q-td>
                  <q-td key="srp" :props="props">
                    {{ props.row.srp }}
                  </q-td>
                  <q-td key="total" :props="props">
                    {{ props.row.total }}
                  </q-td>

                  <q-td key="action" :props="props">
                    <q-btn label="edit" color="blue" icon="add" size="sm" />
                    <q-btn
                      disable
                      label="edit"
                      color="blue"
                      icon="minus"
                      size="sm"
                    />
                  </q-td>
                </q-tr>
              </template>
            </q-table> -->
            <div
              class="full-width"
              style="position: relative; left: 3%; margin-top: 3%"
            >
              <!-- <div class="q-mt-sm row">
                <div class="col-9">Sub-total</div>
                <div class="col-3">P{{ cashierStore.subTotal }}</div>
              </div> -->
              <div class="q-mt-sm row">
                <div class="col-9">Total Discount</div>
                <div class="col-3">
                  P{{ cashierStore.totalDiscount }}
                  <!-- <q-btn
                    @click="discountDialogFunc"
                    icon="local_offer"
                    flat
                    color="orange"
                    size="sm"
                  /> -->
                </div>
                <!-- <div class="full-width">
                  <q-btn
                    @click="discountDialogFunc"
                    icon="local_offer"
                    flat
                    label="Add Voucher"
                    color="orange"
                    size="sm"
                  />
                </div> -->
              </div>
              <!-- <q-separator class="q-mt-sm q-mt-mb" /> -->
              <div class="q-mt-sm row">
                <div class="col-9">Total</div>
                <div class="col-3">P{{ cashierStore.total }}</div>
              </div>

              <!-- <h6
                style="margin-top: 20px; margin-bottom: -10px; font-size: 16px"
              >
                Payment Method
              </h6>
              <div class="q-mt-md q-mb-md">
                <q-btn-toggle
                  v-model="formData.mop"
                  name="mop"
                  toggle-color="blue"
                  @click="cashierStore.chooseMop(formData.mop)"
                  size="sm"
                  color="grey"
                  :options="[
                    {
                      label: 'Cash',
                      value: 'cash',
                    },
                    {
                      label: 'GCash',
                      value: 'gcash',
                    },
                  ]"
                >
                  <template v-slot:cash>
                    <q-icon name="local_atm" />
                  </template>
                  <template v-slot:gcash>
                    <q-icon name="account_balance_wallet" />
                  </template>
                </q-btn-toggle>
              </div> -->
              <div class="q-mt-lg q-mb-md text-center">
                <q-btn
                  style="width: 240px"
                  color="orange"
                  @click="payBillFunc"
                  label="Checkout"
                />
              </div>
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </q-drawer>

    <q-page-container>
      <div
        :class="
          $q.dark.isActive
            ? 'text-white bg-blue-grey-10 q-pa-lg'
            : 'text-dark  bg-grey-2 q-pa-lg'
        "
      >
        <router-view />
      </div>
    </q-page-container>
    <q-dialog v-model="showOwnerDialog">
      <cashierOwnerSelection
        @hide-company-dialog="showOwnerDialog != showOwnerDialog"
      />
    </q-dialog>
    <q-dialog v-model="showDiscountDialog" persistent>
      <addDiscount
        @hide-discount-dialog="showDiscountDialog = !showDiscountDialog"
      />
    </q-dialog>

    <q-dialog v-model="showPayBillDialog" persistent>
      <payBill @hide-pay-dialog="showPayBillDialog = !showPayBillDialog" />
    </q-dialog>
    <q-dialog persistent v-model="showAddClientDialog">
      <addClient
        @hide-create-dialog="showAddClientDialog = !showAddClientDialog"
        @update-client="guestClientFunc"
      />
    </q-dialog>
  </q-layout>
</template>
<style>
.sidebar .q-router-link--exact-active {
  color: #e6ebf1 !important;
  background-color: rgb(43, 94, 198) !important;
  border-radius: 10px !important;
}
.sidebar div .q-hoverable:hover {
  border-radius: 5px !important;
}
.q-router-link--exact-active div {
  background-color: none !important;
}
</style>
<style scoped>
.input_box {
}
</style>
<!-- src/stores/branch/productStores -->
